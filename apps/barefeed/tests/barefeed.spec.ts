import { test, expect } from "@playwright/test"

test("Ping Pong smoke test", async ({ page }) => {
  await page.goto("http://localhost:5173/ping")

  await expect(page.getByRole("heading")).toContainText("Pong!")
})

test.describe("RSS Feed Tests", () => {
  test("rss feed", async ({ page }) => {
    await page.goto("http://localhost:5173/")

    // Click the get started link.
    const feedInput = page.getByRole("textbox", {
      name: "RSS Feed URL to Follow",
    })
    await feedInput.fill("http://localhost:5173/TEST/rssData1")
    await page.getByRole("button", { name: "Add to Feed" }).click()
    await expect(feedInput).toHaveValue("")

    // Expects page to have a heading with the name of Installation.
    await expect(
      page.getByRole("heading", { name: "Article 4 Title." }),
    ).toBeVisible()
  })
})
