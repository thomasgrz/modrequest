import { Page } from "@playwright/test";
import { expect, test } from "../fixtures/expect.js";

const createRedirectRule = async (arg: {
  page: Page;
  source: string;
  destination: string;
}) => {
  const { source, destination, page } = arg;
  await page.goto(
    `chrome-extension://ejgfblbiaaajjignebpjnjegobenjmno/src/options/index.html`,
  );

  await page.getByPlaceholder(/example/).fill(source);
  await page.getByPlaceholder(/google/).fill(destination);
  await page.getByText("Add config").click();
};

test("should apply redirect rule", async ({ page, extensionId }) => {
  await createRedirectRule({
    page,
    source: ".*something.*",
    destination: "https://example.com/*",
  });

  await page.goto("https://something.com");
  await expect(page.getByText(/Example Domain/)).toBeVisible();
});

test("should not apply paused redirect rule", async ({ page, extensionId }) => {
  console.log("Extension ID:", extensionId);
  await createRedirectRule({
    page,
    source: ".*something.*",
    destination: "https://example.com/*",
  });

  // Pause the extension
  await page.locator("data-testid=pause-rule-toggle").click();

  await page.goto("https://something.com");
  await expect(page).toHaveURL("https://something.com/");
});
