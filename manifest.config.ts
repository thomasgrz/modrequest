import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  // icons: {
  //   48: "public/logo.png",
  // },
  action: {
    // default_icon: {
    //   48: "public/logo.png",
    // },
    default_popup: "src/popup/index.html",
    default_title: "click to open sidepanel",
  },
  devtools_page: "src/sidepanel/index.html",
  permissions: [
    "contentSettings",
    "sidePanel",
    "offscreen",
    "declarativeNetRequest",
    "nativeMessaging",
    "storage",
    "contextMenus", // add an item to the menu displayed on right click
    "webRequest", // intercept request as it goes out (rather than subsequent requests after page load)
    "webNavigation",
  ],
  // content_scripts: [
  //   {
  //     js: ["src/content/main.tsx"],
  //     matches: ["https://*/*"],
  //   },
  // ],
  options_page: "src/options/index.html",
  host_permissions: ["<all_urls>"],
  side_panel: {
    default_path: "src/sidepanel/index.html",
  },
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
});
