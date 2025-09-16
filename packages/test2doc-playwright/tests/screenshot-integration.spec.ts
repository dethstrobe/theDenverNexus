import { test, expect, type Page, type TestInfo } from "@playwright/test"
import { screenshot } from "../src/screenshots.js"
import { writeFileSync, readFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { dirname } from "node:path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const setup = async (page: Page) => {
  return page.setContent(`
      <html>
        <body style="margin: 0; padding: 20px; background: white;">
          <button id="test-button" style="margin: auto; margin-top: 25%; background: blue; color: white; display: block;">
            Click Me
          </button>

          <button id="another-button" style="margin-top: 110vh; padding: 10px 20px; background: green; color: white; display: block;">
            Below the fold Button
          </button>
        </body>
      </html>
    `)
}

const expectScreenshotToMatch = (
  testInfo: TestInfo,
  screenshotFileName: string,
) => {
  const screenshotAttachment = testInfo.attachments.pop()

  const expectedPath = join(
    __dirname,
    "expected-screenshots",
    screenshotFileName,
  )

  if (existsSync(expectedPath)) {
    const expectedBuffer = readFileSync(expectedPath)
    expect(screenshotAttachment?.body).toEqual(expectedBuffer)
  } else {
    writeFileSync(expectedPath, screenshotAttachment?.body ?? Buffer.from(""))
    console.warn(
      `Expected screenshot did not exist. Created at ${expectedPath}. Please verify it is correct.`,
    )
  }
}

test("screenshot of a page", async ({ page }, testInfo) => {
  await setup(page)

  await screenshot(testInfo, page)

  expectScreenshotToMatch(testInfo, "screenshot-page.png")
})

test("screenshot highlighting an element", async ({ page }, testInfo) => {
  await setup(page)

  const button = page.getByRole("button", { name: "Click Me" })
  await screenshot(testInfo, button)

  expectScreenshotToMatch(testInfo, "highlight-element.png")
})

test("screenshot of element off the screen should be scrolled into view", async ({
  page,
}, testInfo) => {
  await setup(page)

  const button = page.getByRole("button", { name: "Below the fold Button" })
  await screenshot(testInfo, button)

  expectScreenshotToMatch(testInfo, "element-off-screen.png")
})

test("screenshot highlighting an element with label text", async ({
  page,
}, testInfo) => {
  await setup(page)

  const button = page.getByRole("button", { name: "Click Me" })
  await screenshot(testInfo, button, { annotation: { text: "Test Button" } })

  expectScreenshotToMatch(testInfo, "highlighting-element-label.png")
})

test("screenshot style the rendering of the highlight and label", async ({
  page,
}, testInfo) => {
  await setup(page)

  const button = page.getByRole("button", { name: "Click Me" })
  await screenshot(testInfo, button, {
    annotation: {
      text: "This is the test button",
      fillStyle: "white",
      font: "14px Comic Sans MS",
      strokeStyle: "#000000AA",
      lineWidth: 4,
      labelBoxFillStyle: "hsla(170, 45%, 45%, 0.5)",
      labelBoxStrokeStyle: "#0f0",
      labelBoxLineWidth: 2,
      highlightFillStyle: "rgba(255, 165, 0, 0.3)",
      highlightStrokeStyle: "#FFA500",
      highlightLineWidth: 2,
    },
  })

  expectScreenshotToMatch(testInfo, "style-highlight-label.png")
})

test("screenshot label positioning", async ({ page }, testInfo) => {
  await setup(page)

  const button = page.getByRole("button", { name: "Click Me" })
  await screenshot(testInfo, button, {
    annotation: { text: "Test Button", position: "above" },
  })

  expectScreenshotToMatch(testInfo, "label-position-above.png")

  await screenshot(testInfo, button, {
    annotation: { text: "Test Button", position: "below" },
  })

  expectScreenshotToMatch(testInfo, "label-position-below.png")

  await screenshot(testInfo, button, {
    annotation: { text: "Test Button", position: "left" },
  })

  expectScreenshotToMatch(testInfo, "label-position-left.png")

  await screenshot(testInfo, button, {
    annotation: { text: "Test Button", position: "right" },
  })

  expectScreenshotToMatch(testInfo, "label-position-right.png")
})

