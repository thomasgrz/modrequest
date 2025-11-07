import { expect, test } from "../fixtures/expect";

const createHeaderRule = async (arg: {
  page: any;
  headerName: string;
  headerValue: string;
}) => {
  const { headerName, headerValue, page } = arg;
  await page.goto(
    `chrome-extension://ejgfblbiaaajjignebpjnjegobenjmno/src/options/index.html`,
  );

  await page.getByRole("radio", { name: "Headers" }).click();
  await page.getByPlaceholder(/Forwarded/).fill(headerName);
  await page.getByPlaceholder(/http/).fill(headerValue);
  await page.getByText("Add config").click();
};

test("should apply header rule", async ({ page, extensionId }) => {
  // Create a header modification rule
  await createHeaderRule({
    page,
    headerName: "X-Test-Header",
    headerValue: "ModRequest",
  });

  // Navigate to a test page
  await page.goto("https://httpbin.org/headers");

  // Verify that the header has been added
  const headerContent = await page.locator("pre").innerText();
  expect(headerContent).toContain('"X-Test-Header": "ModRequest"');
});

test("should not apply header rule when paused", async ({ page }) => {
  // Create a header modification rule
  await createHeaderRule({
    page,
    headerName: "X-Test-Header",
    headerValue: "ModRequest",
  });

  // Pause the header rule
  await page.locator("data-testid=pause-rule-toggle").click();

  // Navigate to a test page
  await page.goto("https://httpbin.org/headers");

  // Verify that the header has NOT been added
  const headerContent = await page.locator("pre").innerText();
  expect(headerContent).not.toContain('"X-Test-Header": "ModRequest"');
});

test("should selectively apply header rule if enabled", async ({ page }) => {
  // Create a header modification rule
  await createHeaderRule({
    page,
    headerName: "X-Test-Header",
    headerValue: "ModRequest",
  });

  await createHeaderRule({
    page,
    headerName: "X-Another-Header",
    headerValue: "ShouldNotApply",
  });

  // Pause the second header rule
  const secondRuleToggle = page.locator("data-testid=pause-rule-toggle").nth(0); // 0th index is most recently added rule
  await secondRuleToggle.click();

  // Navigate to a test page
  await page.goto("https://httpbin.org/headers");

  // Verify that the first header has been added
  const headerContent = await page.locator("pre").innerText();
  expect(headerContent).toContain('"X-Test-Header": "ModRequest"');

  // Verify that the second header has NOT been added
  expect(headerContent).not.toContain('"X-Another-Header": "ShouldNotApply"');
});

test("should disable all header rules when global pause is activated", async ({
  page,
}) => {
  // Create a header modification rule
  await createHeaderRule({
    page,
    headerName: "X-Test-Header",
    headerValue: "ModRequest",
  });

  await createHeaderRule({
    page,
    headerName: "X-Another-Header",
    headerValue: "ShouldNotApply",
  });

  // Activate global pause
  await page.getByRole("button", { name: "Pause" }).click();

  // Navigate to a test page
  await page.goto("https://httpbin.org/headers");

  // Verify that the header has NOT been added
  const headerContent = await page.locator("pre").innerText();
  expect(headerContent).not.toContain('"X-Test-Header": "ModRequest"');
});

test("should re-enable header rules when global pause is deactivated", async ({
  page,
}) => {
  // Create a header modification rule
  await createHeaderRule({
    page,
    headerName: "X-Test-Header",
    headerValue: "ModRequest",
  });

  await createHeaderRule({
    page,
    headerName: "X-Another-Header",
    headerValue: "ShouldNotApply",
  });

  // Activate global pause
  await page.getByRole("button", { name: /Pause/ }).click();
  // Deactivate global pause
  await page.getByRole("button", { name: /Resume/ }).click();

  // Navigate to a test page
  await page.goto("https://httpbin.org/headers");

  // Verify that the header has been added
  const headerContent = await page.locator("pre").innerText();
  expect(headerContent).toContain('"X-Test-Header": "ModRequest"');
});
