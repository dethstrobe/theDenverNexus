import {
  expect,
  type Locator,
  type Page,
  type PageAssertionsToHaveScreenshotOptions,
  type PageScreenshotOptions,
  type TestInfo,
} from "@playwright/test"
import { convertToKebabCase } from "./utils.js"

type ScreenshotFn = (
  testInfo: TestInfo,
  target: Page | Locator,
  description: string,
  options?: PageScreenshotOptions & PageAssertionsToHaveScreenshotOptions,
) => Promise<void>

const screenshotHelper = async (
  testInfo: TestInfo,
  target: Page | Locator,
  description: string,
  options?: PageScreenshotOptions & PageAssertionsToHaveScreenshotOptions,
) => {
  const filename = `${convertToKebabCase(description)}.png`
  const screenshot = target.screenshot(options)

  await testInfo.attach(filename, {
    body: await screenshot,
    contentType: "image/png",
  })

  return { target, filename }
}

export const screenshot: ScreenshotFn = async (...args) => {
  await screenshotHelper(...args)
}

export const screenshotAssert: ScreenshotFn = async (
  testInfo,
  page,
  description,
  options = {},
) => {
  const { target, filename } = await screenshotHelper(
    testInfo,
    page,
    description,
    options,
  )

  await expect(target).toHaveScreenshot(filename, options)
}
