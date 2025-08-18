import { RedirectRule } from "@/components/RuleCard/RuleCard";

export const getRulesFromStorage = async () => {
  const localExtensionStorage = await chrome.storage.local.get("rules");
  return (localExtensionStorage.rules ?? []) as RedirectRule[];
};
