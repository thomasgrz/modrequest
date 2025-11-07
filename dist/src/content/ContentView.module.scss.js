import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/ContentView.module.scss.js");import { updateStyle as __vite__updateStyle, removeStyle as __vite__removeStyle } from "/vendor/vite-client.js"
const __vite__id = "/Users/tommygrzesiakowski/Developer/modrequest/src/content/ContentView.module.scss"
const __vite__css = "._ContentView_19kxv_1 {\n  position: fixed;\n  right: 0;\n  bottom: 0;\n  margin: 1.25rem;\n  z-index: 1000;\n  display: flex;\n  align-items: flex-end;\n  font-family: ui-sans-serif, system-ui, sans-serif;\n  user-select: none;\n  line-height: 1em;\n}\n\n._DisplayRules_19kxv_14 {\n  display: block;\n  border: 2px solid blue;\n}\n\n._HiddenRules_19kxv_19 {\n  display: none;\n}"
__vite__updateStyle(__vite__id, __vite__css)
export const ContentView = "_ContentView_19kxv_1";
export const DisplayRules = "_DisplayRules_19kxv_14";
export const HiddenRules = "_HiddenRules_19kxv_19";
export default {
	ContentView: ContentView,
	DisplayRules: DisplayRules,
	HiddenRules: HiddenRules
};

import.meta.hot.prune(() => __vite__removeStyle(__vite__id))