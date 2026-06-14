const script = document.createElement("script");
script.src = chrome.runtime.getURL("injected.js");
document.documentElement.appendChild(script);

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.type !== "TO_EXTENSION") return;

  chrome.storage.local.set({ message: event.data.message });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("content.js получил:", message);
  sendResponse({ reply: "привет из страницы!" });
});
