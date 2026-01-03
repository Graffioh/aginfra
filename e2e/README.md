# E2E Tests for MAID

Playwright tests for the MAID (My Agent Is Dumb) inspection tool.

## Prerequisites

- Frontend running on `http://localhost:5555` (`pnpm dev:frontend`)
- Playwright installed

## Important: Snapshot Import

Most tests require importing the `maid-snapshot.json` file to have dummy data available. The `setupWithSnapshot()` helper handles this automatically:

```typescript
import { setupWithSnapshot } from "./helpers";

test.beforeEach(async ({ page }) => {
  await setupWithSnapshot(page);
});
```

This helper:
1. Navigates to the app
2. Clears localStorage
3. Reloads the page
4. Imports `maid-snapshot.json`

## Test Files

| File | Description |
|------|-------------|
| `helpers.ts` | Shared utilities for importing snapshots and setup |
| `import-snapshot.spec.ts` | Tests for snapshot import functionality |
| `inspection-panel.spec.ts` | Tests for main inspection panel features |
| `judge-panel.spec.ts` | Tests for judge panel toggle and display |
| `event-filtering.spec.ts` | Tests for event label filtering |
| `latency-heatmap.spec.ts` | Tests for latency heatmap visualization |
| `download-snapshot.spec.ts` | Tests for snapshot export (JSON/TXT dropdown) |

## Running Tests

```bash
# Run all tests
npx playwright test e2e/

# Run specific test file
npx playwright test e2e/import-snapshot.spec.ts

# Run with UI
npx playwright test e2e/ --ui

# Run headed (see browser)
npx playwright test e2e/ --headed
```

## Writing New Tests

Always use the helpers to ensure consistent setup:

```typescript
import { test, expect } from "@playwright/test";
import { setupWithSnapshot, clearLocalStorage, BASE_URL } from "./helpers";

test.describe("My Feature", () => {
  test.beforeEach(async ({ page }) => {
    // Use this for tests that need imported data
    await setupWithSnapshot(page);
    
    // Or for tests that need a clean state:
    // await page.goto(BASE_URL);
    // await clearLocalStorage(page);
    // await page.reload();
  });

  test("should do something", async ({ page }) => {
    // Your test here
  });
});
```
