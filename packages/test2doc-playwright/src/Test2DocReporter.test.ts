import { describe, it, expect, vi, beforeEach } from "vitest"
import Test2DocReporter from "./index.js"
import type {
  FullConfig,
  FullProject,
  Suite,
  TestCase,
  TestResult,
  TestStep,
} from "@playwright/test/reporter"
import { writeFileSync, mkdirSync, renameSync } from "node:fs"
import { withDocCategory, withDocMeta } from "./DocMeta.js"

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
  vi.mock("node:fs", () => ({
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
    renameSync: vi.fn(),
  }))

  beforeEach(() => {
    vi.resetAllMocks()
  })

  const setup = () => {
    return new Test2DocReporter({ outputDir: "test-output" })
  }

  describe("withDocMeta", () => {
    it("loading the reporter file should enable the withDocMeta JSON stringify for Docusaurus Page Header Data", () => {
      expect(withDocMeta("test title", { title: "Test" })).toBe(
        'test title[test2doc_page]:{"title":"Test"}',
      )
    })
  })

  it("should generate markdown for each root describe block in a file", () => {
    const reporter = setup()

    reporter.onBegin({} as FullConfig, mockSuiteForPages)
    reporter.onTestBegin(mockTestSuccess)
    reporter.onStepBegin(mockTestSuccess, {} as TestResult, mockStep)
    reporter.onStepEnd(
      mockTestSuccess,
      {
        attachments: [
          { name: "given-user-is-on-login-page.png", contentType: "image/png" },
        ],
      } as TestResult,
      mockStep,
    )
    reporter.onStepBegin(mockTestFail, {} as TestResult, mockStep)
    reporter.onEnd()
    expect(writeFileSync).toHaveBeenCalledWith(
      "test-output/login-page.md",
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

- Given user is on login page
![screenshot](./given-user-is-on-login-page.png)

## Failed Login

### should display error message on failed login

- Given user is on login page

`,
    )
    expect(writeFileSync).toHaveBeenCalledTimes(2)
    expect(writeFileSync).toHaveBeenCalledWith(
      "test-output/dashboard-page.md",
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
    expect(renameSync).toHaveBeenCalledWith(
      "given-user-is-on-login-page.png",
      "test-output/given-user-is-on-login-page.png",
    )
  })

  it("should generate a directory and a __category__.json, and a page for each describe block child under the category describe", () => {
    const reporter = setup()

    reporter.onBegin({} as FullConfig, mockSuiteForCategories)
    reporter.onTestBegin(mockTestSuccess)
    reporter.onStepBegin(mockTestSuccess, {} as TestResult, mockStep)
    reporter.onStepBegin(mockTestFail, {} as TestResult, mockStep)
    reporter.onEnd()

    expect(mkdirSync).toHaveBeenCalledOnce()
    expect(mkdirSync).toHaveBeenCalledWith("test-output/login-page", {
      recursive: true,
    })

    expect(writeFileSync).toHaveBeenCalledWith(
      "test-output/login-page/__category__.json",
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
    expect(writeFileSync).toHaveBeenCalledWith(
      "test-output/login-page/successful-login.md",
      `---
sidebar_position: 1
---

# Successful Login

## should redirect to dashboard on successful login

- Given user is on login page

`,
    )
    expect(writeFileSync).toBeCalledTimes(3)
    expect(writeFileSync).toHaveBeenCalledWith(
      "test-output/login-page/failed-login.md",
      `# Failed Login

## should display error message on failed login

- Given user is on login page

`,
    )
  })
})
