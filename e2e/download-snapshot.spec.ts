import { test, expect } from "@playwright/test";
import { setupWithSnapshot, BASE_URL } from "./helpers";

test.describe("Download Snapshot", () => {
  test.beforeEach(async ({ page }) => {
    await setupWithSnapshot(page);
  });

  test("should display download/export button", async ({ page }) => {
    const downloadButton = page.locator("button.download-button");
    await expect(downloadButton).toBeVisible();
    await expect(downloadButton).toHaveText(/export/i);
  });

  test("should show dropdown menu when clicking export button", async ({
    page,
  }) => {
    const downloadButton = page.locator("button.download-button");
    await downloadButton.click();

    const dropdownMenu = page.locator(".dropdown-menu");
    await expect(dropdownMenu).toBeVisible();
  });

  test("should have JSON and TXT export options in dropdown", async ({
    page,
  }) => {
    const downloadButton = page.locator("button.download-button");
    await downloadButton.click();

    const jsonOption = page.locator('.menu-item:has-text("JSON")');
    const txtOption = page.locator('.menu-item:has-text("TXT")');

    await expect(jsonOption).toBeVisible();
    await expect(txtOption).toBeVisible();
  });

  test("should trigger download when clicking JSON option", async ({
    page,
  }) => {
    const downloadButton = page.locator("button.download-button");
    await downloadButton.click();

    const jsonOption = page.locator('.menu-item:has-text("JSON")');

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      jsonOption.click(),
    ]);

    expect(download.suggestedFilename()).toContain(".json");
  });

  test("should trigger download when clicking TXT option", async ({ page }) => {
    const downloadButton = page.locator("button.download-button");
    await downloadButton.click();

    const txtOption = page.locator('.menu-item:has-text("TXT")');

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      txtOption.click(),
    ]);

    expect(download.suggestedFilename()).toContain(".txt");
  });
});
