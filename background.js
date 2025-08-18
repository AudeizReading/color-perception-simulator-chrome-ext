// Only added for complying with the manifest v3 requirements
// This file is not used in the extension but is required for the manifest v3
chrome.runtime.onInstalled.addListener((details) => {
  console.log(
    "Extension updated to version:",
    chrome.runtime.getManifest().version
  );
  if (details.reason === "update") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.url) return;
      const url = tab.url;

      // On évite les chrome:// etc
      if (
        url.startsWith("chrome://") ||
        url.startsWith("chrome-extension://") ||
        url.startsWith("https://chrome.google.com/webstore")
      ) {
        console.error(
          chrome.i18n.getMessage("error_extension_usage_title"),
          chrome.i18n.getMessage("error_extension_usage_message")
        );
        return;
      }
    });
  }

  chrome.contextMenus.create({
    id: "openSidePanel",
    title: chrome.i18n.getMessage("context_menu_title"),
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

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (tab.url) {
    if (
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("chrome-extension://") ||
      tab.url.startsWith("chrome.google.com/webstore")
    ) {
      // Désactiver le side panel pour cet onglet
      chrome.sidePanel.setOptions({ tabId, enabled: false });
    } else {
      // Réactiver sur les autres sites
      chrome.sidePanel.setOptions({ tabId, enabled: true });
    }
  }
});
