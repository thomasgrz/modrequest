import {
  AnyInterpolation,
  InterpolationType,
} from "@/utils/factories/Interpolation";
import { logger } from "@/utils/logger";
import { INTERPOLATION_STORAGE_KEY } from "../storage.constants";

export const InterpolateStorage = {
  name: "InterpolateStorage",
  logInvocation(caller: string) {
    logger(`${this.name} (invocation): ${caller}`);
  },
  logError(caller: string, error: string) {
    logger(`${this.name}: ${caller} threw (error): ${error}`);
  },
  async set(interpolations?: AnyInterpolation[]) {
    if (!interpolations) return;
    chrome.storage.sync.set({
      [INTERPOLATION_STORAGE_KEY]: interpolations,
    });
  },
  async create(interpolationsToCreate: AnyInterpolation[]) {
    const caller = "create";
    this.logInvocation(caller);
    let result;
    try {
      const allCurrent = await this.getAll();
      await this.createRollbackRecord(allCurrent);
      const currentWithNewlyCreated =
        allCurrent?.concat(interpolationsToCreate) ?? [];
      result = this.set(currentWithNewlyCreated);
    } catch (e) {
      this.logError(caller, e as string);
    }
  },
  async disableAll() {
    const caller = "disableAll";
    this.logInvocation(caller);
    try {
      const allCurrent = await this.getAll();
      await this.createRollbackRecord(allCurrent);
      const updatedInterpolations = allCurrent?.map((interpolation) => {
        return {
          ...interpolation,
          enabledByUser: false,
        };
      });
      await this.set(updatedInterpolations);
    } catch (e) {
      this.logError(caller, e as string);
    }
  },
  async enableAll() {
    const caller = "enableAll";
    this.logInvocation(caller);
    try {
      const allCurrent = await this.getAll();
      await this.createRollbackRecord(allCurrent);
      const updatedInterpolations = allCurrent?.map((interpolation) => {
        return {
          ...interpolation,
          enabledByUser: true,
        };
      });
      await this.set(updatedInterpolations);
    } catch (e) {
      this.logError(caller, e as string);
    }
  },
  async setIsEnabled(
    interpolationToUpdate: AnyInterpolation,
    enabledByUser: boolean,
  ) {
    const caller = "update";
    this.logInvocation(caller);
    let result;
    try {
      const allCurrent = await this.getAll();
      await this.createRollbackRecord(allCurrent);
      const updatedInterpolations = allCurrent?.map((interpolation) => {
        if (interpolation.details.id === interpolationToUpdate.details.id) {
          return {
            ...interpolationToUpdate,
            enabledByUser,
          };
        }

        return interpolation;
      });
      result = await this.set(updatedInterpolations);
    } catch (e) {
      this.logError(caller, e as string);
    }
  },
  async createRollbackRecord(before?: AnyInterpolation[]) {
    const caller = "createRollbackRecord";
    this.logInvocation(caller);
    let result;
    try {
      result = chrome.storage.sync.set({
        [INTERPOLATION_STORAGE_KEY + "-rollback-record"]: before,
      });
    } catch (e) {
      this.logError(caller, e as string);
    }
    return result;
  },
  async getAllByTypes(types: InterpolationType[]) {
    const caller = "getAllByTypes";
    this.logInvocation(caller);
    let result;
    try {
      result = await this.getAll();
      return result?.filter((interpolation) => {
        return types.includes(interpolation?.type);
      });
    } catch (e) {
      this.logError(caller, e as string);
    }
  },
  async getAll() {
    const caller = "getAll";
    this.logInvocation(caller);
    let result: {
      [INTERPOLATION_STORAGE_KEY]: AnyInterpolation[] | undefined;
    };
    try {
      result = await chrome.storage.sync.get(INTERPOLATION_STORAGE_KEY);
      return result?.[INTERPOLATION_STORAGE_KEY] ?? [];
    } catch (e) {
      this.logError(caller, e as string);
    }
  },
  async deleteAll() {
    const caller = "deleteAll";
    this.logInvocation(caller);
    let result;
    try {
      const allCurrent = await this.getAll();
      await this.createRollbackRecord(allCurrent);
      result = await chrome.storage.sync.set({
        [INTERPOLATION_STORAGE_KEY]: [],
      });
    } catch (e) {
      this.logError(caller, e as string);
    }
  },
  async delete(interpolationToDelete: AnyInterpolation) {
    const caller = "delete";
    this.logInvocation(caller);
    let result;
    try {
      const allCurrent = await this.getAll();
      await this.createRollbackRecord(allCurrent);
      const interpolationsWithoutDeleted = allCurrent?.filter?.(
        (current) => current?.details?.id !== interpolationToDelete.details.id,
      );
      result = chrome.storage.sync.set({
        [INTERPOLATION_STORAGE_KEY]: interpolationsWithoutDeleted,
      });
    } catch (e) {
      this.logError(caller, e as string);
    }
  },
  async subscribeToChanges(
    cb: (
      newValue: AnyInterpolation[],
    ) => Promise<void> | ((newValue: AnyInterpolation[]) => void),
  ) {
    const caller = "subscribeToChanges";
    this.logInvocation(caller);
    try {
      chrome.storage.sync.onChanged.addListener((...args) => {
        this.logInvocation("chrome.storage.sync.onChanged");
        const changes = args[0] as {
          [INTERPOLATION_STORAGE_KEY]: {
            newValue: AnyInterpolation[];
          };
        };
        const updatedValues = changes?.[INTERPOLATION_STORAGE_KEY]?.newValue;
        logger("onChanged: updatedValues: ");
        cb(updatedValues);
      });
    } catch (e) {
      this.logError(caller, e as string);
    }
  },
};
