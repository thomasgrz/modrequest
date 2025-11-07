import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/ContentView.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--5832313c.js"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/Users/tommygrzesiakowski/Developer/modrequest/src/content/ContentView.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import { RuleCard } from "/src/components/RuleCard/RuleCard.tsx.js";
import { subscribeToRuleChanges } from "/src/utils/subscribeToRuleChanges/subscribeToRuleChanges.ts.js";
import { Box, Button, Flex, IconButton, Theme } from "/vendor/.vite-deps-@radix-ui_themes.js__v--5832313c.js";
import { Separator } from "/vendor/.vite-deps-radix-ui.js__v--5832313c.js";
import __vite__cjsImport7_react from "/vendor/.vite-deps-react.js__v--5832313c.js"; const useEffect = __vite__cjsImport7_react["useEffect"]; const useState = __vite__cjsImport7_react["useState"];
import Hide from "/src/assets/hide.svg__import.js";
import Show from "/src/assets/show.svg__import.js";
import styles from "/src/content/ContentView.module.scss.js";
export const ContentView = () => {
  _s();
  const [show, setShow] = useState(true);
  const [displayedRules, setDisplayedRules] = useState([]);
  const fetchRules = async () => {
    const _rules = await chrome.storage.local.get("rules");
    setDisplayedRules(_rules.rules);
  };
  const toggle = () => {
    setShow(!show);
    fetchRules();
  };
  useEffect(() => {
    fetchRules();
  }, []);
  useEffect(() => {
    subscribeToRuleChanges((changes) => setDisplayedRules(changes.newValue));
  }, []);
  return /* @__PURE__ */ jsxDEV(Theme, { children: /* @__PURE__ */ jsxDEV(Box, { className: styles.ContentView, children: /* @__PURE__ */ jsxDEV(Flex, { align: "end", direction: "row", children: [
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        "data-ui-shown": show,
        className: show ? styles.DisplayedRules : styles.HiddenRules,
        children: displayedRules?.map?.(
          (rule) => /* @__PURE__ */ jsxDEV(RuleCard, { rule }, rule.details.id, false, {
            fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/content/ContentView.tsx",
            lineNumber: 60,
            columnNumber: 13
          }, this)
        )
      },
      void 0,
      false,
      {
        fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/content/ContentView.tsx",
        lineNumber: 55,
        columnNumber: 11
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(Separator.Root, {}, void 0, false, {
      fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/content/ContentView.tsx",
      lineNumber: 63,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ jsxDEV(Flex, { gap: "1", children: [
      /* @__PURE__ */ jsxDEV(Button, { onClick: () => fetchRules(), children: " Refresh" }, void 0, false, {
        fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/content/ContentView.tsx",
        lineNumber: 65,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV(IconButton, { color: "green", onClick: toggle, children: show ? /* @__PURE__ */ jsxDEV(Hide, {}, void 0, false, {
        fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/content/ContentView.tsx",
        lineNumber: 67,
        columnNumber: 23
      }, this) : /* @__PURE__ */ jsxDEV(Show, {}, void 0, false, {
        fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/content/ContentView.tsx",
        lineNumber: 67,
        columnNumber: 34
      }, this) }, void 0, false, {
        fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/content/ContentView.tsx",
        lineNumber: 66,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/content/ContentView.tsx",
      lineNumber: 64,
      columnNumber: 11
    }, this)
  ] }, void 0, true, {
    fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/content/ContentView.tsx",
    lineNumber: 54,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/content/ContentView.tsx",
    lineNumber: 53,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/content/ContentView.tsx",
    lineNumber: 52,
    columnNumber: 5
  }, this);
};
_s(ContentView, "wjMh0G8FLq3aKhmNH6IdL1a8fGg=");
_c = ContentView;
var _c;
$RefreshReg$(_c, "ContentView");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/Users/tommygrzesiakowski/Developer/modrequest/src/content/ContentView.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/Users/tommygrzesiakowski/Developer/modrequest/src/content/ContentView.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
