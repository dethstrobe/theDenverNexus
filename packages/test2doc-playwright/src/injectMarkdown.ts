import type { TestInfo } from "@playwright/test"

let markdownCounter = 0

export async function injectMarkdown(
  testInfo: TestInfo,
  content: string,
): Promise<void> {
  await testInfo.attach(
    `test2doc-markdown-${Date.now()}-${++markdownCounter}.md`,
    { body: Buffer.from(content), contentType: "text/markdown" },
  )
}
