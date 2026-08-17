import { expect, test } from "@playwright/test";

test("registered user can create and view a new paste", async ({ page }) => {
  const uniqueId = Math.random().toString(36).substring(2, 9);

  const registerData = {
    email: `${uniqueId}@playwright.com`,
    username: `user_${uniqueId}`,
    password: "StrongPassword1!",
  };

  const pasteData = {
    title: `E2E paste ${uniqueId}`,
    content: "This paste was created by a Playwright E2E test",
  };

  await page.goto("http://localhost:5173");
  await expect(page).toHaveTitle(/Home/);

  await page.click("button:has-text('Sign in')");
  await expect(page).toHaveTitle(/Sign in/);

  await page.getByRole("link", { name: "Create one" }).click();
  await expect(page).toHaveTitle(/Register/);

  await page.getByLabel("Email").fill(registerData.email);
  await page.getByLabel("Username").fill(registerData.username);
  await page
    .getByLabel("Password", { exact: true })
    .fill(registerData.password);
  await page.getByLabel("Confirm password").fill(registerData.password);

  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("No pastes in your workspace yet")).toBeVisible();

  await page.getByRole("button", { name: "Create paste" }).click();
  await expect(page).toHaveTitle(/Create new paste/);

  await page.getByLabel("Title").fill(pasteData.title);
  await page.getByLabel("Content").fill(pasteData.content);

  await page.getByRole("button", { name: "Create paste" }).click();
  await expect(page).toHaveTitle(/Paste/);

  await expect(
    page.getByRole("heading", { name: pasteData.title }),
  ).toBeVisible();
  await expect(page.getByText(pasteData.content)).toBeVisible();
});
