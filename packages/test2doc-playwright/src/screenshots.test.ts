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
    const mockEvaluate = vi.fn().mockResolvedValue(undefined)

    const mockPageWithEvaluate = {
      ...mockPage,
      evaluate: mockEvaluate,
    }

    const boundingBox = {
      x: 100,
      y: 100,
      width: 200,
      height: 200,
    }

    const locator = {
      boundingBox() {
        return Promise.resolve(boundingBox)
      },
      page: vi.fn().mockReturnValue(mockPageWithEvaluate),
      screenshot: screenshotMock,
      highlight: vi.fn(),
      scrollIntoViewIfNeeded: vi.fn(),
    } as unknown as Locator

    await screenshot(mockTestInfo, locator)

    // Test the important behaviors
    expect(mockEvaluate).toHaveBeenCalledTimes(2)

    // Make sure elements are scrolled into view
    expect(locator.scrollIntoViewIfNeeded).toHaveBeenCalledTimes(1)

    // Test that the evaluateAll callback would call remove() on elements
    const [canvasCreationCallback, boundingBoxArg] = mockEvaluate.mock.calls[0]
    expect(boundingBoxArg).toEqual(boundingBox)

    const mockDocument = {
      createElement: vi.fn().mockReturnValue({
        style: { cssText: "" },
        getContext: vi.fn().mockReturnValue({
          strokeRect: vi.fn(),
          fillRect: vi.fn(),
        }),
      }),
      getElementById: vi.fn().mockReturnValue(null),
      body: { appendChild: vi.fn() },
    }
    const mockWindow = {
      innerWidth: 1920,
      innerHeight: 1080,
    }

    // Mock the browser environment for the evaluate callback
    // Use vi.stubGlobal to safely stub global objects in Vitest
    vi.stubGlobal("document", mockDocument)
    vi.stubGlobal("window", mockWindow)

    canvasCreationCallback(boundingBoxArg)

    expect(mockDocument.createElement).toHaveBeenCalledWith("canvas")
    expect(mockDocument.body.appendChild).toHaveBeenCalled()

    // Test the cleanup call
    const cleanupCallback = mockEvaluate.mock.calls[1][0]
    const mockCanvas = { remove: vi.fn() }
    mockDocument.getElementById = vi.fn().mockReturnValue(mockCanvas)

    cleanupCallback()

    expect(mockDocument.getElementById).toHaveBeenCalledWith(
      "test2doc-highlight-canvas",
    )
    expect(mockCanvas.remove).toHaveBeenCalled()

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
