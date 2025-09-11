import { test, expect, Page } from "@playwright/test"
import { screenshot } from "../src/screenshots.js"
import { writeFileSync, readFileSync, existsSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const setup = async (page: Page) => {
  return page.setContent(`
      <html>
        <body style="margin: 0; padding: 20px; background: white;">
          <button id="test-button" style="padding: 10px 20px; background: blue; color: white; display: block;">
            Click Me
          </button>

          <button id="another-button" style="margin-top: 110vh; padding: 10px 20px; background: green; color: white; display: block;">
            Below the fold Button
          </button>
        </body>
      </html>
    `)
}

test("screenshot of a page", async ({ page }, testInfo) => {
  await setup(page)

  await screenshot(testInfo, page)

  const screenshotAttachment = testInfo.attachments.pop()

  const expectedPath = join(
    __dirname,
    "expected-screenshots",
    "page-screenshot.png",
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
})

test("screenshot highlighting an element with label", async ({
  page,
}, testInfo) => {
  await setup(page)

  const button = page.getByRole("button", { name: "Click Me" })
  await screenshot(testInfo, button)

  const screenshotAttachment = testInfo.attachments.pop()

  const expectedPath = join(
    __dirname,
    "expected-screenshots",
    "element-screenshot.png",
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
})

test("screenshot of element off the screen should be scrolled into view", async ({
  page,
}, testInfo) => {
  await setup(page)

  const button = page.getByRole("button", { name: "Below the fold Button" })
  await screenshot(testInfo, button)

  const screenshotAttachment = testInfo.attachments.pop()

  const expectedPath = join(
    __dirname,
    "expected-screenshots",
    "element-off-screen-screenshot.png",
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
})

test("screenshot highlighting an element with label text", async ({
  page,
}, testInfo) => {
  await setup(page)

  const button = page.getByRole("button", { name: "Click Me" })
  await screenshot(testInfo, button, { label: { text: "Test Button" } })

  const screenshotAttachment = testInfo.attachments.pop()

  const expectedPath = join(
    __dirname,
    "expected-screenshots",
    "element-screenshot-with-label.png",
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
})
