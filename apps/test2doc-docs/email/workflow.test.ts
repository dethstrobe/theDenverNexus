import { mkdirSync, rmSync, unlinkSync, writeFileSync } from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

// spies we will assert against
const mockCreate = vi.fn().mockResolvedValue({ id: "ok" })
class mockMailgun {
  client() {
    return {
      messages: {
        create: mockCreate,
      },
    }
  }
}
// ensure the module is mocked BEFORE the tested module is imported
vi.mock("mailgun.js", () => ({
  default: mockMailgun,
  __esModule: true,
}))

const mockMarkdown = `---
title: Test Blog Post
slug: test-blog-post
---
# Test Header

Test content for the blog post.
`

const date = new Date()
const year = date.getFullYear() + 1
const month = String(date.getMonth() + 1).padStart(2, "0")
const day = String(date.getDate()).padStart(2, "0")
const blogPostFilename = `${year}-${month}-${day}-test-blog-post`
const blogPath = path.join(process.cwd(), "blog", blogPostFilename)

describe("newsletter workflow", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.MAILGUN_API_KEY = "test-key"
    process.env.MAILGUN_DOMAIN = "example.com"
  })

  afterEach(() => {
    delete process.env.MAILGUN_API_KEY
    delete process.env.MAILGUN_DOMAIN
  })

  describe("markdown file", () => {
    const blogPathMarkdown = `${blogPath}.md`
    beforeEach(() => {
      // ensure blog directory exists
      writeFileSync(blogPathMarkdown, mockMarkdown)
    })
    afterEach(() => {
      unlinkSync(blogPathMarkdown)
    })

    test("sending newsletter from latest blog post markdown using mailgun", async () => {
      const { newsletterWorkflow } = await import("./workflow.mjs")
      await newsletterWorkflow()

      const [domain, payload] = mockCreate.mock.calls[0]

      expect(domain).toBe("example.com")
      expect(payload).toMatchObject({
        from: "Test2Doc Newsletter <newsletter@example.com>",
        to: ["newsletter@example.com"],
        subject: "Test2Doc: Test Blog Post",
      })

      expect(payload.html).toContain("Test Header")
      expect(payload.html).toContain("Test content for the blog post.")
    })
  })

  describe("index.md in blog post directory", () => {
    beforeEach(() => {
      mkdirSync(blogPath, { recursive: true })
      writeFileSync(path.join(blogPath, "index.md"), mockMarkdown)
    })
    afterEach(() => {
      rmSync(blogPath, { recursive: true, force: true })
    })

    test("sending newsletter from latest blog post index.md using mailgun", async () => {
      const { newsletterWorkflow } = await import("./workflow.mjs")
      await newsletterWorkflow()

      const [domain, payload] = mockCreate.mock.calls[0]

      expect(domain).toBe("example.com")
      expect(payload).toMatchObject({
        from: "Test2Doc Newsletter <newsletter@example.com>",
        to: ["newsletter@example.com"],
        subject: "Test2Doc: Test Blog Post",
      })

      expect(payload.html).toContain("Test Header")
      expect(payload.html).toContain("Test content for the blog post.")
    })
  })
})
