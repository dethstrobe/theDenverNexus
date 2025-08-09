import type {
  Locator,
  Page,
  PageAssertionsToHaveScreenshotOptions,
  PageScreenshotOptions,
  TestInfo,
} from "@playwright/test"

let screenshotCounter = 0

export const screenshot = async (
  testInfo: TestInfo,
  target: Page | Locator,
  options?: PageScreenshotOptions & PageAssertionsToHaveScreenshotOptions,
) => {
  const filename = `test2doc-${Date.now()}-${++screenshotCounter}.png`

  let screenshot: Buffer
  if ("highlight" in target) {
    const page = target.page()

    await target.scrollIntoViewIfNeeded()

    const boundingBox = await target.boundingBox()
    if (boundingBox) {
      await page.evaluate((box) => {
        const canvas = document.createElement("canvas")
        canvas.id = "test2doc-highlight-canvas"
        canvas.style.cssText = `
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          pointer-events: none !important;
          z-index: 9999 !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        `

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const ctx = canvas.getContext("2d")
        if (ctx) {
          // Draw highlight rectangle
          ctx.strokeStyle = "rgba(246, 255, 0, 0.8)"
          ctx.lineWidth = 2
          ctx.strokeRect(box.x, box.y, box.width, box.height)

          // Add subtle fill
          ctx.fillStyle = "rgba(240, 255, 107, 0.25)"
          ctx.fillRect(box.x, box.y, box.width, box.height)
        }

        document.body.appendChild(canvas)
      }, boundingBox)

      screenshot = await page.screenshot(options)

      // Clean up canvas
      await page.evaluate(() => {
        const canvas = document.getElementById("test2doc-highlight-canvas")
        if (canvas) canvas.remove()
      })
    } else {
      screenshot = await page.screenshot(options)
    }
  } else {
    // Target is already a page
    screenshot = await target.screenshot(options)
  }

  await testInfo.attach(filename, {
    body: screenshot,
    contentType: "image/png",
  })
}
