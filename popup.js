document.getElementById("btn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { text: "привет из попапа!" }, (response) => {
      document.getElementById("out").textContent = "Ответ: " + response.reply;
    });
  });
});
