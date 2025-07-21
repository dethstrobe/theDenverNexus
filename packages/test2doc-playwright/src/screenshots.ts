import type {
  Locator,
  Page,
  PageAssertionsToHaveScreenshotOptions,
  PageScreenshotOptions,
  TestInfo,
} from "@playwright/test"

let screenshotCounter = 0

export const screenshot = async (
  testInfo: TestInfo,
  target: Page | Locator,
  options?: PageScreenshotOptions & PageAssertionsToHaveScreenshotOptions,
) => {
  const filename = `test2doc-${Date.now()}-${++screenshotCounter}.png`

  let screenshot: Buffer
  if ("highlight" in target) {
    // Target is a locator - highlight it first, then get its page
    await target.highlight()
    const page = target.page()

    screenshot = await page.screenshot(options)

    // Remove highlighting after taking the screenshot
    const glassElements = page.locator("X-PW-GLASS")
    await glassElements.evaluateAll((elements) => {
      elements.forEach((el) => el.remove())
    })
  } else {
    // Target is already a page
    screenshot = await target.screenshot(options)
  }

  await testInfo.attach(filename, {
    body: screenshot,
    contentType: "image/png",
  })
}
