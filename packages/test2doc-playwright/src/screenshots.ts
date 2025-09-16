import type {
  Locator,
  Page,
  PageScreenshotOptions,
  TestInfo,
} from "@playwright/test"

let screenshotCounter = 0

type Position = "above" | "below" | "left" | "right"

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
  position?: Position // Position of the label relative to the element
  showArrow?: boolean // Whether to show an arrow pointing to the element
  arrowStrokeStyle?: string // Color of the arrow
  arrowLineWidth?: number // Width of the arrow line
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
            ctx.strokeStyle =
              annotation?.highlightStrokeStyle ?? "rgba(255, 165, 0, 1)"
            ctx.lineWidth = annotation?.highlightLineWidth ?? 2
            ctx.strokeRect(box.x, box.y, box.width, box.height)

            // Add subtle fill
            ctx.fillStyle =
              annotation?.highlightFillStyle ?? "rgba(255, 165, 0, 0.3)"
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
              const margin = annotation.showArrow ? 24 : 4
              const padding = 4

              const getPosition = (pos?: Position): Position => {
                if (pos) return pos

                // TODO: adding padding/margin to calculations
                if (box.y - window.scrollY > window.innerHeight * 0.6) {
                  return "above"
                } else if (
                  box.y - textHeight < window.scrollY &&
                  box.y + box.height + textHeight >
                    window.innerHeight + window.scrollY
                ) {
                  if (box.x + box.width + textWidth < window.innerWidth) {
                    return "right"
                  } else if (box.x - textWidth > 0) {
                    return "left"
                  }
                }
                return "below"
              }

              const position = getPosition(annotation.position)

              let labelPosition: { x: number; y: number }
              switch (position) {
                case "above":
                  labelPosition = {
                    x: box.x + box.width / 2 - textWidth / 2,
                    y: box.y - textHeight / 2 - padding / 2 - margin,
                  }
                  break
                case "left":
                  labelPosition = {
                    x: box.x - textWidth - padding - margin,
                    y: box.y + box.height / 2 + textHeight / 2,
                  }
                  break
                case "right":
                  labelPosition = {
                    x: box.x + box.width + padding + margin,
                    y: box.y + box.height / 2 + textHeight / 2,
                  }
                  break
                default:
                  labelPosition = {
                    x: box.x + box.width / 2 - textWidth / 2,
                    y: box.y + box.height + textHeight + padding + margin,
                  }
                  break
              }

              // Render arrow if enabled
              if (annotation.showArrow) {
                const arrowLabelEndX =
                  position === "left"
                    ? labelPosition.x + textWidth + padding
                    : position === "right"
                      ? labelPosition.x - padding / 2
                      // top or bottom
                      : labelPosition.x + textWidth / 2
                const arrowLabelEndY =
                  position === "above"
                    ? labelPosition.y + padding / 2
                    : position === "below"
                      ? labelPosition.y - textHeight - padding / 2
                      // left or right
                      : box.y + box.height / 2

                const arrowStartX =
                  position === "left"
                    ? box.x
                    : position === "right"
                      ? box.x + box.width
                      // top or bottom
                      : box.x + box.width / 2
                const arrowStartY =
                  position === "above"
                    ? box.y
                    : position === "below"
                      ? box.y + box.height
                      // left or right
                      : box.y + box.height / 2
                const arrowColor = annotation.arrowStrokeStyle ?? "rgba(255, 0, 0, 1)"

                ctx.strokeStyle = arrowColor
                ctx.lineWidth = annotation.arrowLineWidth ?? 2
                ctx.beginPath()
                ctx.moveTo(arrowLabelEndX, arrowLabelEndY)
                ctx.lineTo(arrowStartX, arrowStartY)
                ctx.stroke()

                // Draw arrowhead
                const angle = Math.atan2(arrowStartY - arrowLabelEndY, arrowStartX - arrowLabelEndX)
                const headLength = (annotation.arrowLineWidth ?? 2) * 5 // Length of the arrowhead
                ctx.fillStyle = arrowColor
                ctx.lineJoin = "round"
                ctx.lineCap = "round"
                ctx.beginPath()
                ctx.moveTo(arrowStartX, arrowStartY)
                ctx.lineTo(
                  arrowStartX - headLength * Math.cos(angle - Math.PI / 6),
                  arrowStartY - headLength * Math.sin(angle - Math.PI / 6),
                )
                ctx.lineTo(
                  arrowStartX - headLength * Math.cos(angle + Math.PI / 6),
                  arrowStartY - headLength * Math.sin(angle + Math.PI / 6),
                )
                ctx.closePath()
                ctx.fill()
                ctx.stroke()

                ctx.resetTransform()
              }

              // Draw label box
              if (
                annotation.labelBoxFillStyle ||
                annotation.labelBoxStrokeStyle
              ) {
                ctx.fillStyle =
                  annotation.labelBoxFillStyle ?? "rgba(0, 0, 0, 0)"
                ctx.strokeStyle =
                  annotation.labelBoxStrokeStyle ?? "rgba(0, 0, 0, 0)"
                ctx.lineWidth = annotation.labelBoxLineWidth ?? 2
                const paddingBothSides = padding * 2
                const labelBoxX = labelPosition.x - padding
                const labelBoxY = labelPosition.y - textHeight + actualBoundingBoxDescent - padding
                const labelBoxWidth = textWidth + paddingBothSides
                const labelBoxHeight = textHeight + paddingBothSides
                ctx.fillRect(
                  labelBoxX,
                  labelBoxY,
                  labelBoxWidth,
                  labelBoxHeight,
                )
                ctx.strokeRect(
                  labelBoxX,
                  labelBoxY,
                  labelBoxWidth,
                  labelBoxHeight,
                )
              }

              // Draw label text
              ctx.strokeStyle = annotation?.strokeStyle ?? "rgba(0, 0, 0, 0.1)"
              ctx.lineWidth = annotation?.lineWidth ?? 2
              ctx.strokeText(annotation.text, labelPosition.x, labelPosition.y)
              ctx.fillStyle = annotation?.fillStyle ?? "rgba(0, 0, 0, 1)"
              ctx.fillText(annotation.text, labelPosition.x, labelPosition.y)
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
