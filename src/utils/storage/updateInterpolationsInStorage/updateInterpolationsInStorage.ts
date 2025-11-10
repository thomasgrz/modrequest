import Interpolation from "@/utils/factories/Interpolation";
import { getInterpolationsFromStorage } from "../getInterpolationsFromStorage/getInterpolationsFromStorage";
import { INTERPOLATION_STORAGE_KEY } from "../storage.constants";

export const updateInterpolationsInStorage = async (
  newValues: Interpolation[],
) => {
  const storageValue = await getInterpolationsFromStorage();
  const interpolationsInStorage = storageValue.length ? storageValue : [];
  const currentValuesWithoutNewValueIds = interpolationsInStorage.filter(
    (currentValue) => {
      return (
        newValues.some(
          (value) => value.details.id === currentValue.details.id,
        ) === false
      );
    },
  );
  const updatedInterpolations = [
    ...currentValuesWithoutNewValueIds,
    ...newValues,
  ];
  return chrome.storage.sync.set({
    [INTERPOLATION_STORAGE_KEY]: updatedInterpolations,
  });
};
