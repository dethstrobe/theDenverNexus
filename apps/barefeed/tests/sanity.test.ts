import { expect, test } from "@playwright/test"

test("sanity check", async ({ page }) => {
  await page.goto("/")
  expect(true).toBeTruthy()
  await expect(page.getByRole("heading")).toBeVisible()
})
