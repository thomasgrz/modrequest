import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    48: "public/logo.png",
  },
  action: {
    default_icon: {
      48: "public/logo.png",
    },
    default_popup: "src/popup/index.html",
  },
  permissions: [
    'contentSettings',
    'sidePanel',
    'storage',
    'offscreen',
    'declarativeNetRequest',
  ],
  content_scripts: [
    {
      js: ["src/content/main.tsx"],
      matches: ["https://*/*"],
    },
  ],
  host_permissions: ["https://www.google.com/*"],
  side_panel: {
    default_path: "src/sidepanel/index.html"
  },
  background: {
    "service_worker": "src/background.ts",
    "type": "module"
  }
});
