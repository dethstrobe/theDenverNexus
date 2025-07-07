import type {
  Locator,
  Page,
  PageAssertionsToHaveScreenshotOptions,
  PageScreenshotOptions,
  TestInfo,
} from "@playwright/test"

export const screenshot = async (
  testInfo: TestInfo,
  target: Page | Locator,
  options?: PageScreenshotOptions & PageAssertionsToHaveScreenshotOptions,
) => {
  const filename = `test2doc-${Date.now()}.png`
  const screenshot = target.screenshot(options)

  await testInfo.attach(filename, {
    body: await screenshot,
    contentType: "image/png",
  })
}
