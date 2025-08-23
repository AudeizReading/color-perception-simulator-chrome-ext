chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener((details) => {
  console.log(
    chrome.runtime.getManifest().name,
    "version",
    chrome.runtime.getManifest().version,
    "installed reason:",
    details.reason
  );

  chrome.contextMenus.create({
    id: "openSidePanel",
    title: chrome.i18n.getMessage("context_menu_title"),
    contexts: ["all"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openSidePanel") {
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});
