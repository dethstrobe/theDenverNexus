import { describe, expect, test } from "vitest"
import { createDocusaurusPageAnnotation } from "./DocHeader.js"

describe("DocHeader", () => {
  test("should generate documentation header", () => {
    const config = {
      title: "Test Title",
      description: "This is a test description.",
      tags: ["tag1", "tag2"],
    }
    const annotation = createDocusaurusPageAnnotation(config)

    expect(annotation).toEqual({
      type: "test2doc-docusaurus-header",
      description: JSON.stringify(config),
    })
  })
})
