import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import Test2DocReporter from "./index.js"
import type {
  FullConfig,
  FullProject,
  Suite,
  TestCase,
  TestResult,
  TestStep,
} from "@playwright/test/reporter"
import {
  mkdtempSync,
  readdirSync,
  statSync,
  unlinkSync,
  readFileSync,
  rmdirSync,
  writeFileSync,
} from "node:fs"
import { join } from "node:path"
import { tmpdir } from "node:os"
import { withDocCategory, withDocMeta } from "./DocMeta.js"

const tempDir = mkdtempSync(join(tmpdir(), "test2doc-"))

const baseSuite: Suite = {
  title: "",
  suites: [],
  tests: [],
  location: { file: "", line: 0, column: 0 },
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
  type: "root",
}

const baseTestCase: TestCase = {
  title: "base",
  location: { file: "", line: 0, column: 0 },
  ok: (): boolean => {
    throw new Error("Function not implemented.")
  },
  outcome: (): "skipped" | "expected" | "unexpected" | "flaky" => {
    throw new Error("Function not implemented.")
  },
  titlePath: (): Array<string> => [
    "Root Suite",
    "Parent Describe",
    "Child Describe",
    "login test",
  ],
  annotations: [],
  expectedStatus: "passed",
  id: "",
  parent: baseSuite, // this is just mocked out
  repeatEachIndex: 0,
  results: [],
  retries: 0,
  tags: [],
  timeout: 0,
  type: "test",
}

const mockTestSuccess: TestCase = {
  ...baseTestCase,
  title: "should redirect to dashboard on successful login",
}

const mockTestFail: TestCase = {
  ...baseTestCase,
  title: "should display error message on failed login",
}

