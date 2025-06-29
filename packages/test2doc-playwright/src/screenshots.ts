import {
  expect,
  type Page,
  type PageAssertionsToHaveScreenshotOptions,
  type PageScreenshotOptions,
  type TestInfo,
} from "@playwright/test"
import { convertToKebabCase } from "./utils.js"

type ScreenshotFn = (
  testInfo: TestInfo,
  page: Page,
  description: string,
  options?: PageScreenshotOptions & PageAssertionsToHaveScreenshotOptions,
  selector?: string,
) => Promise<void>

const screenshotHelper = async (
  testInfo: TestInfo,
  page: Page,
  description: string,
  options?: PageScreenshotOptions & PageAssertionsToHaveScreenshotOptions,
  selector?: string,
) => {
  const target = selector ? page.locator(selector) : page
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
  selector = undefined,
) => {
  const { target, filename } = await screenshotHelper(
    testInfo,
    page,
    description,
    options,
    selector,
  )

  await expect(target).toHaveScreenshot(filename, options)
}
