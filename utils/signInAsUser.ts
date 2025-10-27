import { expect } from "@playwright/test";

export const signInAsUser = async (page, userName: string) => {
  let joinButton = page.getByRole("button", { name: "Join Session" });
  await expect(joinButton).toBeDisabled();

  const nameInput = page.locator('input[placeholder="Enter your name..."]');
  await nameInput.fill(userName);
  await expect(nameInput).toHaveValue(userName);

  joinButton = page.getByRole("button", { name: "Join Session" });
  await expect(joinButton).toBeEnabled();

  joinButton = page.getByRole("button", { name: "Join Session" });
  await joinButton.click();

  // After submission, URL should change to include participant hash
  await expect(page).toHaveURL(/session\/yysmtw#resources/);
};
