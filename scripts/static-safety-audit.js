const fs = require("fs");
const files=["src/service_worker.js","src/content_script.js","src/sidepanel.js","src/sidepanel.html","manifest.json"];
const forbidden=["fetch(","XMLHttpRequest","navigator.sendBeacon","http://","https://","<script src=\"http","<script src='http","chrome.history","chrome.cookies","chrome.bookmarks","chrome.webRequest"];
let hits=[];
for (const file of files){ if(!fs.existsSync(file)) throw new Error(`Missing file: ${file}`); const text=fs.readFileSync(file,"utf8"); for (const p of forbidden){ if(text.includes(p)) hits.push(`${file}: ${p}`); }}
const manifest=JSON.parse(fs.readFileSync("manifest.json","utf8")); if((manifest.host_permissions||[]).length!==0) hits.push("manifest.json: expected no broad host_permissions");
if(hits.length){ console.error("Static safety audit failed:"); for(const h of hits) console.error("- "+h); process.exit(1); }
console.log("static safety audit passed");
