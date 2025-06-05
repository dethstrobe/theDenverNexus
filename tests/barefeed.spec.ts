import { test, expect } from "@playwright/test"

test("Ping Pong smoke test", async ({ page }) => {
  await page.goto("http://localhost:5173/ping")

  expect(page.getByRole("heading")).toContainText("Pong!")
})

// test("rss feed", async ({ page }) => {
//   await page.goto("http://localhost:5173/")

//   // Click the get started link.
//   await page
//     .getByRole("textbox", { name: "RSS Feed URL to Follow" })
//     .fill("https://example.com/rss")
//   await page.getByRole("button", { name: "Add to Feed" }).click()

//   // Expects page to have a heading with the name of Installation.
//   await expect(
//     page.getByRole("heading", { name: "Article 4 Title." }),
//   ).toBeVisible()
// })
