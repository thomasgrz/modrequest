import { getInterpolationsFromStorage } from "../../storage/getInterpolationsFromStorage/getInterpolationsFromStorage";

export const resumeInterpolations = async (ids: (number | string)[]) => {
  const interpolationsInStorage = await getInterpolationsFromStorage();
  const interpolationsAfterResuming = interpolationsInStorage.map(
    (fromStorage) => {
      const shouldRuleBeEnabled = ids.includes(fromStorage.details.id);
      if (!shouldRuleBeEnabled) return fromStorage;

      return {
        ...fromStorage,
        enabledByUser: true,
      };
    },
  );

  await chrome.storage.sync.set({
    interpolations: interpolationsAfterResuming,
  });
};
