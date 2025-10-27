import { test, expect } from "@playwright/test";
import { signInAsUser } from "../utils/signInAsUser";

const SESSION_URL = "https://engagetime.live/session/yysmtw";
const SITE_URL = "https://api.engagetime.live";
const SESSION_ID = "yysmtw";

test.describe("EngageTime Session - API Testing", () => {
  test.beforeEach(async ({ page }) => {
    // Each test gets a fresh context - no state pollution between tests
    await page.goto(SESSION_URL);
    // Wait for session content to load
    await page.waitForLoadState("networkidle");
  });

  test("Verify questions API", async ({ request }) => {
    // API Testing example from slides
    const response = await request.get(
      `${SITE_URL}/sessions/${SESSION_ID}/questions`
    );

    // Test assertion
    expect(response.status()).toBeLessThan(400);

    // Get response text
    const json = await response.json();
    expect(json.length).toBeGreaterThanOrEqual(0);
  });

  test("Mock no questions", async ({ page }) => {
    await page.route("**/sessions/**/questions", (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify([]),
      })
    );

    await signInAsUser(page, "Playwright User");
    await page.getByRole("tab", { name: "Q&A" }).click();

    const noQuestionsMessage = page.getByTestId(`no-questions-placeholder`);
    await expect(noQuestionsMessage).toBeVisible();
  });

  test("Mock questions", async ({ page }) => {
    await page.route("**/sessions/**/questions", (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify([
          {
            id: "56b602fb-77ed-4c61-a0bc-3a8ae6781e12",
            sessionId: SESSION_ID,
            question: "How does pixel matching work in Playwright?",
            attendeeName: "Playwright User",
            upvotes: 0,
            upvotedBy: [],
            answer: "",
            isAnswered: false,
            createdAt: "2025-08-16T14:26:04.754Z",
          },
        ]),
      })
    );

    await signInAsUser(page, "Playwright User");
    await page.getByRole("tab", { name: "Q&A" }).click();

    const questions = page.getByTestId(`question-item`);
    await expect(questions).toHaveCount(1);
  });
});
