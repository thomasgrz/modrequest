import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/components/RedirectRulePreview/RedirectRulePreview.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--5832313c.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import * as RefreshRuntime from "/vendor/react-refresh.js";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/Users/tommygrzesiakowski/Developer/modrequest/src/components/RedirectRulePreview/RedirectRulePreview.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
import { Badge, DataList } from "/vendor/.vite-deps-@radix-ui_themes.js__v--5832313c.js";
export const RedirectRulePreview = (props) => {
  const { rule } = props;
  return /* @__PURE__ */ jsxDEV(DataList.Root, { trim: "end", size: "1", m: "1", children: [
    /* @__PURE__ */ jsxDEV(DataList.Item, { align: "center", children: [
      /* @__PURE__ */ jsxDEV(DataList.Label, { children: "Type:" }, void 0, false, {
        fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RedirectRulePreview/RedirectRulePreview.tsx",
        lineNumber: 29,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(DataList.Value, { children: /* @__PURE__ */ jsxDEV(Badge, { color: "cyan", variant: "outline", children: "Redirect" }, void 0, false, {
        fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RedirectRulePreview/RedirectRulePreview.tsx",
        lineNumber: 31,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RedirectRulePreview/RedirectRulePreview.tsx",
        lineNumber: 30,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RedirectRulePreview/RedirectRulePreview.tsx",
      lineNumber: 28,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(DataList.Item, { children: [
      /* @__PURE__ */ jsxDEV(DataList.Label, { children: "Redirect:" }, void 0, false, {
        fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RedirectRulePreview/RedirectRulePreview.tsx",
        lineNumber: 37,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(DataList.Value, { children: rule?.details?.action?.redirect?.url }, void 0, false, {
        fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RedirectRulePreview/RedirectRulePreview.tsx",
        lineNumber: 38,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RedirectRulePreview/RedirectRulePreview.tsx",
      lineNumber: 36,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(DataList.Item, { children: [
      /* @__PURE__ */ jsxDEV(DataList.Label, { children: "RegEx:" }, void 0, false, {
        fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RedirectRulePreview/RedirectRulePreview.tsx",
        lineNumber: 41,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(DataList.Value, { children: /* @__PURE__ */ jsxDEV("strong", { children: rule?.details?.condition?.regexFilter }, void 0, false, {
        fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RedirectRulePreview/RedirectRulePreview.tsx",
        lineNumber: 43,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RedirectRulePreview/RedirectRulePreview.tsx",
        lineNumber: 42,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RedirectRulePreview/RedirectRulePreview.tsx",
      lineNumber: 40,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RedirectRulePreview/RedirectRulePreview.tsx",
    lineNumber: 27,
    columnNumber: 5
  }, this);
};
_c = RedirectRulePreview;
var _c;
$RefreshReg$(_c, "RedirectRulePreview");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/Users/tommygrzesiakowski/Developer/modrequest/src/components/RedirectRulePreview/RedirectRulePreview.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/Users/tommygrzesiakowski/Developer/modrequest/src/components/RedirectRulePreview/RedirectRulePreview.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
