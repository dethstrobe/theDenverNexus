import type {
  Locator,
  Page,
  PageScreenshotOptions,
  TestInfo,
} from "@playwright/test"

let screenshotCounter = 0

interface AnnotationOptions {
  text?: string // Text to display for label
  fillStyle?: string // Label text color
  font?: string // Font size and family
  strokeStyle?: string // Label outline color
  lineWidth?: number // Label outline width
  labelBoxFillStyle?: string // Label background color
  labelBoxStrokeStyle?: string // Label border color
  labelBoxLineWidth?: number // Label border width
  highlightFillStyle?: string // Highlight background
  highlightStrokeStyle?: string // Highlight border
  highlightLineWidth?: number // Highlight border width
  // position?: "above" | "below" | "left" | "right"
}

interface ScreenshotOptions extends PageScreenshotOptions {
  annotation?: AnnotationOptions
}

export const screenshot = async (
  testInfo: TestInfo,
  target: Page | Locator,
  { annotation, ...options }: ScreenshotOptions = {},
) => {
  const filename = `test2doc-${Date.now()}-${++screenshotCounter}.png`

  let screenshot: Buffer
  if ("highlight" in target) {
    const page = target.page()

    await target.scrollIntoViewIfNeeded()

    const boundingBox = await target.boundingBox()
    if (boundingBox) {
      await page.evaluate(
        ({ boundingBox: box, annotation }) => {
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
            ctx.strokeStyle = annotation?.highlightStrokeStyle ?? "rgba(255, 165, 0, 1)"
            ctx.lineWidth = annotation?.highlightLineWidth ?? 2
            ctx.strokeRect(box.x, box.y, box.width, box.height)

            // Add subtle fill
            ctx.fillStyle = annotation?.highlightFillStyle ?? "rgba(255, 165, 0, 0.3)"
            ctx.fillRect(box.x, box.y, box.width, box.height)

            if (annotation?.text) {
              ctx.font = annotation?.font ?? "14px Arial"
              const {
                width: textWidth,
                actualBoundingBoxAscent,
                actualBoundingBoxDescent,
              } = ctx.measureText(annotation.text)
              const textHeight =
                actualBoundingBoxAscent + actualBoundingBoxDescent
              const centerX = box.x + box.width / 2 - textWidth / 2
              const centerY = box.y + box.height + 20
              const padding = 4
              if( annotation.labelBoxFillStyle || annotation.labelBoxStrokeStyle ) {
                ctx.fillStyle = annotation.labelBoxFillStyle ?? "rgba(0, 0, 0, 0)"
                ctx.strokeStyle = annotation.labelBoxStrokeStyle ?? "rgba(0, 0, 0, 0)"
                ctx.lineWidth = annotation.labelBoxLineWidth ?? 2
                ctx.fillRect(
                  centerX - padding,
                  centerY - textHeight - padding,
                  textWidth + padding * 2,
                  textHeight + padding * 2,
                )
              }

              ctx.strokeStyle = annotation?.strokeStyle ?? "rgba(0, 0, 0, 0.1)"
              ctx.lineWidth = annotation?.lineWidth ?? 2
              ctx.strokeText(annotation.text, centerX, centerY)
              ctx.fillStyle = annotation?.fillStyle ?? "rgba(0, 0, 0, 1)"
              ctx.fillText(annotation.text, centerX, centerY)
            }
          }

          document.body.appendChild(canvas)
        },
        { boundingBox, annotation },
      )

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
