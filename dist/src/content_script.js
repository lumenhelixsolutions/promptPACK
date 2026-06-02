function getSelectedText() {
  const selection = window.getSelection();
  return selection ? selection.toString() : "";
}

function findActiveEditable() {
  const active = document.activeElement;
  if (!active) return null;
  if (active.tagName === "TEXTAREA" || active.tagName === "INPUT") return active;
  if (active.isContentEditable) return active;
  return null;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || !message.type) return;

  if (message.type === "GET_SELECTED_TEXT") {
    sendResponse({ ok: true, text: getSelectedText(), title: document.title, url: location.href });
    return true;
  }

  if (message.type === "INSERT_TEXT") {
    const el = findActiveEditable();
    if (!el) {
      sendResponse({ ok: false, error: "No active editable field found. Click into a prompt box first." });
      return true;
    }

    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") {
      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? el.value.length;
      el.value = el.value.slice(0, start) + message.text + el.value.slice(end);
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (el.isContentEditable) {
      document.execCommand("insertText", false, message.text);
    }

    sendResponse({ ok: true });
    return true;
  }
});
