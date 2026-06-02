const fs = require("fs");

const required = [
  "tests/manual-smoke-page.html",
  "docs/release/MANUAL_BROWSER_SMOKE_TEST.md",
  "docs/release/NETWORK_VERIFICATION.md",
  "docs/release/CHROME_WEB_STORE_SUBMISSION.md"
];

for (const file of required) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing manual QA artifact: ${file}`);
  }
}

console.log("manual QA artifacts present");
console.log("Manual browser tests still require Chrome.");
