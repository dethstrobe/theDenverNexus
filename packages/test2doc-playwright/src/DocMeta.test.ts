import { test, expect, describe, vi } from "vitest"

describe("withDocMeta", () => {
  test("returns title without config data if test2doc is not enabled", async () => {
    const { withDocMeta } = await import("./DocMeta.js")
    const title = withDocMeta("My Test Title", { title: "My Test Title" })
    expect(title).toBe("My Test Title")
  })

  test("returns title with config data if test2doc is enabled", async () => {
    const { activateTest2Doc, withDocMeta } = await import("./DocMeta.js")
    activateTest2Doc()
    const title = withDocMeta("My Test Title", { title: "My Test Title" })
    expect(title).toBe('My Test Title[test2doc_page]:{"title":"My Test Title"}')
  })

  test("returns title with config data when test2doc flag is provided on the command line", async () => {
    vi.resetModules()
    const originalEnv = { ...process.env }
    process.env.TEST2DOC = "true"

    const { withDocMeta } = await import("./DocMeta.js")
    const title = withDocMeta("My Test Title", {
      title: "My Test Title",
    })
    expect(title).toBe('My Test Title[test2doc_page]:{"title":"My Test Title"}')

    process.env = originalEnv
  })
})

describe("withDocCategory", () => {
  test("returns title without category metadata when test2doc is not active", async () => {
    vi.resetModules()
    const { withDocCategory } = await import("./DocMeta.js")
    const title = withDocCategory("My Category", {
      label: "My Label",
      link: { type: "generated-index", title: "Index" },
    })
    expect(title).toBe("My Category")
  })

  test("returns title with category metadata when test2doc is active", async () => {
    const { activateTest2Doc, withDocCategory } = await import("./DocMeta.js")
    activateTest2Doc()
    const title = withDocCategory("My Category", {
      label: "My Label",
      link: { type: "generated-index", title: "Index" },
    })
    expect(title).toBe(
      'My Category[test2doc_category]:{"label":"My Label","link":{"type":"generated-index","title":"Index"}}',
    )
  })
})
