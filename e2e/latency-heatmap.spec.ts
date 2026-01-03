import { test, expect } from "@playwright/test";
import { setupWithSnapshot, BASE_URL } from "./helpers";

test.describe("Latency Heatmap", () => {
  test.beforeEach(async ({ page }) => {
    await setupWithSnapshot(page);
  });

  test("should display latency heatmap container", async ({ page }) => {
    const heatmap = page.locator(".heatmap-container");
    await expect(heatmap).toBeVisible();
  });

  test("should show heatmap title", async ({ page }) => {
    const heatmapTitle = page.locator(".heatmap-title");
    await expect(heatmapTitle).toHaveText("Latency");
  });

  test("should display heatmap stats with step count and max", async ({
    page,
  }) => {
    const heatmapStats = page.locator(".heatmap-stats");
    await expect(heatmapStats).toBeVisible();
    await expect(heatmapStats).toContainText("steps");
    await expect(heatmapStats).toContainText("Max:");
  });

  test("should show heatmap bars for events", async ({ page }) => {
    const heatmapBars = page.locator(".heatmap-bar");
    const count = await heatmapBars.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should select bar when clicking on it", async ({ page }) => {
    const heatmapBar = page.locator(".heatmap-bar").first();
    await heatmapBar.click();
    await page.waitForTimeout(300);

    await expect(heatmapBar).toHaveClass(/selected/);
  });

  test("should display legend with Low, Medium, High labels", async ({
    page,
  }) => {
    const legend = page.locator(".heatmap-legend");
    await expect(legend).toBeVisible();

    await expect(legend).toContainText("Low");
    await expect(legend).toContainText("Medium");
    await expect(legend).toContainText("High");
  });

  test("should have clickable max button in stats", async ({ page }) => {
    const maxButton = page.locator(".max-button");
    await expect(maxButton).toBeVisible();
    await expect(maxButton).toContainText("Max:");
  });
});
