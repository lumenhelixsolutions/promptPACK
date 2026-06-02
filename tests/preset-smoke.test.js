const fs = require("fs");
const vm = require("vm");

const code = fs.readFileSync("src/sidepanel.js", "utf8");

const elements = new Map();
function makeEl(id) {
  return {
    id,
    value: "",
    textContent: "",
    innerHTML: "",
    className: "",
    dataset: {},
    addEventListener() {},
    style: {}
  };
}

const sandbox = {
  console,
  document: {
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, makeEl(id));
      return elements.get(id);
    }
  },
  navigator: { clipboard: { writeText: async () => {} } },
  chrome: { tabs: { query: async () => [], sendMessage: async () => ({ ok: false }) } }
};

vm.createContext(sandbox);
vm.runInContext(`${code}
  globalThis.__results = PRESET_TESTS.map(evaluatePreset).map(r => ({
    title: r.title,
    status: r.status,
    objective: r.objective,
    verdict: r.verdict,
    net: r.pct,
    route: r.route,
    notes: r.notes
  }));
`, sandbox);

const results = sandbox.__results;
const failed = results.filter(r => r.status === "FAIL");

console.table(results);

if (failed.length) {
  throw new Error(`Preset gate failed: ${failed.map(f => `${f.title}: ${f.notes}`).join("; ")}`);
}

console.log(`Preset gate passed: ${results.length}/${results.length}`);
