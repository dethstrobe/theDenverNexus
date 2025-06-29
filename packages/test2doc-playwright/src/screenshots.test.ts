import { beforeEach, describe, expect, it, vi } from "vitest"
import { screenshot, screenshotAssert } from "./screenshots.js"
import type { Page, TestInfo } from "@playwright/test"
import { expect as pwExpect } from "@playwright/test"

describe("Test2Doc Playwright Screenshots", () => {
  const mockToHaveScreenshot = vi.hoisted(() => vi.fn())
  vi.mock("@playwright/test", () => ({
    expect: vi.fn().mockImplementation(() => ({
      toHaveScreenshot: mockToHaveScreenshot,
    })),
  }))
  const screenshotMock = vi.fn().mockImplementation(() => {
    return Promise.resolve(Buffer.from("fake-screenshot-data"))
  })
  const attachMock = vi.fn()
  const locatorMock = vi.fn().mockImplementation(() => ({
    screenshot: screenshotMock,
  }))

  const mockTestInfo = {
    attach: attachMock,
  } as unknown as TestInfo
  const mockPage = {
    locator: locatorMock,
    screenshot: screenshotMock,
  } as unknown as Page

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should take a screenshot and attach it to the test", async () => {
    await screenshot(
      mockTestInfo,
      mockPage,
      "This is a test to take a screenshot using Test2Doc Playwright.",
    )

    expect(locatorMock).not.toHaveBeenCalled()
    expect(screenshotMock).toHaveBeenCalledOnce()
    expect(attachMock).toHaveBeenCalledWith(
      "this-is-a-test-to-take-a-screenshot-using-test2doc-playwright.png",
      {
        body: expect.any(Buffer),
        contentType: "image/png",
      },
    )
  })

  it("should take a screenshot with the selector and attach it to the test", async () => {
    const selector = "#test-selector"
    await screenshot(
      mockTestInfo,
      mockPage,
      "This is a test to take a screenshot with a selector.",
      {},
      selector,
    )

    expect(locatorMock).toHaveBeenCalledWith(selector)
    expect(screenshotMock).toHaveBeenCalledOnce()
    expect(attachMock).toHaveBeenCalledWith(
      "this-is-a-test-to-take-a-screenshot-with-a-selector.png",
      {
        body: expect.any(Buffer),
        contentType: "image/png",
      },
    )
  })

  describe("docScreenshotAssert", () => {
    it("should assert that the page has a screenshot", async () => {
      const options = { maxDiffPixels: 100 }
      await screenshotAssert(
        mockTestInfo,
        mockPage,
        "This is a test to assert a screenshot.",
        options,
      )

      expect(pwExpect).toHaveBeenCalledWith(mockPage)
      expect(mockToHaveScreenshot).toHaveBeenCalledWith(
        "this-is-a-test-to-assert-a-screenshot.png",
        options,
      )
    })
  })
})
