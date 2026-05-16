import { test, expect } from "@playwright/test"
import { injectMarkdown } from "../src/injectMarkdown.js"

test("injectMarkdown attaches content with correct name, contentType, and body", async ({}, testInfo) => {
  await injectMarkdown(testInfo, "This is injected markdown content")

  expect(testInfo.attachments[0].name).toMatch(/test2doc-markdown-\d+-\d+\.md/)
  expect(testInfo.attachments[0].contentType).toBe("text/markdown")
  expect(testInfo.attachments[0].body?.toString()).toBe(
    "This is injected markdown content",
  )
})

test("injectMarkdown called multiple times produces sequential attachments", async ({}, testInfo) => {
  await injectMarkdown(testInfo, "First injection")
  await injectMarkdown(testInfo, "Second injection")

  expect(testInfo.attachments).toHaveLength(2)
  expect(testInfo.attachments[0].body?.toString()).toBe("First injection")
  expect(testInfo.attachments[1].body?.toString()).toBe("Second injection")
})
