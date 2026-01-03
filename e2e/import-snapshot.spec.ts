import { test, expect } from "@playwright/test";
import { clearLocalStorage, importMaidSnapshot, BASE_URL } from "./helpers";

test.describe("Import Snapshot", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await clearLocalStorage(page);
    await page.reload();
    await page.waitForTimeout(1000);
  });

  test("should display import button in header", async ({ page }) => {
    const importButton = page.locator("button.import-button");
    await expect(importButton).toBeVisible();
    await expect(importButton).toHaveText(/import/i);
  });

  test("should import maid-snapshot.json and display invocation groups", async ({
    page,
  }) => {
    await importMaidSnapshot(page);

    const invocationGroup = page.locator(".invocation-group");
    await expect(invocationGroup.first()).toBeVisible({ timeout: 5000 });
  });

  test("should show model name after import", async ({ page }) => {
    await importMaidSnapshot(page);

    const modelDisplay = page.locator(".model");
    await expect(modelDisplay).toHaveText("openai/gpt-oss-120b");
  });

  test("should switch to snapshot view mode after import", async ({ page }) => {
    await importMaidSnapshot(page);

    const snapshotPill = page.locator("button.pill.snapshot");
    await expect(snapshotPill).toBeVisible({ timeout: 5000 });
    await expect(snapshotPill).toHaveText("Snapshot");
  });
});
