// Only added for complying with the manifest v3 requirements
// This file is not used in the extension but is required for the manifest v3
chrome.runtime.onInstalled.addListener(() => {
  console.log("Color Perception Simulator installed.");
});
