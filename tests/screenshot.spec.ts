import { test } from "@playwright/test";

test.describe("Screenshot Tests", () => {
  test("Given I navigate to website 'https://engagetime.live' using the 'chromium' browser And I take a screenshot named 'chromium-example'", async ({
    page,
    browserName,
  }) => {
    // Given I navigate to website "https://engagetime.live" using the "chromium" browser
    if (browserName === "chromium") {
      await page.goto("https://engagetime.live");
      await page.waitForLoadState("networkidle");

      // And I take a screenshot named "chromium-example"
      await page.screenshot({
        path: `screenshots/chromium-example.png`,
        fullPage: true,
      });
    }
  });
});