test("positioning label intelligently when no position is specified", async ({
  page,
}, testInfo) => {
  await page.setContent(`
      <html>
        <body style="margin: 0; padding: 0; background: white; height: 100vh; box-sizing: border-box; position: relative;">
          <button id="top-left-button" style="position: absolute; top: 0; left: 0; background: blue; color: white; display: block;">
            Top Left Button
          </button>

          <button id="top-right-button" style="position: absolute; top: 0; right: 0; background: blue; color: white; display: block;">
            Top Right Button
          </button>

          <section aria-label="left side" style="position: relative; height: 100%; width: 50%; border: 2px solid black; box-sizing: border-box; float: left; text-align: center;">
            left side
          </section>

          <button id="middle-button" style="position: absolute; top: 50%; left: 50%; transform: translateX(-50%); background: orange; color: white; display: block;">
            Middle Button
          </button>

          <section aria-label="right side" style="position: relative; height: 100%; width: 50%; border: 2px solid black; box-sizing: border-box; float: right; text-align: center;">
            right side
          </section>

          <button id="bottom-left-button" style="position: absolute; bottom: 0; left: 0; background: green; color: white; display: block;">
            Bottom Left Button
          </button>

          <button id="bottom-right-button" style="position: absolute; bottom: 0; right: 0; background: green; color: white; display: block;">
            Bottom Right Button
          </button>
        </body>
      </html>
    `)
  const topLeftButton = page.getByRole("region", { name: "left side" })
  await screenshot(testInfo, topLeftButton, {
    annotation: { text: "Label on the right side" },
  })
  expectScreenshotToMatch(testInfo, "auto-position-right.png")

  const topRightButton = page.getByRole("region", { name: "right side" })
  await screenshot(testInfo, topRightButton, {
    annotation: { text: "Label on the left side" },
  })
  expectScreenshotToMatch(testInfo, "auto-position-left.png")

  const middleButton = page.getByRole("button", { name: "Middle Button" })
  await screenshot(testInfo, middleButton, {
    annotation: { text: "Label on the bottom side" },
  })
  expectScreenshotToMatch(testInfo, "auto-position-bottom.png")

  const bottomLeftButton = page.getByRole("button", {
    name: "Bottom Left Button",
  })
  await screenshot(testInfo, bottomLeftButton, {
    annotation: { text: "Label on the top side" },
  })
  expectScreenshotToMatch(testInfo, "auto-position-top.png")
})

test("screenshot with arrow pointing to the element", async ({
  page,
}, testInfo) => {
  await setup(page)

  const button = page.getByRole("button", { name: "Click Me" })
  await screenshot(testInfo, button, {
    annotation: { text: "Test Button", position: "above", showArrow: true },
  })

  expectScreenshotToMatch(testInfo, "arrow-position-above.png")

  await screenshot(testInfo, button, {
    annotation: {
      text: "Test Button",
      fillStyle: "white",
      position: "below",
      showArrow: true,
      arrowLineWidth: 1,
      arrowStrokeStyle: "purple",
      labelBoxFillStyle: "purple",
    },
  })

  expectScreenshotToMatch(testInfo, "arrow-position-below.png")

  await screenshot(testInfo, button, {
    annotation: {
      text: "Test Button",
      position: "left",
      showArrow: true,
      arrowStrokeStyle: "rgba(255, 0, 0, 0.5)",
      labelBoxStrokeStyle: "rgba(255, 0, 0, 0.5)",
      labelBoxLineWidth: 3,
    },
  })

  expectScreenshotToMatch(testInfo, "arrow-position-left.png")

  await screenshot(testInfo, button, {
    annotation: {
      text: "Test Button",
      position: "right",
      showArrow: true,
      arrowLineWidth: 4,
    },
  })

  expectScreenshotToMatch(testInfo, "arrow-position-right.png")
})
