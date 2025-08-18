import { getRulesFromStorage } from "./utils/getRulesFromStorage/getRulesFromStorage";
import { logger } from "./utils/logger";
import { subscribeToRuleChanges } from "./utils/subscribeToRuleChanges/subscribeToRuleChanges";
import { syncDynamicRulesInStorage } from "./utils/syncDynamicRulesInStorage/syncDynamicRulesInStorage";

logger("service worker installed", {});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openSidePanel",
    title: "Open ModRequest",
    contexts: ["all"],
  });

  logger("installed", null);
  subscribeToRuleChanges(() => {
    logger("updated from background.ts", {});
    syncDynamicRulesInStorage();
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openSidePanel" && tab?.windowId) {
    // This will open the panel in all the pages on the current window.
    chrome.sidePanel.open({ windowId: tab?.windowId });
  }
});

chrome.webRequest.onBeforeRedirect.addListener(
  async (details) => {
    const redirectUriIfExists = details?.redirectUrl;
    const rulesFromStorage = await getRulesFromStorage();
    const redirectUrls = rulesFromStorage.map((rule) => ({
      id: rule?.details?.id,
      redirectUrl: rule?.details?.action?.redirect?.url,
    }));

    const invokedRule = redirectUrls.find((redirect) => {
      return (
        redirect.redirectUrl &&
        redirectUriIfExists.startsWith(redirect.redirectUrl)
      );
    });

    if (invokedRule) {
      chrome.runtime.sendMessage(`redirect-${invokedRule.id}-hit`);
    }
  },
  { urls: ["<all_urls>"] },
);
