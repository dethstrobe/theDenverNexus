import { beforeEach, describe, expect, it, vi } from "vitest"
import { screenshot } from "./screenshots.js"
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
})
