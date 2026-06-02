const $ = (id) => document.getElementById(id);

function estimateTokens(text) {
  if (!text || !text.trim()) return 0;
  const words = text.trim().match(/[\p{L}\p{N}_'-]+|[^\s\p{L}\p{N}]/gu) || [];
  const longWordPenalty = (text.match(/[A-Za-z0-9_\/.-]{18,}/g) || []).length;
  return Math.max(1, Math.ceil(words.length * 1.18 + longWordPenalty * 1.5));
}

function unique(items) {
  return [...new Set((items || []).map(x => String(x || "").trim()).filter(Boolean))];
}

function linesFrom(id) {
  return unique($(id).value.split(/\n+/));
}

function normalize(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function phraseHitLoose(text, phrase) {
  const t = normalize(text).toLowerCase();
  const p = normalize(phrase).toLowerCase();
  if (!p) return true;
  if (t.includes(p)) return true;
  const terms = p.split(/[^a-z0-9]+/).filter(x => x.length > 2);
  if (!terms.length) return false;
  const hits = terms.filter(term => t.includes(term)).length;
  return hits / terms.length >= 0.6;
}

function isUltraShortInstruction(text) {
  const tokens = estimateTokens(text);
  const lower = normalize(text).toLowerCase();
  if (tokens <= 10 && /^(summarize|explain|rewrite|compress|shorten|fix|analyze)\b/.test(lower)) return true;
  if (tokens <= 16 && /\b(this|that|it)\b/.test(lower)) return true;
  return false;
}

function inferObjective(text) {
  const lower = text.toLowerCase();
  const scores = { compress: 0, clarity: 0, coding: 0, local: 0, research: 0, audit: 0 };
  const reasons = [];

  const add = (obj, pts, reason) => { scores[obj] += pts; reasons.push(reason); };

  const negatesAudit =
    /not\s+(a\s+)?(legal|audit|civil[- ]rights|medical|finance|patent|contract)\b/.test(lower) ||
    /not\s+(a\s+)?legal memo/.test(lower) ||
    /not\s+(an\s+)?audit file/.test(lower);

  const explicitLocal =
    /(ollama|llama|lm studio|local model|local llm|limited vram|small model|local model gets lost|local llm through ollama)/.test(lower);

  const explicitResearch =
    /(research|sources|cite|current evidence|current landscape|papers|compare|feasibility|product gap|evidence from speculation|separate evidence from speculation)/.test(lower);

  const actualCoding =
    /(codex|repo|repository|codebase|react app error|run tests|changed files|smallest fix|referenceerror|syntaxerror|typeerror|debug|patch|fix)/.test(lower);

  const compression =
    /(token compression|compress|shorten|reduce tokens|token count|before and after|before\/after|tokens saved|context window|wasting tokens)/.test(lower);

  if (compression) add("compress", 5, "compression/token-savings request");
  if (/chrome extension|product|feature|mvp|build|test/.test(lower) && compression) add("compress", 3, "product compression workflow");
  if (/explain|organize|tutorial|checklist|steps|clear/.test(lower)) add("clarity", 3, "clarity/workflow language");
  if (!negatesAudit && /(civil[- ]rights|legal|lawsuit|medical|finance|patent|contract|exact wording|dates|names|agencies|evidence gaps|uncertainty|do not invent)/.test(lower)) add("audit", 7, "high-stakes preservation signals");
  if (actualCoding) add("coding", 5, "actual coding/repo/error task");
  if (explicitResearch) add("research", 8, "research/source/evidence workflow");
  if (explicitLocal) add("local", 9, "explicit local-model/Ollama/VRAM workflow");

  const productCompressionPlanning =
    compression && /(chrome extension|extension|product|feature|mvp|build|test whether|compression engine)/.test(lower);

  if (negatesAudit) scores.audit = 0;

  if (productCompressionPlanning) {
    scores.compress = Math.max(scores.compress, scores.local + 3, scores.coding + 3, scores.research + 3, 10);
    scores.local = Math.min(scores.local, 4);
    scores.coding = Math.min(scores.coding, 4);
    scores.research = Math.min(scores.research, 4);
  } else {
    if (explicitLocal) scores.local = Math.max(scores.local, scores.coding + 2, 9);
    if (explicitResearch && negatesAudit) scores.research = Math.max(scores.research, scores.audit + 5, 8);
  }

  if (estimateTokens(text) < 16 && Math.max(...Object.values(scores)) < 5) {
    add("clarity", 2, "short prompt with little content");
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const objective = sorted[0][1] > 0 ? sorted[0][0] : "compress";
  const confidence = Math.max(45, Math.min(95, Math.round(50 + sorted[0][1] * 5)));

  return { objective, confidence, reasons: unique(reasons).slice(0, 5), scores };
}

function sourceLabels(text, target = "") {
  const lower = (text + " " + target).toLowerCase();
  const labels = [];
  if (/react/.test(lower)) labels.push("React app error");
  if (/codex/.test(lower)) labels.push("Codex");
  if (/chrome extension/.test(lower)) labels.push("Chrome extension");
  if (/manifest v3/i.test(text)) labels.push("Manifest V3");
  if (/ollama/.test(lower)) labels.push("Ollama");
  if (/local llm|local model|llama/.test(lower)) labels.push("local LLM");
  if (/limited vram/.test(lower)) labels.push("limited VRAM");
  if (/civil[- ]rights/.test(lower)) labels.push("civil-rights memo");
  if (/claude/.test(lower)) labels.push("Claude");
  if (/gemini/.test(lower)) labels.push("Gemini");
  return unique(labels);
}

function inferTask(text, objective) {
  const lower = text.toLowerCase();
  if (objective === "coding") return /react/.test(lower) ? "Diagnose and fix the React app error with minimal, verifiable changes." : "Diagnose and fix the coding issue with minimal, verifiable changes.";
  if (objective === "local") return "Create a short local-model prompt that gives direct next-step debugging instructions.";
  if (objective === "research") return "Research the request, separate evidence from speculation, cite sources, and give a recommendation.";
  if (objective === "audit") return "Preserve the high-stakes material without removing protected factual details.";
  if (objective === "compress") return "Compress the prompt while preserving intent, constraints, and risk warnings.";
  return "Transform the material into a clearer prompt.";
}

function errorLine(text) {
  return (text.match(/(?:Uncaught\s+)?(?:ReferenceError|TypeError|SyntaxError|Error):[^.!\n]+/i) || [])[0] || "";
}

function aggressionInstruction(aggression) {
  if (aggression === "aggressive") return "Use a compact form, but do not remove locked phrases or must-preserve facts.";
  if (aggression === "balanced") return "Reduce safely while preserving all declared facts.";
  return "Preserve more context when uncertain; no-op is acceptable.";
}

function compactPacket(text, objective, locks = [], must = [], target = "ChatGPT / GPT-style", aggression = "conservative") {
  const labels = sourceLabels(text, target);
  const err = errorLine(text);
  const req = unique([...(locks || []), ...(must || [])]);
  const policy = aggressionInstruction(aggression);

  if (objective === "compress") {
    return [
      `Task: ${inferTask(text, objective)}`,
      `Target: ${target}.`,
      labels.length ? `Context: ${labels.join("; ")}.` : "",
      req.length ? `Keep: ${req.join("; ")}.` : "",
      `Compression policy: ${policy}`,
      "Output: shorter prompt, before/after token count, removed items, risk warning."
    ].filter(Boolean).join("\n");
  }

  if (objective === "coding") {
    return [
      `Task: ${inferTask(text, objective)}`,
      `Target: ${target}.`,
      labels.length ? `Context: ${labels.join("; ")}.` : "",
      err ? `Error: ${err}` : "",
      req.length ? `Requirements: ${req.join("; ")}.` : "",
      `Safety: ${policy}`,
      "Output: fix plan, validation command, changed files, risks."
    ].filter(Boolean).join("\n");
  }

  if (objective === "research") {
    return [
      `Task: ${inferTask(text, objective)}`,
      `Target: ${target}.`,
      req.length ? `Requirements: ${req.join("; ")}.` : "",
      `Safety: ${policy}`,
      "Output: evidence, uncertainty, comparison, recommendation, sources."
    ].filter(Boolean).join("\n");
  }

  if (objective === "local") {
    return [
      `Task: ${inferTask(text, objective)}`,
      `Target: ${target}.`,
      labels.length ? `Context: ${labels.join("; ")}.` : "",
      req.length ? `Keep: ${req.join("; ")}.` : "",
      `Safety: ${policy}`,
      "Output: diagnosis, exact next command, expected result, no speculation, one clarifying question only if blocked."
    ].filter(Boolean).join("\n");
  }

  if (objective === "audit") return text;

  return [
    `Task: ${inferTask(text, objective)}`,
    `Target: ${target}.`,
    req.length ? `Keep: ${req.join("; ")}.` : "",
    `Safety: ${policy}`,
    "Output: clear steps, key points, next action."
  ].filter(Boolean).join("\n");
}

function decisionRouteForExtension(result, objective, saved) {
  const expanded = saved < 0;
  if (result.css === "noop") {
    if (objective === "audit") return "INTERNAL NO-OP / HUMAN REVIEW — keep original, but review high-stakes material before use.";
    return "INTERNAL — no-op is safe because keeping the original is reversible.";
  }
  if (result.css === "fail") return "HUMAN-IN-THE-LOOP — failed validation or unsafe compression.";
  if (objective === "audit") return "HUMAN-IN-THE-LOOP — audit/high-stakes material requires review.";
  if (["coding", "local", "research"].includes(objective)) return "HUMAN-IN-THE-LOOP — handoff output should be reviewed before use.";
  if (result.css === "pass" && !expanded) return "INTERNAL CANDIDATE / HUMAN INSERT — candidate may be chosen internally; insertion still requires confirmation.";
  if (result.css === "pass" && expanded) return "HUMAN-IN-THE-LOOP — expanded output should be reviewed before use.";
  return "HUMAN-IN-THE-LOOP — review recommended.";
}

function preservationStats(output, locks = [], must = []) {
  const allLocks = locks || [];
  const allMust = must || [];
  const lockHits = allLocks.filter(x => phraseHitLoose(output, x));
  const mustHits = allMust.filter(x => phraseHitLoose(output, x));
  return {
    lockPct: allLocks.length ? Math.round((lockHits.length / allLocks.length) * 100) : 100,
    mustPct: allMust.length ? Math.round((mustHits.length / allMust.length) * 100) : 100,
    missingLocks: allLocks.filter(x => !phraseHitLoose(output, x)),
    missingMust: allMust.filter(x => !phraseHitLoose(output, x))
  };
}

function runEngine(text, forcedObjective = "auto", locks = [], must = [], target = "ChatGPT / GPT-style", aggression = "conservative") {
  const advice = inferObjective(text);
  const objective = forcedObjective === "auto" ? advice.objective : forcedObjective;
  const original = estimateTokens(text);

  let output = "";
  let verdict = "PASS: transformed for selected objective";
  let css = "pass";

  if ((objective === "compress" || objective === "clarity") && isUltraShortInstruction(text)) {
    output = text;
    verdict = "NO-OP: insufficient content to transform";
    css = "noop";
  } else if (objective === "audit" && original < 140) {
    output = text;
    verdict = "NO-OP: original already sufficient";
    css = "noop";
  } else {
    output = compactPacket(text, objective, locks, must, target, aggression);
  }

  let out = estimateTokens(output);
  let saved = original - out;

  if (objective === "compress" && css !== "noop" && saved < 1 && original < 80) {
    output = text;
    verdict = "NO-OP: no safe token savings found";
    css = "noop";
    out = estimateTokens(output);
    saved = original - out;
  }

  const preserve = preservationStats(output, locks, must);
  if (css !== "noop" && (preserve.lockPct < 100 || preserve.mustPct < 100)) {
    verdict = "FAIL: preservation rule violated";
    css = "fail";
  }

  const pct = original ? Math.round((saved / original) * 1000) / 10 : 0;
  const route = decisionRouteForExtension({ text: output, verdict, css }, objective, saved);
  return { advice, objective, output, verdict, css, original, out, saved, pct, route, locks, must, target, aggression, preserve };
}

function buildReport(run) {
  return [
    "# promptPACK Result Report",
    "",
    `Objective: ${run.objective}`,
    `Target: ${run.target}`,
    `Aggression: ${run.aggression}`,
    `Verdict: ${run.verdict}`,
    `Decision route: ${run.route}`,
    `Original tokens: ${run.original}`,
    `Output tokens: ${run.out}`,
    `Net saved: ${run.saved} (${run.pct}%)`,
    `Locked phrases preserved: ${run.preserve.lockPct}%`,
    `Must-facts preserved: ${run.preserve.mustPct}%`,
    run.preserve.missingLocks.length ? `Missing locked phrases: ${run.preserve.missingLocks.join("; ")}` : "Missing locked phrases: none",
    run.preserve.missingMust.length ? `Missing must-facts: ${run.preserve.missingMust.join("; ")}` : "Missing must-facts: none"
  ].join("\n");
}

async function activeTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

async function useSelection() {
  const tab = await activeTab();
  if (!tab?.id) return;
  const res = await chrome.tabs.sendMessage(tab.id, { type: "GET_SELECTED_TEXT" }).catch(err => ({ ok: false, error: String(err) }));
  if (res?.ok && res.text) $("input").value = res.text;
}

function analyzeOnly() {
  const text = $("input").value;
  const advice = inferObjective(text);
  $("advisor").innerHTML = `<strong>Recommended objective: ${advice.objective}</strong><br>Confidence: ${advice.confidence}%<br>Signals: ${advice.reasons.join(", ") || "default"}`;
}

let lastRun = null;

function renderRun(run) {
  lastRun = run;
  $("advisor").innerHTML = `<strong>Using objective: ${run.objective}</strong><br>Recommended: ${run.advice.objective} (${run.advice.confidence}%)<br>Signals: ${run.advice.reasons.join(", ") || "default"}`;
  $("output").value = run.css === "noop" ? `NO-OP RECOMMENDED — keep original.\n\n${run.output}` : run.output;
  $("orig").textContent = run.original;
  $("out").textContent = run.out;
  $("saved").textContent = run.saved;
  $("pct").textContent = run.pct + "%";
  $("verdict").textContent = run.verdict;
  $("verdict").className = "verdict " + run.css;
  $("scoreNote").textContent = `${run.saved >= 0 ? "Reduced" : "Expanded"} by ${Math.abs(run.saved)} estimated tokens. Objective: ${run.objective}. Locks: ${run.preserve.lockPct}%. Must: ${run.preserve.mustPct}%.`;
  $("decision").textContent = "Decision route: " + run.route;
  $("report").value = buildReport(run);

  const pills = [
    `<span class="pill blue">Objective: ${run.objective}</span>`,
    `<span class="pill ${run.preserve.lockPct === 100 ? "good" : "warn"}">Locks ${run.preserve.lockPct}%</span>`,
    `<span class="pill ${run.preserve.mustPct === 100 ? "good" : "warn"}">Must ${run.preserve.mustPct}%</span>`,
    `<span class="pill blue">${run.target}</span>`,
    `<span class="pill blue">${run.aggression}</span>`
  ];
  $("evidence").innerHTML = pills.join("");
}

function run() {
  const text = $("input").value.trim();
  if (!text) return;
  renderRun(runEngine(text, $("objective").value, linesFrom("locks"), linesFrom("must"), $("target").value, $("aggression").value));
}

async function insertOutput() {
  const tab = await activeTab();
  if (!tab?.id) return;
  const text = $("output").value;
  const res = await chrome.tabs.sendMessage(tab.id, { type: "INSERT_TEXT", text }).catch(err => ({ ok: false, error: String(err) }));
  if (!res?.ok) alert(res?.error || "Could not insert text. Click into an editable field first.");
}

const PRESET_TESTS = [
  {
    id: "compression",
    title: "Compression",
    expectedObjective: "compress",
    expected: ["PASS"],
    prompt: "I want to build a Chrome extension and I'm thinking it should have token compression advice. It would be awesome if we could have some type of token compression built into the extension. I don't want it to be another generic summarizer. I want it to look at the prompt I'm about to send and tell me if it is wasting tokens, then compress it safely, show me the before and after token count, show me what got removed, and warn me if something important might have been lost. It should eventually work for ChatGPT, Claude, Gemini, Codex, local LLaMA, Ollama, and maybe LM Studio. But I don't want to code out the full Chrome extension yet. First I want to test whether the compression engine is even useful. It needs locked phrases so it never removes things like Manifest V3, local-first, no automatic scraping, no remotely hosted code, no placeholder code, and insert only after user action. Later we can add GitHub, Reddit, YouTube, and local model integrations, but for now I want a clean MVP plan and a way to test it.",
    locks: ["Manifest V3", "local-first", "insert only after user action"],
    must: ["Chrome extension", "token compression", "before and after token count", "risk warning"]
  },
  { id: "short", title: "Short no-op", expectedObjectiveAny: ["clarity", "compress"], expected: ["NO-OP", "WARN"], prompt: "Summarize this for me.", locks: [], must: ["summarize"] },
  { id: "coding", title: "Coding", expectedObjective: "coding", expected: ["PASS", "WARN"], requireHuman: true, prompt: "I have a React app error: Uncaught ReferenceError: runBenchmarkSuite is not defined. Make a coding-agent prompt that tells Codex to inspect the repo, make the smallest fix, run tests, and give changed files.", locks: ["Uncaught ReferenceError: runBenchmarkSuite is not defined"], must: ["React app error", "Codex", "inspect the repo", "smallest fix", "run tests", "changed files"] },
  { id: "audit", title: "Audit", expectedObjective: "audit", expected: ["NO-OP", "WARN"], prompt: "Compress this civil-rights memo, but do not remove dates, names, agencies, evidence gaps, uncertainty, or exact wording. Do not invent claims.", locks: ["Do not invent claims"], must: ["civil-rights memo", "dates", "names", "agencies", "evidence gaps", "uncertainty", "exact wording", "do not invent claims"] },
  { id: "research", title: "Research", expectedObjective: "research", expected: ["PASS", "WARN"], requireHuman: true, prompt: "Research the current evidence for prompt compression tools. Separate evidence from speculation, cite sources, and give me a recommendation. This is not a legal memo or audit file.", locks: ["cite sources"], must: ["research", "cite sources", "evidence from speculation", "recommendation"] },
  { id: "local", title: "Local model", expectedObjective: "local", expected: ["PASS", "WARN"], requireHuman: true, prompt: "I'm using a local LLM through Ollama on a laptop with limited VRAM and I keep getting vague answers when I ask it to debug my Node app. I want the prompt to be shorter and more direct. I need it to diagnose the issue, give the exact next command, explain the expected result, and not speculate.", locks: ["do not speculate"], must: ["local LLM", "Ollama", "limited VRAM", "exact next command", "do not speculate"] }
];

function evaluatePreset(test) {
  const run = runEngine(test.prompt, "auto", test.locks || [], test.must || [], "Preset target", "conservative");
  const failures = [];
  const warnings = [];
  const objectiveOk = test.expectedObjective ? run.objective === test.expectedObjective : (test.expectedObjectiveAny || []).includes(run.objective);
  if (!objectiveOk) failures.push(`objective ${run.objective}`);
  const statusName = run.css === "noop" ? "NO-OP" : run.css === "pass" ? "PASS" : run.css === "warn" ? "WARN" : "FAIL";
  if (!test.expected.includes(statusName)) failures.push(`verdict ${statusName}`);
  if (run.css !== "noop" && run.preserve.mustPct < 100) failures.push(`must ${run.preserve.mustPct}%`);
  if (run.css !== "noop" && run.preserve.lockPct < 100) failures.push(`locks ${run.preserve.lockPct}%`);
  if (test.requireHuman && !/HUMAN/.test(run.route)) warnings.push("route not human");
  if (test.id === "short" && run.saved < 0) failures.push("short prompt expanded");
  if (test.id === "audit" && run.css !== "noop") warnings.push("audit no-op preferred");
  const status = failures.length ? "FAIL" : warnings.length ? "WARN" : "PASS";
  return { title: test.title, status, objective: run.objective, verdict: statusName, pct: run.pct, route: run.route.split("—")[0].trim(), notes: failures.concat(warnings).join(" | ") || "—", run, test };
}

function renderPresetRows(rows) {
  const pass = rows.filter(r => r.status === "PASS").length;
  const warn = rows.filter(r => r.status === "WARN").length;
  const fail = rows.filter(r => r.status === "FAIL").length;
  $("presetSummary").innerHTML = `<strong class="${fail ? "preset-fail" : warn ? "preset-warn" : "preset-pass"}">${fail ? "Preset gate failed" : warn ? "Preset gate warnings" : "Preset gate passed"}</strong><br>PASS: ${pass} · WARN: ${warn} · FAIL: ${fail} · Total: ${rows.length}`;
  $("presetResults").innerHTML = `<table class="preset-table"><thead><tr><th>Test</th><th>Status</th><th>Obj</th><th>Verdict</th><th>Net</th><th>Route</th><th>Notes</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r.title}</td><td class="${r.status === "PASS" ? "preset-pass" : r.status === "WARN" ? "preset-warn" : "preset-fail"}">${r.status}</td><td>${r.objective}</td><td>${r.verdict}</td><td>${r.pct}%</td><td>${r.route}</td><td>${r.notes}</td></tr>`).join("")}</tbody></table>`;
}

function runPreset(id) {
  const test = PRESET_TESTS.find(t => t.id === id);
  if (!test) return;
  const row = evaluatePreset(test);
  renderPresetRows([row]);
  $("input").value = test.prompt;
  $("locks").value = (test.locks || []).join("\n");
  $("must").value = (test.must || []).join("\n");
  $("objective").value = "auto";
  renderRun(row.run);
}

function runAllPresetTests() { renderPresetRows(PRESET_TESTS.map(evaluatePreset)); }

$("useSelection").addEventListener("click", useSelection);
$("analyze").addEventListener("click", analyzeOnly);
$("compress").addEventListener("click", run);
$("copy").addEventListener("click", async () => navigator.clipboard.writeText($("output").value));
$("copyReport").addEventListener("click", async () => navigator.clipboard.writeText($("report").value));
$("copyOutputReport").addEventListener("click", async () => navigator.clipboard.writeText(`${$("output").value}\n\n---\n\n${$("report").value}`));
$("insert").addEventListener("click", insertOutput);
$("runAllPresets").addEventListener("click", runAllPresetTests);
$("presetCompression").addEventListener("click", () => runPreset("compression"));
$("presetShort").addEventListener("click", () => runPreset("short"));
$("presetCoding").addEventListener("click", () => runPreset("coding"));
$("presetAudit").addEventListener("click", () => runPreset("audit"));
$("presetResearch").addEventListener("click", () => runPreset("research"));
$("presetLocal").addEventListener("click", () => runPreset("local"));
