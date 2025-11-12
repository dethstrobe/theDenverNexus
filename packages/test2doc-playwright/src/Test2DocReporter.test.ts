import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type MockInstance,
} from "vitest"
import type { FullConfig, Suite, TestResult } from "@playwright/test/reporter"
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
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
  mockSuiteWithMultiProjects,
  mockTestNewUserRegistration,
  mockTestLoggedInUser,
  mockTestLoggedOutUser,
} from "./testUtils/index.js"

const mockFullConfig: FullConfig = {} as FullConfig

describe("Test2DocReporter", () => {
  let mockLogging: MockInstance<(...args: any[]) => void>
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"))

    // Mock print to terminal
    mockLogging = vi
      .spyOn(process.stdout, "write")
      .mockImplementation(() => true)
  })

  afterEach(() => {
    vi.useRealTimers()
    // Clean up the temporary directory
    testCleanup()
    mockLogging.mockRestore()
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
    writeFileSync(join(tempDir, "test2doc-old.md"), "# Old Documentation")
    mkdirSync(join(tempDir, "test2doc-old-dir"))
    mkdirSync(join(tempDir, "test2doc-old-category-dir"))
    writeFileSync(
      join(tempDir, "test2doc-old-category-dir/_category_.json"),
      JSON.stringify(
        {
          label: "This needs to be cleaned up",
          position: 1,
        },
        null,
        2,
      ),
    )

    reporter.onBegin(mockFullConfig, mockSuiteForPages)
    reporter.onStepBegin(mockTestSuccess, {} as TestResult, mockStep)
    const mockScreenshotName1 = `test2doc-${Date.now() + 500}-1.png`
    const mockScreenshotName2 = `test2doc-${Date.now() + 999}-2.png`
    const mockScreenshotName3 = `test2doc-${Date.now() + 1001}-3.png`
    const mockScreenshotName3WithAltText = `test2doc-${Date.now() + 1001}-3.png:Alt Text`
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
        name: mockScreenshotName3WithAltText,
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

    reporter.onTestEnd(mockTestSuccess, { status: "passed" } as TestResult)

    vi.advanceTimersByTime(400)

    reporter.onStepBegin(mockTestFail, {} as TestResult, mockStep)
    reporter.onStepEnd(
      mockTestFail,
      {
        attachments: mockAttachmentSuccess,
      } as TestResult,
      mockStep,
    )
    reporter.onTestEnd(mockTestFail, { status: "passed" } as TestResult)
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
    reporter.onTestEnd(mockTestPrivacyPolicyLogin, {
      status: "passed",
    } as TestResult)

    reporter.onTestEnd(mockTestNewUserRegistration, {
      status: "passed",
    } as TestResult)

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

    reporter.onTestEnd(mockTestPrivacyPolicyRegistration, {
      status: "passed",
    } as TestResult)
    reporter.onTestEnd(mockTestLoggedInUser, { status: "passed" } as TestResult)
    reporter.onTestEnd(mockTestLoggedOutUser, {
      status: "passed",
    } as TestResult)

    expect(readdirSync(tempDir)).toHaveLength(4)
    reporter.onEnd()

    expect(readdirSync(tempDir)).toHaveLength(8)
    expect(
      readFileSync(`${tempDir}/test2doc-registration-page.md`, "utf8"),
    ).toEqual(
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
    expect(readFileSync(`${tempDir}/test2doc-login-page.md`, "utf8")).toEqual(
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
![Alt Text](./${mockScreenshotName3})

## link to privacy policy

### should open privacy policy in new tab

Given user is on login page
![screenshot](./${mockScreenshotName4})

`,
    )
    expect(
      readFileSync(`${tempDir}/test2doc-dashboard-page.md`, "utf8"),
    ).toEqual(
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

    // Logging expectations
    expect(mockLogging).toHaveBeenCalledWith(
      "Starting documentation generation for 7 tests...\n",
    )
    expect(mockLogging).toHaveBeenCalledWith(
      "Found 3 documentation sections\n\n",
    )

    // Progress bar updates
    expect(mockLogging).toHaveBeenCalledWith("\r\x1b[K") // Clear line
    expect(mockLogging).toHaveBeenCalledWith("[.......] 0/7 (0%)")
    expect(mockLogging).toHaveBeenCalledWith("[P......] 1/7 (14%)")
    expect(mockLogging).toHaveBeenCalledWith("[PP.....] 2/7 (29%)")
    expect(mockLogging).toHaveBeenCalledWith("[PPP....] 3/7 (43%)")
    expect(mockLogging).toHaveBeenCalledWith("[PPPP...] 4/7 (57%)")
    expect(mockLogging).toHaveBeenCalledWith("[PPPPP..] 5/7 (71%)")
    expect(mockLogging).toHaveBeenCalledWith("[PPPPPP.] 6/7 (86%)")
    expect(mockLogging).toHaveBeenCalledWith("[PPPPPPP] 7/7 (100%)")

    expect(mockLogging).toHaveBeenCalledWith("\n\n")
    expect(mockLogging).toHaveBeenCalledWith("Cleaning up old generated files...\n")
    expect(mockLogging).toHaveBeenCalledWith(
      "Generating documentation files...\n",
    )
    expect(mockLogging).toHaveBeenCalledWith(
      "Documentation generation completed.\n",
    )
    expect(mockLogging).toHaveBeenCalledWith(`Output directory: ${tempDir}\n`)
    expect(mockLogging).toHaveBeenCalledWith("Processed 5 screenshots\n")
  })

  it("should generate a directory and a _category_.json, and a page for each describe block child under the category describe", () => {
    const reporter = setup()

    reporter.onBegin(mockFullConfig, mockSuiteForCategories)
    reporter.onStepBegin(mockTestSuccess, {} as TestResult, mockStep)
    reporter.onStepBegin(mockTestFail, {} as TestResult, mockStep)
    reporter.onEnd()

    expect(
      readFileSync(`${tempDir}/test2doc-login-page/_category_.json`, "utf8"),
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
      readFileSync(
        `${tempDir}/test2doc-login-page/test2doc-successful-login.md`,
        "utf8",
      ),
    ).toEqual(
      `---
sidebar_position: 1
---

# Successful Login

## should redirect to dashboard on successful login

Given user is on login page

`,
    )
    expect(readdirSync(`${tempDir}/test2doc-login-page`)).toHaveLength(3)
    expect(
      readFileSync(
        `${tempDir}/test2doc-login-page/test2doc-failed-login.md`,
        "utf8",
      ),
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

    expect(readFileSync(`${tempDir}/test2doc-login.md`, "utf8")).toEqual(
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

    beforeEach(() => {
      mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
        throw new Error("process.exit called")
      })
    })

    afterEach(() => {
      mockExit.mockRestore()
    })

    it("when there are failed tests", () => {
      const reporter = setup()

      const mockFailedResult: TestResult = {
        status: "failed",
      } as TestResult

      expect(() =>
        reporter.onTestEnd(mockTestSuccess, mockFailedResult),
      ).toThrow("process.exit called")

      expect(mockLogging).toHaveBeenCalledWith(
        `Documentation generation aborted due to test failure: ${mockTestSuccess.title}\n`,
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

      expect(mockLogging).toHaveBeenCalledWith(
        `Documentation generation aborted due to test failure: ${mockTestSuccess.title}\n`,
      )
      expect(mockExit).toHaveBeenCalledWith(1)
      expect(mockExit).toHaveBeenCalledTimes(1)
    })

    it("when there are failed tests but the command flag to ignore is set, we run tests anyway.", () => {
      process.env.IGNORE_TEST_FAILURES = "true"
      const reporter = setup()

      const mockFailedResult: TestResult = {
        status: "failed",
      } as TestResult

      expect(() =>
        reporter.onTestEnd(mockTestSuccess, mockFailedResult),
      ).not.toThrow("process.exit called")

      expect(mockLogging).toHaveBeenCalledWith(
        `Documentation generation aborted due to test failure: ${mockTestSuccess.title}\n`,
      )

      expect(mockExit).toHaveBeenCalledTimes(0)
      delete process.env.IGNORE_TEST_FAILURES
    })
  })

  it("should generate documentation for each project (expect for .setup.ts files)", () => {
    const reporter = setup()

    reporter.onBegin(mockFullConfig, mockSuiteWithMultiProjects)
    reporter.onEnd()

    expect(readdirSync(tempDir)).toHaveLength(2)

    expect(readFileSync(`${tempDir}/test2doc-login.md`, "utf8")).toEqual(
      `# login

## how to login

## how to logout

`,
    )

    expect(
      readFileSync(`${tempDir}/test2doc-authenticated.md`, "utf8"),
    ).toEqual(`# authenticated

## user name and profile should be visible

## setting button should set

`)
  })

  it("should not clean up user directories with generated files", () => {
    const reporter = setup()
    writeFileSync(join(tempDir, "test2doc-old.md"), "# Old Documentation")
    mkdirSync(join(tempDir, "test2doc-clean-me-up-dir"))
    mkdirSync(join(tempDir, "test2doc-login-page"))
    mkdirSync(join(tempDir, "test2doc-orphan-dir"))

    writeFileSync(
      join(tempDir, "test2doc-login-page/_category_.json"),
      JSON.stringify(
        {
          label: "This needs to be cleaned up",
          position: 1,
        },
        null,
        2,
      ),
    )
    const handWrittenContent =
      "# Hand-Written Documentation\n\nThis is some hand-written documentation for the login feature."
    writeFileSync(
      join(tempDir, "test2doc-login-page/hand-written-file.md"),
      handWrittenContent,
    )
    const anotherHandWrittenContent =
      "# Another Hand-Written Documentation\n\nThis is some hand-written documentation for the category feature."
    writeFileSync(
      join(tempDir, "test2doc-orphan-dir/another-hand-written-file.md"),
      anotherHandWrittenContent,
    )

    reporter.onBegin(mockFullConfig, mockSuiteForCategories)

    expect(readdirSync(tempDir)).toHaveLength(4)
    reporter.onEnd()

    expect(readdirSync(tempDir)).toHaveLength(2)
    expect(readdirSync(join(tempDir, "test2doc-login-page"))).toHaveLength(4)
    expect(
      readFileSync(
        join(tempDir, "test2doc-login-page/hand-written-file.md"),
        "utf8",
      ),
    ).toBe(handWrittenContent)
    expect(readdirSync(join(tempDir, "test2doc-orphan-dir"))).toHaveLength(1)
    expect(
      readFileSync(
        join(tempDir, "test2doc-orphan-dir/another-hand-written-file.md"),
        "utf8",
      ),
    ).toBe(anotherHandWrittenContent)
  })
})
