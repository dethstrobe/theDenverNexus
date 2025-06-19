import { describe, it, expect, vi } from "vitest"
import Test2DocReporter from "./index.js"
import type { TestCase, TestResult, TestStep } from "@playwright/test/reporter"
import { writeFileSync } from "node:fs"

describe("Test2DocReporter", () => {
  const setup = () => {
    return new Test2DocReporter({ outputDir: "test-output" })
  }

  it("should capture test steps", () => {
    vi.mock("node:fs", () => ({
      writeFileSync: vi.fn(),
    }))
    const reporter = setup()
    const mockTest: TestCase = {
      title: "login test",
      location: { file: "", line: 0, column: 0 },
    } as TestCase

    const mockStep: TestStep = {
      title: "Given user is on login page",
      category: "test.step",
    } as TestStep

    reporter.onTestBegin(mockTest)
    reporter.onStepBegin(mockTest, {} as TestResult, mockStep)
    reporter.onEnd()

    expect(writeFileSync).toHaveBeenCalledWith(
      "test-output/login test.md",
      `# login test

- Given user is on login page
`,
    )
  })
})
