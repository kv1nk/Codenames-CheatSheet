// Кнопка — отправляет сообщение в content.js
document.getElementById("btn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { text: "привет из попапа!" }, (response) => {
      document.getElementById("out").textContent = "Ответ: " + response.reply;
    });
  });
});

// Читаем storage при открытии попапа
chrome.storage.local.get("message", (result) => {
  if (result.message) {
    document.getElementById("out").textContent = result.message;
  }
});

// Обновляем в реальном времени когда storage меняется
chrome.storage.onChanged.addListener((changes) => {
  if (changes.message) {
    document.getElementById("out").textContent = changes.message.newValue;
  }
});
