import { test, expect, describe, vi } from "vitest"

describe("withDocMeta", () => {
  test("returns title without config data if test2doc is not enabled", async () => {
    const { withDocMeta } = await import("./DocHeader.js")
    const title = withDocMeta("My Test Title", { title: "My Test Title" })
    expect(title).toBe("My Test Title")
  })

  test("returns title with config data if test2doc is enabled", async () => {
    const { activateTest2Doc, withDocMeta } = await import("./DocHeader.js")
    activateTest2Doc()
    const title = withDocMeta("My Test Title", { title: "My Test Title" })
    expect(title).toBe('My Test Title{"title":"My Test Title"}')
  })

  test("returns title with config data when --test2doc flag is provided on the command line", async () => {
    vi.resetModules()
    const originalArgv = [...process.argv]
    process.argv.push("--test2doc")

    const { withDocMeta } = await import("./DocHeader.js")
    const title = withDocMeta("My Test Title", {
      title: "My Test Title",
    })
    expect(title).toBe('My Test Title{"title":"My Test Title"}')

    process.argv = originalArgv
  })
})
