import { test, expect } from "@playwright/test";

test.describe(`Validate if we can login`, () => {
  test(`Login to M365`, async ({ page }) => {
    await page.goto(process.env.M365_PAGE_URL || "", {
      waitUntil: "domcontentloaded",
    });

    await expect(page).toHaveURL(process.env.M365_PAGE_URL || "");
  });
});
