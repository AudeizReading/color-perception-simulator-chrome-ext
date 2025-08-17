// Only added for complying with the manifest v3 requirements
// This file is not used in the extension but is required for the manifest v3
chrome.runtime.onInstalled.addListener(() => {
  console.log("Color Perception Simulator installed.");
  chrome.contextMenus.create({
    id: "openSidePanel",
    title: "Open in side panel",
    contexts: ["all"],
  });
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openSidePanel") {
    // This will open the panel in all the pages on the current window.
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});
