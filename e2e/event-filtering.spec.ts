import { test, expect } from "@playwright/test";
import { setupWithSnapshot, BASE_URL } from "./helpers";

test.describe("Event Filtering", () => {
  test.beforeEach(async ({ page }) => {
    await setupWithSnapshot(page);
  });

  test("should display label filter dropdown", async ({ page }) => {
    const filterDropdown = page.locator("select.label-filter-dropdown");
    await expect(filterDropdown).toBeVisible();
  });

  test("should have 'All' as default filter option", async ({ page }) => {
    const filterDropdown = page.locator("select.label-filter-dropdown");
    await expect(filterDropdown).toHaveValue("all");
  });

  test("should have All, Tools, and Errors filter options", async ({
    page,
  }) => {
    const filterDropdown = page.locator("select.label-filter-dropdown");
    const options = filterDropdown.locator("option");

    await expect(options).toHaveCount(3);
    await expect(options.nth(0)).toHaveText("All");
    await expect(options.nth(1)).toHaveText("Tools");
    await expect(options.nth(2)).toHaveText("Errors");
  });

  test("should filter events when selecting Tools filter", async ({ page }) => {
    const filterDropdown = page.locator("select.label-filter-dropdown");

    await filterDropdown.selectOption("tools");
    await page.waitForTimeout(300);

    await expect(filterDropdown).toHaveValue("tools");
  });

  test("should filter events when selecting Errors filter", async ({
    page,
  }) => {
    const filterDropdown = page.locator("select.label-filter-dropdown");

    await filterDropdown.selectOption("errors");
    await page.waitForTimeout(300);

    await expect(filterDropdown).toHaveValue("errors");
  });

  test("should return to showing all events when selecting All filter", async ({
    page,
  }) => {
    const filterDropdown = page.locator("select.label-filter-dropdown");

    await filterDropdown.selectOption("tools");
    await page.waitForTimeout(300);

    await filterDropdown.selectOption("all");
    await page.waitForTimeout(300);

    await expect(filterDropdown).toHaveValue("all");
  });
});
