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

  const mockTestInfo = {
    attach: attachMock,
  } as unknown as TestInfo
  const mockPage = {
    screenshot: screenshotMock,
  } as unknown as Page

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should take a screenshot and attach it to the test", async () => {
    await screenshot(mockTestInfo, mockPage)

    expect(screenshotMock).toHaveBeenCalledOnce()
    expect(attachMock).toHaveBeenCalledWith(
      expect.stringMatching(/test2doc-(\d+)\.png/),
      {
        body: expect.any(Buffer),
        contentType: "image/png",
      },
    )
  })

  describe("docScreenshotAssert", () => {
    it("should assert that the page has a screenshot", async () => {
      const options = { maxDiffPixels: 100 }
      await screenshotAssert(mockTestInfo, mockPage, options)

      expect(pwExpect).toHaveBeenCalledWith(mockPage)
      expect(mockToHaveScreenshot).toHaveBeenCalledWith(
        expect.stringMatching(/test2doc-(\d+)\.png/),
        options,
      )
    })
  })
})
