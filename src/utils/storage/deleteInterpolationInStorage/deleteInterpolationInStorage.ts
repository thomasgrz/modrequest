import { getInterpolationsFromStorage } from "../getInterpolationsFromStorage/getInterpolationsFromStorage";

export const deleteInterpolationInStorage = async (id: number | string) => {
  const currentInterpolations = await getInterpolationsFromStorage();
  const filteredInterpolations = currentInterpolations.filter(
    (interpolation) => interpolation.details.id !== id,
  );
  await chrome.storage.sync.set({ rules: filteredInterpolations });
};
