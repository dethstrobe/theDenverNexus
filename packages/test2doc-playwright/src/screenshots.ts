import {
  expect,
  type Locator,
  type Page,
  type PageAssertionsToHaveScreenshotOptions,
  type PageScreenshotOptions,
  type TestInfo,
} from "@playwright/test"

type ScreenshotFn = (
  testInfo: TestInfo,
  target: Page | Locator,
  options?: PageScreenshotOptions & PageAssertionsToHaveScreenshotOptions,
) => Promise<void>

const screenshotHelper = async (
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

  return { filename }
}

export const screenshot: ScreenshotFn = async (...args) => {
  await screenshotHelper(...args)
}

export const screenshotAssert: ScreenshotFn = async (
  testInfo,
  target,
  options = {},
) => {
  const { filename } = await screenshotHelper(testInfo, target, options)

  await expect(target).toHaveScreenshot(filename, options)
}
