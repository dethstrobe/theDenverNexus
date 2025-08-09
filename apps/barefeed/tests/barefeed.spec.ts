import { test, expect } from "@playwright/test"
import { withDocMeta } from "@test2doc/playwright/DocMeta"
import { screenshot } from "@test2doc/playwright/screenshots"

test.describe(
  withDocMeta("Ping Pong route", { sidebar_position: 2 }),
  {
    annotation: [
      {
        type: "docs",
        description: "This test checks the ping pong route.",
      },
    ],
  },
  () => {
    test("Ping Pong smoke test", async ({ page }) => {
      await page.goto("http://localhost:5173/ping")

      await expect(page.getByRole("heading")).toContainText("Pong!")
    })
  },
)

test.describe(withDocMeta("RSS Feed Tests", { sidebar_position: 1 }), () => {
  test("rss feed", async ({ page }, testInfo) => {
    await test.step("Given a user is on the home page", async () => {
      await page.goto("http://localhost:5173/")
      await screenshot(testInfo, page)
    })

    await test.step("When the user adds and rss to their feed", async () => {
      // Click the get started link.
      const feedInput = page.getByRole("textbox", {
        name: "RSS Feed URL to Follow",
      })
      await feedInput.fill("http://localhost:5173/TEST/rssData1")
      await screenshot(testInfo, feedInput)
      await page.getByRole("button", { name: "Add to Feed" }).click()
      await expect(feedInput).toHaveValue("")
    })
    await test.step("Then the feed should populate with the rss content", async () => {
      // Expects page to have a heading with the name of Installation.
      await expect(
        page.getByRole("heading", { name: "Article 4 Title." }),
      ).toBeVisible()
      await screenshot(testInfo, page)
    })
  })
})

test("screenshot test", async ({ page }, testInfo) => {
  await test.step("Take a screenshot of the page", async () => {
    await page.goto("http://localhost:5173/screenshot")
    await screenshot(testInfo, page)
  })

  await test.step("Take a screenshot and highlight the element", async () => {
    const element = page.getByRole("group", {
      name: "Screenshot Functionality",
    })
    await element.scrollIntoViewIfNeeded()
    await expect(element).toBeVisible()
    await screenshot(testInfo, element)
  })
})
