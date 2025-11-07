import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/components/RuleCard/RuleCard.tsx.js");import __vite__cjsImport0_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--5832313c.js"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_react from "/vendor/.vite-deps-react.js__v--5832313c.js"; const useEffect = __vite__cjsImport3_react["useEffect"]; const useState = __vite__cjsImport3_react["useState"];
import { deleteRuleById } from "/src/utils/deleteRuleById/deleteRuleById.ts.js";
import { subscribeToRuleChanges } from "/src/utils/subscribeToRuleChanges/subscribeToRuleChanges.ts.js";
import { subscribeToUserScriptChanges } from "/src/utils/subscribeToUserScriptChanges/subscribeToUserScriptChanges.ts.js";
import { toggleEnabledRules } from "/src/utils/toggleEnabledRules/toggleEnabledRules.ts.js";
import {
  DoubleArrowDownIcon,
  DoubleArrowUpIcon,
  QuestionMarkCircledIcon
} from "/vendor/.vite-deps-@radix-ui_react-icons.js__v--5832313c.js";
import {
  Badge,
  Box,
  Button,
  Card,
  Code,
  DataList,
  Flex,
  Tooltip
} from "/vendor/.vite-deps-@radix-ui_themes.js__v--5832313c.js";
import { Collapsible } from "/vendor/.vite-deps-radix-ui.js__v--5832313c.js";
import { HeaderRulePreview } from "/src/components/HeaderRulePreview/HeaderRulePreview.tsx.js";
import { RedirectRulePreview } from "/src/components/RedirectRulePreview/RedirectRulePreview.tsx.js";
import { RuleDeleteAction } from "/src/components/RuleDeleteAction/RuleDeleteAction.tsx.js";
import { RuleToggle } from "/src/components/RuleToggle/RuleToggle.tsx.js";
import {
  ScriptConfig
} from "/src/components/ScriptConfig/ScriptConfig.tsx.js";
import styles from "/src/components/RuleCard/RuleCard.module.scss.js";
export const RuleCard = ({
  rule
}) => {
  _s();
  const [isPaused, setIsPaused] = useState(!rule?.meta?.enabledByUser);
  const [isOpen, setIsOpen] = useState(false);
  const [hit, setHit] = useState(false);
  const [recentlyHitColor, setRecentlyHitColor] = useState(
    "green"
  );
  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg === `${rule.type}-${rule.details.id}-hit`) {
        setRecentlyHitColor("green");
        setHit(true);
        setTimeout(() => {
          setRecentlyHitColor("gray");
        }, 5e3);
        setTimeout(() => {
          setHit(false);
        }, 3e4);
      }
    });
  }, [isPaused]);
  useEffect(() => {
    switch (rule.type) {
      case "header":
      case "redirect":
        subscribeToRuleChanges(
          ({
            newValue
          }) => {
            const parentConfig = newValue.find(
              (value) => value.details?.id === rule.details?.id
            );
            const isParentConfigPaused = parentConfig?.meta?.enabledByUser === false;
            setIsPaused(isParentConfigPaused);
          }
        );
        break;
      case "script":
        subscribeToUserScriptChanges(({ newValue }) => {
          const parentConfig = newValue.find(
            (value) => value?.details?.id === rule?.details?.id
          );
          const isParentConfigPaused = parentConfig?.meta?.enabledByUser === false;
          setIsPaused(isParentConfigPaused);
        });
        break;
      default:
        return;
    }
  }, []);
  const onDelete = async () => {
    const type = rule.type;
    if (type === "redirect" || type === "header") {
      deleteRuleById(rule.details?.id);
    }
    if (type === "script") {
    }
  };
  const handleResumeClick = () => {
    toggleEnabledRules([rule], "resume");
  };
  const handlePauseClick = () => {
    toggleEnabledRules([rule], "pause");
  };
  const collapseTriggerContent = isOpen ? "collapse" : "expand";
  return /* @__PURE__ */ jsxDEV(
    Card,
    {
      "data-ui-active": hit,
      "data-ui-error": !!rule.meta?.error,
      className: styles.RuleCard,
      children: /* @__PURE__ */ jsxDEV(Collapsible.Root, { onOpenChange: setIsOpen, open: isOpen, children: [
        /* @__PURE__ */ jsxDEV(Flex, { justify: "between", flexGrow: "2", children: [
          /* @__PURE__ */ jsxDEV(Box, { children: [
            /* @__PURE__ */ jsxDEV(Flex, { children: [
              rule.type === "redirect" && /* @__PURE__ */ jsxDEV(RedirectRulePreview, { rule }, void 0, false, {
                fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
                lineNumber: 167,
                columnNumber: 44
              }, this),
              rule.type === "header" && /* @__PURE__ */ jsxDEV(HeaderRulePreview, { rule }, void 0, false, {
                fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
                lineNumber: 168,
                columnNumber: 42
              }, this),
              rule.type === "script" && /* @__PURE__ */ jsxDEV(ScriptConfig, { rule }, void 0, false, {
                fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
                lineNumber: 169,
                columnNumber: 42
              }, this)
            ] }, void 0, true, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 166,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(Flex, { py: "1", children: [
              hit && !rule.meta?.error && /* @__PURE__ */ jsxDEV(Badge, { color: recentlyHitColor, children: "Recently hit" }, void 0, false, {
                fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
                lineNumber: 173,
                columnNumber: 15
              }, this),
              rule.meta?.error && /* @__PURE__ */ jsxDEV(Fragment, { children: /* @__PURE__ */ jsxDEV(Tooltip, { content: rule.meta?.error, children: /* @__PURE__ */ jsxDEV(Badge, { color: "ruby", children: [
                "Error",
                /* @__PURE__ */ jsxDEV(QuestionMarkCircledIcon, {}, void 0, false, {
                  fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
                  lineNumber: 180,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
                lineNumber: 178,
                columnNumber: 21
              }, this) }, void 0, false, {
                fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
                lineNumber: 177,
                columnNumber: 19
              }, this) }, void 0, false, {
                fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
                lineNumber: 176,
                columnNumber: 15
              }, this)
            ] }, void 0, true, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 171,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
            lineNumber: 165,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(Flex, { direction: "column", gap: "3", className: styles.DeleteAction, children: [
            /* @__PURE__ */ jsxDEV(RuleDeleteAction, { onDelete }, void 0, false, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 188,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV(
              RuleToggle,
              {
                disabled: !!rule.meta?.error,
                onResumeClick: handleResumeClick,
                onPauseClick: handlePauseClick,
                isPaused: isPaused || !!rule.meta?.error
              },
              void 0,
              false,
              {
                fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
                lineNumber: 189,
                columnNumber: 13
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(Tooltip, { content: collapseTriggerContent, children: /* @__PURE__ */ jsxDEV(Collapsible.Trigger, { asChild: true, children: /* @__PURE__ */ jsxDEV(Button, { color: "jade", size: "1", radius: "full", children: isOpen ? /* @__PURE__ */ jsxDEV(DoubleArrowUpIcon, {}, void 0, false, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 198,
              columnNumber: 29
            }, this) : /* @__PURE__ */ jsxDEV(DoubleArrowDownIcon, {}, void 0, false, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 198,
              columnNumber: 53
            }, this) }, void 0, false, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 197,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 196,
              columnNumber: 15
            }, this) }, void 0, false, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 195,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
            lineNumber: 187,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
          lineNumber: 164,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV(Collapsible.Content, { asChild: true, children: /* @__PURE__ */ jsxDEV(DataList.Root, { trim: "end", size: "1", m: "1", children: [
          /* @__PURE__ */ jsxDEV(DataList.Item, { align: "end", children: [
            /* @__PURE__ */ jsxDEV(DataList.Label, { color: "jade", children: "Id:" }, void 0, false, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 207,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DataList.Value, { children: rule.details?.id }, void 0, false, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 208,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
            lineNumber: 206,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(DataList.Item, { children: [
            /* @__PURE__ */ jsxDEV(DataList.Label, { children: "Type:" }, void 0, false, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 211,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DataList.Value, { children: rule?.type }, void 0, false, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 212,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
            lineNumber: 210,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(DataList.Item, { children: [
            /* @__PURE__ */ jsxDEV(DataList.Label, { children: "Enabled:" }, void 0, false, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 215,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DataList.Value, { children: rule?.meta?.enabledByUser?.toString() }, void 0, false, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 216,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
            lineNumber: 214,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(DataList.Item, { children: [
            /* @__PURE__ */ jsxDEV(DataList.Label, { children: "Config:" }, void 0, false, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 221,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DataList.Value, { children: /* @__PURE__ */ jsxDEV(Code, { children: JSON.stringify(rule) }, void 0, false, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 223,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
              lineNumber: 222,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
            lineNumber: 220,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
          lineNumber: 205,
          columnNumber: 11
        }, this) }, void 0, false, {
          fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
          lineNumber: 204,
          columnNumber: 9
        }, this)
      ] }, void 0, true, {
        fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
        lineNumber: 163,
        columnNumber: 7
      }, this)
    },
    void 0,
    false,
    {
      fileName: "/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx",
      lineNumber: 158,
      columnNumber: 5
    },
    this
  );
};
_s(RuleCard, "zZ4gLLS6IsveE+QlYY7gKfIai3A=");
_c = RuleCard;
var _c;
$RefreshReg$(_c, "RuleCard");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/Users/tommygrzesiakowski/Developer/modrequest/src/components/RuleCard/RuleCard.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
