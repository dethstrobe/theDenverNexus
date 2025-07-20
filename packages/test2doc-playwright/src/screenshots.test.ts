import { beforeEach, describe, expect, it, vi } from "vitest"
import { screenshot } from "./screenshots.js"
import type { Page, TestInfo } from "@playwright/test"

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
    await screenshot(mockTestInfo, mockPage)

    expect(screenshotMock).toHaveBeenCalledTimes(2)
    expect(attachMock).toHaveBeenCalledWith(
      expect.stringMatching(/test2doc-(\d+)-1\.png/),
      {
        body: expect.any(Buffer),
        contentType: "image/png",
      },
    )
    expect(attachMock).toHaveBeenCalledWith(
      expect.stringMatching(/test2doc-(\d+)-2\.png/),
      {
        body: expect.any(Buffer),
        contentType: "image/png",
      },
    )
  })
})
