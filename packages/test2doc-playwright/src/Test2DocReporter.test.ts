import { describe, it, expect, vi } from "vitest"
import Test2DocReporter from "./index.js"
import type {
  FullProject,
  Suite,
  TestCase,
  TestResult,
  TestStep,
} from "@playwright/test/reporter"
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
      ok: (): boolean => {
        throw new Error("Function not implemented.")
      },
      outcome: (): "skipped" | "expected" | "unexpected" | "flaky" => {
        throw new Error("Function not implemented.")
      },
      titlePath: (): Array<string> => {
        throw new Error("Function not implemented.")
      },
      annotations: [],
      expectedStatus: "passed",
      id: "",
      parent: {
        allTests: (): Array<TestCase> => {
          throw new Error("Function not implemented.")
        },
        entries: (): Array<TestCase | Suite> => {
          throw new Error("Function not implemented.")
        },
        project: (): FullProject | undefined => {
          throw new Error("Function not implemented.")
        },
        titlePath: (): Array<string> => {
          throw new Error("Function not implemented.")
        },
        suites: [],
        tests: [],
        title: "",
        type: "root",
      },
      repeatEachIndex: 0,
      results: [],
      retries: 0,
      tags: [],
      timeout: 0,
      type: "test",
    }

    const mockStep: TestStep = {
      title: "Given user is on login page",
      category: "test.step",
      titlePath: (): Array<string> => {
        throw new Error("Function not implemented.")
      },
      annotations: [],
      attachments: [],
      duration: 0,
      startTime: new Date(),
      steps: [],
    }

    reporter.onTestBegin(mockTest)
    reporter.onStepBegin(mockTest, {} as TestResult, mockStep)
    reporter.onEnd()

    expect(writeFileSync).toHaveBeenCalledWith(
      "test-output/login-test.md",
      `# login test

- Given user is on login page
`,
    )
  })
})
