function isBlockedUrl(url) {
  try {
    const u = new URL(url);
    forbiddenProtocols = [
      "chrome:",
      "chrome-extension:",
      "edge:",
      "view-source:",
    ];
    if (forbiddenProtocols.includes(u.protocol)) {
      return true;
    }
    forbiddenHostnames = [
      "chrome.google.com",
      "developer.chrome.com",
      "chromewebstore.google.com",
    ];
    if (forbiddenHostnames.includes(u.hostname)) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel
    .open({
      tabId: tab.id,
    })
    .catch((error) => console.error(error));
});

chrome.runtime.onInstalled.addListener((details) => {
  console.log(
    "Extension updated to version:",
    chrome.runtime.getManifest().version
  );
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url) return;
    const url = tab.url;

    // On évite les chrome:// etc

    if (isBlockedUrl(url)) {
      console.error(
        chrome.i18n.getMessage("error_extension_usage_title"),
        chrome.i18n.getMessage("error_extension_usage_message")
      );
      return;
    }
  });
  //   }

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
    if (isBlockedUrl(tab.url)) {
      // Désactiver le side panel pour cet onglet
      chrome.sidePanel.setOptions({ tabId, enabled: false });
    } else {
      // Réactiver sur les autres sites
      chrome.sidePanel.setOptions({ tabId, enabled: true });
    }
  }
});