const mockSuiteForPages: Suite = {
  ...baseSuite,
  title: "", // Root Suite
  type: "root",
  suites: [
    {
      ...baseSuite,
      title: "chromium", // or firefox, webkit, etc.
      type: "project",
      suites: [
        {
          ...baseSuite,
          title: "login.test.ts", // Test file name
          type: "file",
          suites: [
            {
              ...baseSuite,
              title: withDocMeta("Login Page", {
                title: "Login Page Documentation",
                keywords: ["login", "password", "username"],
                description:
                  "The different login scenarios for the login page.",
                sidebar_position: 1,
                parse_number_prefixes: true,
              }), // First Describe Block in the test file
              type: "describe",
              suites: [
                {
                  ...baseSuite,
                  title: "Successful Login",
                  tests: [mockTestSuccess],
                },
                {
                  ...baseSuite,
                  title: "Failed Login",
                  tests: [mockTestFail],
                },
              ],
            },
          ],
        },
        {
          ...baseSuite,
          title: "dashboard.test.ts", // Test file name
          type: "file",
          suites: [
            {
              ...baseSuite,
              title: withDocMeta("Dashboard Page", {
                title: "Dashboard Documentation",
                description: "The dashboard of todo stuff.",
                sidebar_position: 2,
              }), // First Describe Block in the test file
              type: "describe",
              suites: [
                {
                  ...baseSuite,
                  title: "Logged In User",
                  tests: [
                    {
                      ...baseTestCase,
                      title: "should display a list of todos",
                    },
                  ],
                },
                {
                  ...baseSuite,
                  title: "Logged Out User",
                  tests: [
                    {
                      ...baseTestCase,
                      title: "should redirect to login page",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const mockSuiteForCategories: Suite = {
  ...baseSuite,
  title: "", // Root Suite
  type: "root",
  suites: [
    {
      ...baseSuite,
      title: "chromium", // or firefox, webkit, etc.
      type: "project",
      suites: [
        {
          ...baseSuite,
          title: "login.test.ts", // Test file name
          type: "file",
          suites: [
            {
              ...baseSuite,
              title: withDocCategory("Login Page", {
                label: "Login Page Documentation Label",
                position: 1,
                className: "login-page",
                link: {
                  type: "generated-index",
                  title: "Login Page Documentation Title",
                  description:
                    "The different login scenarios for the login page.",
                  slug: "login-page",
                },
              }),
              suites: [
                {
                  ...baseSuite,
                  title: withDocMeta("Successful Login", {
                    sidebar_position: 1,
                  }),
                  tests: [mockTestSuccess],
                },
                {
                  ...baseSuite,
                  title: "Failed Login",
                  tests: [mockTestFail],
                },
              ],
              type: "describe",
            },
          ],
        },
      ],
    },
  ],
}

const baseTestStep: TestStep = {
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

const mockStep: TestStep = {
  ...baseTestStep,
  title: "Given user is on login page",
}

describe("Test2DocReporter", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
    // Clean up the temporary directory
    testCleanup()
  })

  function testCleanup(dir = tempDir) {
    readdirSync(dir).forEach((file) => {
      const filePath = join(dir, file)
      if (statSync(filePath).isFile()) {
        unlinkSync(filePath)
      } else if (statSync(filePath).isDirectory()) {
        // If it's a directory, we can remove it recursively if needed
        testCleanup(filePath)
        if (readdirSync(filePath).length === 0) {
          rmdirSync(filePath)
        }
      }
    })
  }

  const setup = () => {
    return new Test2DocReporter({ outputDir: tempDir })
  }

  // TODO: remove this later
  describe("withDocMeta", () => {
    it("loading the reporter file should enable the withDocMeta JSON stringify for Docusaurus Page Header Data", () => {
      expect(withDocMeta("test title", { title: "Test" })).toBe(
        'test title[test2doc_page]:{"title":"Test"}',
      )
    })
  })

  it("should generate markdown for each root describe block in a file", () => {
    const reporter = setup()
    const mockScreenshotBuffer = Buffer.from("mock image data")
    writeFileSync(
      join(tempDir, "test2doc-1704067218000-1.png"),
      mockScreenshotBuffer,
    )

    reporter.onBegin({} as FullConfig, mockSuiteForPages)
    reporter.onStepBegin(mockTestSuccess, {} as TestResult, mockStep)
    const mockScreenshotName1 = `test2doc-${Date.now() + 500}-1.png`
    const mockScreenshotName2 = `test2doc-${Date.now() + 999}-2.png`
    const mockScreenshotName3 = `test2doc-${Date.now() + 1001}-3.png`
    const mockAttachmentSuccess = [
      {
        name: mockScreenshotName1,
        body: mockScreenshotBuffer,
        contentType: "image/png",
      },
    ]
    const mockAttachmentFail = [
      ...mockAttachmentSuccess,
      {
        name: mockScreenshotName2,
        body: mockScreenshotBuffer,
        contentType: "image/png",
      },
      {
        name: mockScreenshotName3,
        body: mockScreenshotBuffer,
        contentType: "image/png",
      },
    ]
    vi.advanceTimersByTime(600)

    reporter.onStepEnd(
      mockTestSuccess,
      {
        attachments: mockAttachmentSuccess,
      } as TestResult,
      mockStep,
    )

    vi.advanceTimersByTime(400)

    reporter.onStepBegin(mockTestFail, {} as TestResult, mockStep)
    vi.advanceTimersByTime(100)
    reporter.onStepEnd(
      mockTestFail,
      {
        attachments: mockAttachmentFail,
      } as TestResult,
      mockStep,
    )

    expect(readdirSync(tempDir)).toHaveLength(1)
    reporter.onEnd()

    expect(readFileSync(`${tempDir}/login-page.md`, "utf8")).toEqual(
      `---
title: Login Page Documentation
keywords:
  - login
  - password
  - username
description: The different login scenarios for the login page.
sidebar_position: 1
parse_number_prefixes: true
---

# Login Page

## Successful Login

### should redirect to dashboard on successful login

Given user is on login page
![screenshot](./${mockScreenshotName1})

## Failed Login

### should display error message on failed login

Given user is on login page
![screenshot](./${mockScreenshotName2})
![screenshot](./${mockScreenshotName3})

`,
    )
    expect(readdirSync(tempDir)).toHaveLength(5)
    expect(readFileSync(`${tempDir}/dashboard-page.md`, "utf8")).toEqual(
      `---
title: Dashboard Documentation
description: The dashboard of todo stuff.
sidebar_position: 2
---

# Dashboard Page

## Logged In User

### should display a list of todos

## Logged Out User

### should redirect to login page

`,
    )
    expect(readFileSync(`${tempDir}/${mockScreenshotName1}`)).toEqual(
      mockScreenshotBuffer,
    )
  })

  it("should generate a directory and a __category__.json, and a page for each describe block child under the category describe", () => {
    const reporter = setup()

    reporter.onBegin({} as FullConfig, mockSuiteForCategories)
    reporter.onStepBegin(mockTestSuccess, {} as TestResult, mockStep)
    reporter.onStepBegin(mockTestFail, {} as TestResult, mockStep)
    reporter.onEnd()

    expect(
      readFileSync(`${tempDir}/login-page/__category__.json`, "utf8"),
    ).toEqual(
      JSON.stringify(
        {
          label: "Login Page Documentation Label",
          position: 1,
          className: "login-page",
          link: {
            type: "generated-index",
            title: "Login Page Documentation Title",
            description: "The different login scenarios for the login page.",
            slug: "login-page",
          },
        },
        null,
        2,
      ),
    )
    expect(
      readFileSync(`${tempDir}/login-page/successful-login.md`, "utf8"),
    ).toEqual(
      `---
sidebar_position: 1
---

# Successful Login

## should redirect to dashboard on successful login

Given user is on login page

`,
    )
    expect(readdirSync(`${tempDir}/login-page`)).toHaveLength(3)
    expect(
      readFileSync(`${tempDir}/login-page/failed-login.md`, "utf8"),
    ).toEqual(
      `# Failed Login

## should display error message on failed login

Given user is on login page

`,
    )
  })

  it("should generate markdown if there is no root describe block", () => {
    const reporter = setup()
    const mockSuiteWithoutRootDescribe: Suite = {
      ...baseSuite,
      title: "", // Root Suite
      type: "root",
      suites: [
        {
          ...baseSuite,
          title: "chromium", // or firefox, webkit, etc.
          type: "project",
          suites: [
            {
              ...baseSuite,
              title: "login.test.ts", // Test file name
              type: "file",
              suites: [],
              tests: [mockTestSuccess, mockTestFail],
            },
          ],
        },
      ],
    }

    reporter.onBegin({} as FullConfig, mockSuiteWithoutRootDescribe)
    reporter.onEnd()

    expect(readFileSync(`${tempDir}/login.md`, "utf8")).toEqual(
      `# login

## should redirect to dashboard on successful login

## should display error message on failed login

`,
    )
  })
})
