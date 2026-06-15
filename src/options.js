const KEY = 'pp:options';

async function load() {
  const data = await chrome.storage.local.get(KEY);
  const opts = data[KEY] || {};
  document.getElementById('defaultObjective').value = opts.defaultObjective || 'auto';
  document.getElementById('tokenBudget').value = opts.tokenBudget || 2048;
  document.getElementById('defaultAggression').value = opts.defaultAggression || 'conservative';
}

document.getElementById('save').addEventListener('click', async () => {
  const opts = {
    defaultObjective: document.getElementById('defaultObjective').value,
    tokenBudget: parseInt(document.getElementById('tokenBudget').value, 10) || 2048,
    defaultAggression: document.getElementById('defaultAggression').value,
  };
  await chrome.storage.local.set({ [KEY]: opts });
  document.getElementById('status').textContent = 'Saved.';
});

load();