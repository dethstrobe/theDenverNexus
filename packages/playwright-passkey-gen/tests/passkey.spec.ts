import { test, expect } from "@playwright/test"
import { TESTPASSKEY } from "../src/scripts/testpasskey.js"
import {
  enablePasskey,
  addPasskeyCredential,
  simulateSuccessfulPasskeyInput,
} from "../src/passkey-util.js"

test.describe("Passkey Authentication", () => {
  test("should authenticate using passkey", async ({ page }) => {
    await page.goto("http://localhost:5173/")
    const passkeyAuthenticator = await enablePasskey(page)
    await addPasskeyCredential(passkeyAuthenticator, TESTPASSKEY)

    await expect(page.getByRole("status")).toHaveText("")

    // Click the "Test Login with Passkey" button
    await simulateSuccessfulPasskeyInput(passkeyAuthenticator, async () => {
      await page
        .getByRole("button", { name: "Test Login with Passkey" })
        .click()
    })

    // Wait for the success message
    await expect(page.getByRole("status")).toContainText(
      `Authentication successful! User ID: ${TESTPASSKEY.userId}`,
    )
  })
})
