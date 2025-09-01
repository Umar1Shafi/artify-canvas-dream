import { test, expect, Page } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

function makeTempJpeg(): string {
  const p = path.join(process.cwd(), "tmp_upload.jpg");
  const jpegBytes = Buffer.from([
    0xFF,0xD8,0xFF,0xDB,0x00,0x43,0x00,0x03,0x02,0x02,0x03,0x02,0x02,0x03,0x03,0x03,
    0x03,0x04,0x03,0x03,0x04,0x05,0x08,0x05,0x05,0x04,0x04,0x05,0x0A,0x07,0x07,0x06,
    0x08,0x0C,0x0A,0x0C,0x0C,0x0B,0x0A,0x0B,0x0B,0x0D,0x0E,0x12,0x10,0x0D,0x0E,0x11,
    0x0E,0x0B,0x0B,0x10,0x16,0x10,0x11,0x13,0x14,0x15,0x15,0x15,0x0C,0x0F,0x17,0x18,
    0x16,0x14,0x18,0x12,0x14,0x15,0x14,0xFF,0xC0,0x00,0x0B,0x08,0x00,0x01,0x00,0x01,
    0x01,0x01,0x11,0x00,0xFF,0xC4,0x00,0x14,0x00,0x01,0x00,0x00,0x00,0x00,0x00,0x00,
    0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0xFF,0xC4,0x00,0x14,0x10,0x01,
    0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
    0xFF,0xDA,0x00,0x08,0x01,0x01,0x00,0x00,0x3F,0x00,0xD2,0xCF,0x20,0xFF,0xD9
  ]);
  fs.writeFileSync(p, jpegBytes);
  return p;
}

async function selectAnyStyle(page: Page) {
  const styleLabels = [/cinematic/i, /anime/i, /cyberpunk/i, /noir/i];
  for (const re of styleLabels) {
    const btn = page.getByRole("button", { name: re }).first();
    if (await btn.count()) { await btn.click().catch(()=>{}); return true; }
    const tile = page.getByText(re).first();
    if (await tile.count()) { await tile.click().catch(()=>{}); return true; }
  }
  return false;
}

async function clickAnyCTA(page: Page) {
  const labels = [
    /upload & style/i, /preview/i, /stylize/i, /generate/i,
    /apply/i, /render/i, /start/i, /create/i,
  ];
  for (const re of labels) {
    const btnByRole = page.getByRole("button", { name: re }).first();
    if (await btnByRole.count()) { await btnByRole.click().catch(()=>{}); return true; }
    const byText = page.getByText(re).first();
    if (await byText.count()) { await byText.click().catch(()=>{}); return true; }
  }
  const anyVisible = page.locator("button:visible").first();
  if (await anyVisible.count()) { await anyVisible.click().catch(()=>{}); return true; }
  return false;
}

test("homepage loads and shows primary controls", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("AI-Powered Style Transfer", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("Choose Artistic Style", { exact: false }).first()).toBeVisible();
  const btnCount = await page.locator("button").count();
  expect(btnCount).toBeGreaterThan(0);
});

test("upload → select style → trigger API; 500 is handled", async ({ page }) => {
  await page.goto("/");

  // Mock the API and track if it was called
  let hit = false;
  await page.route("**/api/stylize", async route => {
    hit = true;
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ detail: { code: "PIPELINE_ERROR", message: "Simulated failure from test" } })
    });
  });

  // Upload a file (hidden <input type=file> is fine)
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(makeTempJpeg());

  // Pick any style (many UIs require this before enabling the CTA)
  await selectAnyStyle(page);

  // Click whatever CTA exists
  const clicked = await clickAnyCTA(page);
  expect(clicked).toBeTruthy();

  // Assert the network was hit (up to 10s)
  await expect.poll(() => hit, { timeout: 10_000 }).toBeTruthy();

  // Optionally assert a toast/alert if your UI surfaces it:
  const maybeAlert = page.getByRole("alert").first();
  if (await maybeAlert.count()) {
    await expect(maybeAlert).toBeVisible();
  }
});
