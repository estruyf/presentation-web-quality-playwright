import { test as setup } from "@playwright/test";
import { existsSync } from "fs";
import { login } from "playwright-m365-helpers";

const authFile = "playwright/.auth/user.json";

// More info: https://playwright.dev/docs/auth
setup("authenticate", async ({ page }) => {
  if (existsSync(authFile)) {
    return;
  }

  await login(
    page,
    process.env.M365_PAGE_URL,
    process.env.M365_USERNAME,
    process.env.M365_PASSWORD,
    process.env.M365_OTP_SECRET
  );

  await page.context().storageState({ path: authFile });
});
