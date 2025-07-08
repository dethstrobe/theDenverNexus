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
  const screenshot = target.screenshot(options)

  await testInfo.attach(filename, {
    body: await screenshot,
    contentType: "image/png",
  })
}
