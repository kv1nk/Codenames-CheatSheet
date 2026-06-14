chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("content.js получил:", message);
  sendResponse({ reply: "привет из страницы!" });
});
