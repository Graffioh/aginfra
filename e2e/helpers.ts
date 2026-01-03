import { Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_PATH = path.resolve(__dirname, "../maid-snapshot.json");

export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear());
}

export async function importMaidSnapshot(page: Page): Promise<void> {
  const snapshotContent = fs.readFileSync(SNAPSHOT_PATH, "utf-8");
  const snapshot = JSON.parse(snapshotContent);

  const fileInput = page.locator('input[type="file"][accept=".json"]');
  await fileInput.setInputFiles({
    name: "maid-snapshot.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(snapshot)),
  });

  await page.waitForTimeout(500);
}

export async function setupWithSnapshot(page: Page): Promise<void> {
  await page.goto(BASE_URL);
  await clearLocalStorage(page);
  await page.reload();
  await page.waitForTimeout(1000);
  await importMaidSnapshot(page);
}

export const BASE_URL = "http://localhost:5555";
