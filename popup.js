document.getElementById("protanope").addEventListener("click", () => {
  applyFilter("protanope");
});
document.getElementById("deuteranope").addEventListener("click", () => {
  applyFilter("deuteranope");
});
document.getElementById("tritanope").addEventListener("click", () => {
  applyFilter("tritanope");
});
document.getElementById("reset").addEventListener("click", () => {
  applyFilter("reset");
});

function applyFilter(filter) {
  console.error("applyFilter", filter);
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.scripting.executeScript({
        target: {
          tabId: tabs[0].id,
        },
        files: [`filters/${filter}.js`],
      });
    }
  );
}
