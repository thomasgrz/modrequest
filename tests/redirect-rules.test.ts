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

test("should selectively apply redirect rule if enabled", async ({ page }) => {
  await createRedirectRule({
    page,
    source: ".*something.*",
    destination: "https://example.com/test",
  });

  await createRedirectRule({
    page,
    source: ".*google.*",
    destination: "https://example.com/test2",
  });

  // Pause the extension
  await page.locator("data-testid=pause-rule-toggle").nth(0).click();

  await page.goto("https://something.com");
  await expect(page).toHaveURL("https://example.com/test");
  await page.goto("https://google.com");
  await expect(page).toHaveURL(/https:\/\/www.google.com/);
});

test("should disable all rules when global pause is activated", async ({
  page,
}) => {
  await createRedirectRule({
    page,
    source: ".*something.*",
    destination: "https://example.com/test",
  });

  await createRedirectRule({
    page,
    source: ".*google.*",
    destination: "https://example.com/test2",
  });

  // Activate global pause
  await page.getByRole("button", { name: /Pause/ }).click();
  await page.goto("https://something.com");
  await expect(page).toHaveURL("https://something.com/");

  await page.goto("https://www.google.com");
  await expect(page).toHaveURL("https://www.google.com/");
});

test("should re-enable rules when global pause is deactivated", async ({
  page,
}) => {
  await createRedirectRule({
    page,
    source: ".*something.*",
    destination: "https://example.com/test",
  });

  await createRedirectRule({
    page,
    source: ".*google.*",
    destination: "https://example.com/test2",
  });

  // Activate global pause
  await page.getByRole("button", { name: /Pause/ }).click();
  // Deactivate global pause
  await page.getByRole("button", { name: /Resume/ }).click();

  await page.goto("https://something.com");
  await expect(page).toHaveURL("https://example.com/test");

  await page.goto("https://www.google.com");
  await expect(page).toHaveURL("https://example.com/test2");
});
