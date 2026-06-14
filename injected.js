window.sendToExtension = (text) => {
  window.postMessage({ type: "TO_EXTENSION", message: text }, "*");
};
