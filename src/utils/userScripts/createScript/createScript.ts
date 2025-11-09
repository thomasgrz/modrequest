export type UserScript = {
  type: "userScript";
  meta: {
    createdAt: number;
    enabledByUser: boolean;
  };
  details: chrome.userScripts.RegisteredUserScript;
};

export const createScript = (scriptForm: {
  allFrames?: boolean;
  body: string;
  exclude?: boolean;
  id: string;
  runAt?: string;
  include?: string;
}): UserScript => {
  return {
    type: "userScript",
    meta: {
      createdAt: Date.now(),
      enabledByUser: true,
    },
    details: {
      js: [{ code: scriptForm.body }],
      id: scriptForm.id,
      runAt: scriptForm.runAt as chrome.extensionTypes.RunAt,
      allFrames: scriptForm.allFrames,
      includeGlobs: ["*://*/*"],
    },
  };
};
