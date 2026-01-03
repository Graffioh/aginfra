import { test, expect } from "@playwright/test";
import { setupWithSnapshot, clearLocalStorage, BASE_URL } from "./helpers";

test.describe("Inspection Panel", () => {
  test.beforeEach(async ({ page }) => {
    await setupWithSnapshot(page);
  });

  test("should display inspection panel with invocation groups after snapshot import", async ({
    page,
  }) => {
    const inspectionPanel = page.locator("#inspection");
    await expect(inspectionPanel).toBeVisible();

    const invocationGroup = page.locator(".invocation-group");
    await expect(invocationGroup.first()).toBeVisible();
  });

  test("should display header with model name", async ({ page }) => {
    const header = page.locator("#inspection .header");
    await expect(header).toBeVisible();

    const model = page.locator("#inspection .model");
    await expect(model).toHaveText("openai/gpt-oss-120b");
  });

  test("should expand invocation group when clicking group header", async ({
    page,
  }) => {
    const groupToggle = page.locator(".group-toggle").first();
    await expect(groupToggle).toBeVisible();

    await groupToggle.click();
    await page.waitForTimeout(300);

    const groupEvents = page.locator(".group-events");
    await expect(groupEvents).toBeVisible();
  });

  test("should display context section", async ({ page }) => {
    const expandButton = page.locator("button.expand-button");
    await expect(expandButton).toBeVisible();
  });

  test("should have clear button", async ({ page }) => {
    const clearButton = page.locator("button.delete-events-button");
    await expect(clearButton).toBeVisible();
    await expect(clearButton).toHaveText("clear");
  });

  test("should show confirm dialog when clicking clear", async ({ page }) => {
    const clearButton = page.locator("button.delete-events-button");
    await clearButton.click();

    const confirmDialog = page.locator("text=Clear all events?");
    await expect(confirmDialog).toBeVisible();
  });

  test("should clear events after confirming delete", async ({ page }) => {
    const invocationGroup = page.locator(".invocation-group");
    await expect(invocationGroup.first()).toBeVisible();

    const clearButton = page.locator("button.delete-events-button");
    await clearButton.click();

    const confirmButton = page.locator('button:has-text("clear")').last();
    await confirmButton.click();

    await page.waitForTimeout(500);
    await expect(invocationGroup).toHaveCount(0);
  });
});
