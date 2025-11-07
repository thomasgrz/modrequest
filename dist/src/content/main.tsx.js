import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--5832313c.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/vendor/.vite-deps-react.js__v--5832313c.js"; const StrictMode = __vite__cjsImport1_react["StrictMode"];
import __vite__cjsImport2_reactDom_client from "/vendor/.vite-deps-react-dom_client.js__v--5832313c.js"; const createRoot = __vite__cjsImport2_reactDom_client["createRoot"];
import { ContentView } from "/src/content/ContentView.tsx.js";
console.log("[CRXJS] Hello world from content script!");
const container = document.createElement("div");
container.id = "crxjs-app";
document.body.appendChild(container);
chrome.storage.onChanged.addListener((changes) => {
});
createRoot(container).render(/* @__PURE__ */ jsxDEV(StrictMode, { children: /* @__PURE__ */ jsxDEV(ContentView, {}, void 0, false, {
  fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/content/main.tsx",
  lineNumber: 49,
  columnNumber: 5
}, this) }, void 0, false, {
  fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/content/main.tsx",
  lineNumber: 48,
  columnNumber: 30
}, this));
