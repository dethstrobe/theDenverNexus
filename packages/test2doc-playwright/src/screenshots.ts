import type {
  Locator,
  Page,
  PageScreenshotOptions,
  TestInfo,
} from "@playwright/test"

let screenshotCounter = 0

type Position = "above" | "below" | "left" | "right" | number

export interface AnnotationOptions {
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

interface MultiLocatorScreenshot {
  target: Locator
  options?: ScreenshotOptions
}

export const screenshot = async (
  testInfo: TestInfo,
  target: Page | Locator | MultiLocatorScreenshot[],
  { annotation: overrideAnnotations, ...options }: ScreenshotOptions = {},
) => {
  const annotation: AnnotationOptions = {
    ...(testInfo.project?.use?.test2doc?.annotationDefaults ?? {}),
    ...overrideAnnotations,
  }

  const filename = `test2doc-${Date.now()}-${++screenshotCounter}.png`

  const screenshotBuffer: Buffer =
    "highlight" in target || Array.isArray(target)
      ? await generateScreenshotBuffer(
          Array.isArray(target) ? target : [{ target }],
          options,
          annotation,
        )
      : await target.screenshot(options)

  await testInfo.attach(filename, {
    body: screenshotBuffer,
    contentType: "image/png",
  })
}

async function generateScreenshotBuffer(
  targets: MultiLocatorScreenshot[],
  options: ScreenshotOptions,
  annotation: AnnotationOptions,
): Promise<Buffer> {
  const firstTarget = targets.at(0)?.target
  if (!firstTarget) throw new Error("No targets provided for screenshot")

  const page = firstTarget.page()
  await firstTarget.scrollIntoViewIfNeeded()

  const boundingBoxes = await Promise.all(
    targets.map(({ target }) => target.boundingBox()),
  )
  const annotations = targets.map(({ options }) => ({
    ...annotation,
    ...options?.annotation,
  }))

  if (boundingBoxes) {
    await page.evaluate(
      ({ boundingBoxes: boxes, annotations }) => {
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
          for (const [index, box] of boxes.entries()) {
            if (!box) continue
            const annotation = annotations[index]
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
              const centerBox = {
                x: box.x + box.width / 2,
                y: box.y + box.height / 2,
              }

              const getPosition = (pos?: Position): Position => {
                if (pos) return pos

                // Calculate angle from box center to screen center
                const screenCenterX = window.innerWidth / 2
                const screenCenterY = window.innerHeight / 2

                // Calculate angle from box to screen center
                const dx = screenCenterX - centerBox.x
                const dy = screenCenterY - centerBox.y

                // Convert to angle in degrees (0° = right, 90° = down, etc.)
                let angle = Math.atan2(dy, dx) * (180 / Math.PI)

                // Normalize to 0-360 range
                if (angle < 0) angle += 360

                // Convert from math convention (0° = right) to clock convention (0° = top)
                // and return the angle directly
                return (angle + 90) % 360
              }

              const toDegree = (pos?: Position): number => {
                if (typeof pos === "number") {
                  // Convert clock convention (0° = top) to math convention (0° = right)
                  return (pos + 270) % 360
                }
                switch (pos) {
                  case "above":
                    return 270
                  case "right":
                    return 0
                  case "below":
                    return 90
                  case "left":
                    return 180
                  default:
                    return 90
                }
              }

              const position = toDegree(getPosition(annotation.position))

              function getLabelPosition(
                box: { x: number; y: number; width: number; height: number },
                degree: number,
              ) {
                const radians = (degree * Math.PI) / 180
                const sinT = Math.sin(radians)
                const cosT = Math.cos(radians)

                // Choose target lines
                const yTop = box.y - (margin + padding) - textHeight / 2
                const yBottom =
                  box.y + box.height + (margin + padding) + textHeight / 2
                const xLeft = box.x - textWidth / 2 - margin - padding
                const xRight =
                  box.x + box.width + textWidth / 2 + margin + padding

                // Handle vertical rays (90° and 270°)
                if (Math.abs(cosT) < 1e-6) {
                  const yTarget = sinT > 0 ? yBottom : yTop
                  return { x: centerBox.x, y: yTarget }
                }

                // Handle horizontal rays (0° and 180°)
                if (Math.abs(sinT) < 1e-6) {
                  const xTarget = cosT > 0 ? xRight : xLeft
                  return { x: xTarget, y: centerBox.y }
                }

                // For diagonal rays, intersect with horizontal line
                const yTarget = sinT < 0 ? yTop : yBottom
                const r = (yTarget - centerBox.y) / sinT
                let x = centerBox.x + r * cosT

                // If x goes out of bounds, intersect with vertical line instead
                if (x < xLeft) {
                  x = xLeft
                  const r2 = (x - centerBox.x) / cosT
                  const y = centerBox.y + r2 * sinT
                  return { x, y }
                }
                if (x > xRight) {
                  x = xRight
                  const r2 = (x - centerBox.x) / cosT
                  const y = centerBox.y + r2 * sinT
                  return { x, y }
                }

                return { x, y: yTarget }
              }

              const labelPosition: { x: number; y: number } = getLabelPosition(
                box,
                position,
              )

              // Render arrow if enabled
              if (annotation.showArrow) {
                const arrowColor =
                  annotation.arrowStrokeStyle ?? "rgba(255, 0, 0, 1)"

                // Calculate the angle from label center to box center
                const dx = centerBox.x - labelPosition.x
                const dy = centerBox.y - labelPosition.y
                const angle = Math.atan2(dy, dx)

                // Calculate label box dimensions and position
                const labelBoxX = labelPosition.x - textWidth / 2 - padding
                const labelBoxY = labelPosition.y - textHeight / 2 - padding
                const labelBoxWidth = textWidth + padding * 2
                const labelBoxHeight = textHeight + padding * 2

                // Function to find intersection of ray with rectangle
                function getRayRectIntersection(
                  rayX: number,
                  rayY: number, // Ray origin
                  rayDx: number,
                  rayDy: number, // Ray direction (normalized)
                  rectX: number,
                  rectY: number, // Rectangle position
                  rectW: number,
                  rectH: number, // Rectangle size
                ) {
                  const candidates = []

                  // Check intersection with each side of the rectangle
                  // Left side
                  if (rayDx !== 0) {
                    const t = (rectX - rayX) / rayDx
                    const y = rayY + t * rayDy
                    if (t > 0 && y >= rectY && y <= rectY + rectH) {
                      candidates.push({ x: rectX, y, t })
                    }
                  }

                  // Right side
                  if (rayDx !== 0) {
                    const t = (rectX + rectW - rayX) / rayDx
                    const y = rayY + t * rayDy
                    if (t > 0 && y >= rectY && y <= rectY + rectH) {
                      candidates.push({ x: rectX + rectW, y, t })
                    }
                  }

                  // Top side
                  if (rayDy !== 0) {
                    const t = (rectY - rayY) / rayDy
                    const x = rayX + t * rayDx
                    if (t > 0 && x >= rectX && x <= rectX + rectW) {
                      candidates.push({ x, y: rectY, t })
                    }
                  }

                  // Bottom side
                  if (rayDy !== 0) {
                    const t = (rectY + rectH - rayY) / rayDy
                    const x = rayX + t * rayDx
                    if (t > 0 && x >= rectX && x <= rectX + rectW) {
                      candidates.push({ x, y: rectY + rectH, t })
                    }
                  }

                  // Return the closest intersection
                  if (candidates.length === 0) return null
                  const closest = candidates.reduce((min, curr) =>
                    curr.t < min.t ? curr : min,
                  )
                  return { x: closest.x, y: closest.y }
                }

                // Calculate arrow start (edge of label box)
                const rayDx = Math.cos(angle)
                const rayDy = Math.sin(angle)

                const arrowStart = getRayRectIntersection(
                  labelPosition.x,
                  labelPosition.y, // From label center
                  rayDx,
                  rayDy, // Towards box center
                  labelBoxX,
                  labelBoxY,
                  labelBoxWidth,
                  labelBoxHeight,
                )

                // Calculate arrow end (edge of highlight box)
                const arrowEnd = getRayRectIntersection(
                  centerBox.x,
                  centerBox.y, // From box center
                  -rayDx,
                  -rayDy, // Towards label center (opposite direction)
                  box.x,
                  box.y,
                  box.width,
                  box.height,
                )

                if (arrowStart && arrowEnd) {
                  // Draw the arrow line
                  ctx.strokeStyle = arrowColor
                  ctx.lineWidth = annotation.arrowLineWidth ?? 2
                  ctx.beginPath()
                  ctx.moveTo(arrowStart.x, arrowStart.y)
                  ctx.lineTo(arrowEnd.x, arrowEnd.y)
                  ctx.stroke()

                  // Draw arrowhead at the highlight box edge
                  const headLength = (annotation.arrowLineWidth ?? 2) * 5
                  ctx.fillStyle = arrowColor
                  ctx.lineJoin = "round"
                  ctx.lineCap = "round"
                  ctx.beginPath()
                  ctx.moveTo(arrowEnd.x, arrowEnd.y)
                  ctx.lineTo(
                    arrowEnd.x - headLength * Math.cos(angle - Math.PI / 6),
                    arrowEnd.y - headLength * Math.sin(angle - Math.PI / 6),
                  )
                  ctx.lineTo(
                    arrowEnd.x - headLength * Math.cos(angle + Math.PI / 6),
                    arrowEnd.y - headLength * Math.sin(angle + Math.PI / 6),
                  )
                  ctx.closePath()
                  ctx.fill()
                  ctx.stroke()
                }

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
                const labelBoxX = labelPosition.x - textWidth / 2 - padding
                const labelBoxY =
                  labelPosition.y -
                  textHeight / 2 +
                  actualBoundingBoxDescent -
                  padding
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
              const labelX = labelPosition.x - textWidth / 2
              const labelY =
                labelPosition.y + textHeight / 2 + actualBoundingBoxDescent

              // Draw label text
              ctx.strokeStyle = annotation?.strokeStyle ?? "rgba(0, 0, 0, 0.1)"
              ctx.lineWidth = annotation?.lineWidth ?? 2
              ctx.strokeText(annotation.text, labelX, labelY)
              ctx.fillStyle = annotation?.fillStyle ?? "rgba(0, 0, 0, 1)"
              ctx.fillText(annotation.text, labelX, labelY)
            }
          }
        }

        document.body.appendChild(canvas)
      },
      { boundingBoxes, annotations },
    )

    const screenshotBuffer = await page.screenshot(options)

    // Clean up canvas
    await page.evaluate(() => {
      const canvas = document.getElementById("test2doc-highlight-canvas")
      if (canvas) canvas.remove()
    })

    return screenshotBuffer
  }

  return await page.screenshot(options)
}
