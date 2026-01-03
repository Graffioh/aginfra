import { test, expect } from "@playwright/test";
import { setupWithSnapshot, BASE_URL } from "./helpers";

test.describe("Judge Panel", () => {
  test.beforeEach(async ({ page }) => {
    await setupWithSnapshot(page);
  });

  test("should display judge toggle button", async ({ page }) => {
    const judgeToggle = page.locator("button.judge-toggle");
    await expect(judgeToggle).toBeVisible();
  });

  test("should toggle judge panel open when clicking toggle button", async ({
    page,
  }) => {
    const judgeToggle = page.locator("button.judge-toggle");
    const judgePanel = page.locator("#panel-judge");

    await expect(judgePanel).toHaveClass(/collapsed/);

    await judgeToggle.click();
    await page.waitForTimeout(400);

    await expect(judgePanel).not.toHaveClass(/collapsed/);
  });

  test("should toggle judge panel closed when clicking toggle again", async ({
    page,
  }) => {
    const judgeToggle = page.locator("button.judge-toggle");
    const judgePanel = page.locator("#panel-judge");

    await judgeToggle.click();
    await page.waitForTimeout(400);
    await expect(judgePanel).not.toHaveClass(/collapsed/);

    await judgeToggle.click();
    await page.waitForTimeout(400);
    await expect(judgePanel).toHaveClass(/collapsed/);
  });

  test("should show arrow indicator on toggle button", async ({ page }) => {
    const arrow = page.locator("button.judge-toggle .arrow");
    await expect(arrow).toBeVisible();
    await expect(arrow).toContainText("▶");
  });

  test("should rotate arrow when panel is expanded", async ({ page }) => {
    const judgeToggle = page.locator("button.judge-toggle");
    const arrow = page.locator("button.judge-toggle .arrow");

    await expect(arrow).toHaveClass(/collapsed/);

    await judgeToggle.click();
    await page.waitForTimeout(400);

    await expect(arrow).not.toHaveClass(/collapsed/);
  });

  test("should display judge content when panel is open", async ({ page }) => {
    const judgeToggle = page.locator("button.judge-toggle");

    await judgeToggle.click();
    await page.waitForTimeout(400);

    const judgeContent = page.locator("#judge-content");
    await expect(judgeContent).not.toHaveClass(/hidden/);
  });
});
