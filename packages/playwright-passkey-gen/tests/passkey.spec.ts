import { test, expect } from "@playwright/test"
import { TESTPASSKEY } from "../src/scripts/testpasskey.js"

test.describe("Passkey Authentication", () => {
  test("should authenticate using passkey", async ({ page }) => {
    const context = page.context()

    await context.credentials.create(TESTPASSKEY.rpId, TESTPASSKEY)
    await context.credentials.install()

    await page.goto("/")

    await expect(page.getByRole("status")).toHaveText("")

    // Click the "Test Login with Passkey" button
    await page.getByRole("button", { name: "Test Login with Passkey" }).click()

    // Wait for the success message
    await expect(page.getByRole("status")).toContainText(
      `Authentication successful! User ID: ${TESTPASSKEY.userId}`,
    )
  })
})
