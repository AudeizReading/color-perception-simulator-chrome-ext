function setChromeSidePanelBehavior(openPanelOnActionClick = true) {
  // Set the side panel behavior to open when the user clicks on the extension action button
  // But can lead to race conditions if the user clicks too fast
  // That's why it has been re-launched at runtime.onInstalled time
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick })
    .catch((error) => console.error(error));
}

setChromeSidePanelBehavior();

chrome.runtime.onInstalled.addListener((details) => {
  const manifest = chrome.runtime.getManifest();
  console.log(
    manifest.name,
    "version",
    manifest.version,
    "installed reason:",
    details.reason
  );

  // Set it by security at installion
  setChromeSidePanelBehavior();

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
