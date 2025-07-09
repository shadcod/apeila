document.getElementById('goToAli').addEventListener('click', () => {
  chrome.tabs.create({ url: "https://www.aliexpress.com/" });
});
