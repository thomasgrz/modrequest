// const GOOGLE_ORIGIN = 'https://www.google.com';

// chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
//   console.log({tabId, info, tab})
//   if (!tab.url) return;
//   const url = new URL(tab.url);
//   console.log("ELIGIBLE")
//   // Enables the side panel on google.com
//   if (url.origin === GOOGLE_ORIGIN) {
//     chrome.storage.local.set({tabId})
//     console.log("ATTEMPTING")
//     // chrome.sidePanel.open({
//     //   tabId
//     // })
//     await chrome.sidePanel.setOptions({
//       tabId,
//       path: 'src/sidepanel/index.html',
//       enabled: true
//     });
//     console.log("SUCCESS")
//   } else {
//     // Disables the side panel on all other sites
//     await chrome.sidePanel.setOptions({
//       tabId,
//       enabled: false
//     });
//   }
// });

// chrome.sidePanel
//   .setPanelBehavior({ openPanelOnActionClick: true })
//   .catch((error) => console.error(error));
  
//   const rules = chrome.declarativeNetRequest.getDynamicRules();
//         console.log({rules})