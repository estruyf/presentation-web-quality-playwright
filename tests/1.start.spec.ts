import { test, expect } from "@playwright/test";

const SESSION_URL = "https://engagetime.live/session/yysmtw";

test.describe("EngageTime Session - E2E Testing Basics", () => {
  test.beforeEach(async ({ page }) => {
    // Each test gets a fresh context - no state pollution between tests
    await page.goto(SESSION_URL);
    // Wait for session content to load
    await page.waitForLoadState("networkidle");
  });

  test("Check if session page loads correctly", async ({ page }) => {
    // Get an element - Using semantic locators
    const mainContent = page.locator("main");

    // Test assertion - Web-first assertion with auto-retry
    await expect(mainContent).toBeVisible();

    // Page URL will include hash for navigation
    await expect(page).toHaveURL(/session\/yysmtw/);
  });

  test("Verify session title is displayed", async ({ page }) => {
    // Test isolation & best practices - Using semantic locators
    // Use getByRole to get the specific h1 (session title, not logo)
    const sessionTitle = page.getByRole("heading", {
      name: /Enhancing web application/,
    });

    // Web-first assertions - Auto-retry until timeout
    await expect(sessionTitle).toBeVisible();

    // Get text content
    const headingText = await sessionTitle.textContent();
    expect(headingText).toContain("Enhancing web application quality");
  });

  test("Verify session welcome message", async ({ page }) => {
    // Organize into steps - Use test.step() for clarity
    await test.step("Find welcome heading", async () => {
      const welcomeHeading = page.getByRole("heading", { name: "Welcome to" });
      await expect(welcomeHeading).toBeVisible();
    });

    await test.step("Verify session description", async () => {
      const description = page.locator("main >> p");
      const descriptionText = await description.first().textContent();
      expect(descriptionText).toContain("Session at Techorama NL");
    });
  });

  test("Verify session registration form", async ({ page }) => {
    // Organize into steps - Use test.step() for clarity
    await test.step("Find name input field", async () => {
      const nameInput = page.locator('input[placeholder="Enter your name..."]');
      await expect(nameInput).toBeVisible();
    });

    await test.step("Find Join Session button", async () => {
      const joinButton = page.getByRole("button", { name: "Join Session" });
      await expect(joinButton).toBeVisible();
      await expect(joinButton).toBeDisabled();
    });

    await test.step("Verify form instructions", async () => {
      const instructions = page.getByText(
        "This will be used to identify you in Q&A and feedback"
      );
      await expect(instructions).toBeVisible();
    });
  });

  test("Test user registration workflow", async ({ page }) => {
    await test.step("Check if button is disabled", async () => {
      const joinButton = page.getByRole("button", { name: "Join Session" });
      await expect(joinButton).toBeDisabled();
    });

    await test.step("Find and fill name input", async () => {
      const nameInput = page.locator('input[placeholder="Enter your name..."]');
      await nameInput.fill("Playwright User");
      await expect(nameInput).toHaveValue("Playwright User");
    });

    await test.step("Verify Join button is ready", async () => {
      const joinButton = page.getByRole("button", { name: "Join Session" });
      await expect(joinButton).toBeEnabled();
    });

    await test.step("Submit the registration form", async () => {
      const joinButton = page.getByRole("button", { name: "Join Session" });
      await joinButton.click();

      // After submission, URL should change to include participant hash
      await expect(page).toHaveURL(/session\/yysmtw#resources/);
    });
  });
});
