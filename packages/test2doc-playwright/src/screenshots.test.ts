import { beforeEach, describe, expect, it, vi } from "vitest"
import { screenshot } from "./screenshots.js"
import type { Locator, Page, TestInfo } from "@playwright/test"

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

  it("should highlight an element and take a screenshot", async () => {
    const mockEvaluateAll = vi.fn().mockResolvedValue(undefined)

    const mockPageWithLocator = {
      ...mockPage,
      locator: vi.fn().mockReturnValue({
        evaluateAll: mockEvaluateAll,
      }),
    }

    const locator = {
      highlight: vi.fn().mockResolvedValue(Promise.resolve()),
      page: vi.fn().mockReturnValue(mockPageWithLocator),
    } as unknown as Locator

    await screenshot(mockTestInfo, locator)

    // Test the important behaviors
    expect(locator.highlight).toHaveBeenCalled()
    expect(mockPageWithLocator.locator).toHaveBeenCalledWith("X-PW-GLASS")
    expect(mockEvaluateAll).toHaveBeenCalled()

    // Test that the evaluateAll callback would call remove() on elements
    const evaluateAllCallback = mockEvaluateAll.mock.calls[0][0]
    const mockElement = { remove: vi.fn() }
    evaluateAllCallback([mockElement])
    expect(mockElement.remove).toHaveBeenCalled()

    expect(screenshotMock).toHaveBeenCalledTimes(1)
    expect(attachMock).toHaveBeenCalledWith(
      expect.stringMatching(/test2doc-(\d+)-(\d+)\.png/),
      {
        body: expect.any(Buffer),
        contentType: "image/png",
      },
    )
  })
})
