import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  MockInstance,
} from "vitest"
import type { FullConfig, Suite, TestResult } from "@playwright/test/reporter"
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { withDocMeta } from "./DocMeta.js"
import {
  setup,
  tempDir,
  testCleanup,
  mockSuiteForPages,
  mockSuiteForCategories,
  mockTestSuccess,
  mockTestFail,
  mockTestPrivacyPolicyLogin,
  mockTestPrivacyPolicyRegistration,
  mockStep,
  baseSuite,
  mockSuiteWithMutliProjects,
} from "./testUtils/index.js"

const mockFullConfig: FullConfig = {} as FullConfig

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

    reporter.onBegin(mockFullConfig, mockSuiteForPages)
    reporter.onStepBegin(mockTestSuccess, {} as TestResult, mockStep)
    const mockScreenshotName1 = `test2doc-${Date.now() + 500}-1.png`
    const mockScreenshotName2 = `test2doc-${Date.now() + 999}-2.png`
    const mockScreenshotName3 = `test2doc-${Date.now() + 1001}-3.png`
    const mockScreenshotName4 = `test2doc-${Date.now() + 1101}-4.png`
    const mockScreenshotName5 = `test2doc-${Date.now() + 1201}-5.png`
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
    const mockAttachmentPrivacyPolicyLogin = [
      ...mockAttachmentFail,
      {
        name: mockScreenshotName4,
        body: mockScreenshotBuffer,
        contentType: "image/png",
      },
    ]
    const mockAttachmentPrivacyPolicyRegistration = [
      ...mockAttachmentPrivacyPolicyLogin,
      {
        name: mockScreenshotName5,
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

    reporter.onStepBegin(mockTestPrivacyPolicyLogin, {} as TestResult, mockStep)
    vi.advanceTimersByTime(100)
    reporter.onStepEnd(
      mockTestPrivacyPolicyLogin,
      {
        attachments: mockAttachmentPrivacyPolicyLogin,
      } as TestResult,
      mockStep,
    )

    reporter.onStepBegin(
      mockTestPrivacyPolicyRegistration,
      {} as TestResult,
      mockStep,
    )
    vi.advanceTimersByTime(100)
    reporter.onStepEnd(
      mockTestPrivacyPolicyRegistration,
      {
        attachments: mockAttachmentPrivacyPolicyRegistration,
      } as TestResult,
      mockStep,
    )

    expect(readdirSync(tempDir)).toHaveLength(1)
    reporter.onEnd()

    expect(readdirSync(tempDir)).toHaveLength(8)
    expect(readFileSync(`${tempDir}/registration-page.md`, "utf8")).toEqual(
      `---
title: Registration Page Documentation
description: The registration page for new users.
sidebar_position: 1
---

# Registration Page

## New User Registration

### should register a new user successfully

## link to privacy policy

### should open privacy policy in new tab

Given user is on login page
![screenshot](./${mockScreenshotName5})

`,
    )
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

## link to privacy policy

### should open privacy policy in new tab

Given user is on login page
![screenshot](./${mockScreenshotName4})

`,
    )
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

    reporter.onBegin(mockFullConfig, mockSuiteForCategories)
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

    reporter.onBegin(mockFullConfig, mockSuiteWithoutRootDescribe)
    reporter.onEnd()

    expect(readFileSync(`${tempDir}/login.md`, "utf8")).toEqual(
      `# login

## should redirect to dashboard on successful login

## should display error message on failed login

`,
    )
  })

  describe("exit test run", () => {
    let mockExit: MockInstance<
      (code?: string | number | null | undefined) => never
    >
    let mockConsoleError: MockInstance<(...args: any[]) => void>

    beforeEach(() => {
      mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
        throw new Error("process.exit called")
      })

      // Mock console.error to test error messages
      mockConsoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    })

    afterEach(() => {
      mockExit.mockRestore()
      mockConsoleError.mockRestore()
    })

    it("when there are failed tests", () => {
      const reporter = setup()

      const mockFailedResult: TestResult = {
        status: "failed",
      } as TestResult

      expect(() =>
        reporter.onTestEnd(mockTestSuccess, mockFailedResult),
      ).toThrow("process.exit called")

      expect(mockConsoleError).toHaveBeenCalledWith(
        `Documentation generation aborted due to test failure: ${mockTestSuccess.title}`,
      )
      expect(mockExit).toHaveBeenCalledWith(1)
      expect(mockExit).toHaveBeenCalledTimes(1)
    })

    it("when there are tests that timeout", () => {
      const reporter = setup()

      const mockTimeoutResult: TestResult = {
        status: "timedOut",
      } as TestResult

      expect(() =>
        reporter.onTestEnd(mockTestSuccess, mockTimeoutResult),
      ).toThrow("process.exit called")

      expect(mockConsoleError).toHaveBeenCalledWith(
        `Documentation generation aborted due to test failure: ${mockTestSuccess.title}`,
      )
      expect(mockExit).toHaveBeenCalledWith(1)
      expect(mockExit).toHaveBeenCalledTimes(1)
    })
  })

  it("should generate documentation for each project", () => {
    const reporter = setup()

    reporter.onBegin(mockFullConfig, mockSuiteWithMutliProjects)
    reporter.onEnd()

    expect(readdirSync(tempDir)).toHaveLength(3)

    expect(readFileSync(`${tempDir}/login.md`, "utf8")).toEqual(
      `# login

## how to login

## how to logout

`,
    )
    expect(
      readFileSync(`${tempDir}/auth-setup-ts.md`, "utf8"),
    ).toEqual(`# auth.setup.ts

## setup auth

`)

    expect(
      readFileSync(`${tempDir}/authenticated.md`, "utf8"),
    ).toEqual(`# authenticated

## user name and profile should be visible

## setting button should set

`)
  })
})
