import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.getByLabel("Email").click();
  await page.getByLabel("Email").fill("user@example.com");
  await page.getByLabel("Email").press("Tab");
  await page.getByLabel("Password").fill("password_1");
  await page.getByRole("button", { name: "Login" }).click();
});

test("homepage has title and links to intro page", async ({ page }) => {
  await page.goto("http://localhost:3000/todo");
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("ciao come sta");
  await page.getByRole("textbox").press("Tab");
  await page.getByRole("button", { name: "Add Todo" }).press("Enter");
  await page.getByRole("textbox").click();
  await page.getByRole("textbox").fill("proca");
  await page.getByRole("textbox").press("Tab");
  await page.getByRole("button", { name: "Add Todo" }).press("Enter");
  await page.getByRole("textbox").fill("ancoda uo");
  await page.getByRole("textbox").press("Enter");
});
