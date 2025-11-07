import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/components/ScriptConfig/ScriptConfig.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--5832313c.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
import { Badge, DataList } from "/vendor/.vite-deps-@radix-ui_themes.js__v--5832313c.js";
export const ScriptConfig = ({ rule }) => /* @__PURE__ */ jsxDEV(DataList.Root, { trim: "end", size: "1", m: "1", children: [
  /* @__PURE__ */ jsxDEV(DataList.Item, { children: [
    /* @__PURE__ */ jsxDEV(DataList.Label, { children: "Type:" }, void 0, false, {
      fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx",
      lineNumber: 36,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(DataList.Value, { children: /* @__PURE__ */ jsxDEV(Badge, { color: "green", variant: "outline", children: "Script" }, void 0, false, {
      fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx",
      lineNumber: 38,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx",
      lineNumber: 37,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx",
    lineNumber: 35,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ jsxDEV(DataList.Item, { children: [
    /* @__PURE__ */ jsxDEV(DataList.Label, { children: "Name:" }, void 0, false, {
      fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx",
      lineNumber: 44,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(DataList.Value, { children: rule?.meta?.name }, void 0, false, {
      fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx",
      lineNumber: 45,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx",
    lineNumber: 43,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ jsxDEV(DataList.Item, { children: /* @__PURE__ */ jsxDEV(DataList.Label, { children: "Script:" }, void 0, false, {
    fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx",
    lineNumber: 48,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx",
    lineNumber: 47,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ jsxDEV(DataList.Item, { children: [
    /* @__PURE__ */ jsxDEV(DataList.Label, { children: "When:" }, void 0, false, {
      fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx",
      lineNumber: 52,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(DataList.Value, { children: /* @__PURE__ */ jsxDEV("strong", { children: "document idle" }, void 0, false, {
      fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx",
      lineNumber: 54,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx",
      lineNumber: 53,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx",
    lineNumber: 51,
    columnNumber: 5
  }, this)
] }, void 0, true, {
  fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx",
  lineNumber: 34,
  columnNumber: 1
}, this);
_c = ScriptConfig;
var _c;
$RefreshReg$(_c, "ScriptConfig");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/Users/tommygrzesiakowski/Developer/modrequest/src/components/ScriptConfig/ScriptConfig.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
