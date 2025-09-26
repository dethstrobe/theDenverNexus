import type {
  FullProject,
  Suite,
  TestCase,
  TestStep,
} from "@playwright/test/reporter"
import { withDocCategory, withDocMeta } from "../DocMeta.js"

let mockId = 0

export const baseSuite: Suite = {
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
  id: `mock-id-${++mockId}`,
  parent: baseSuite, // this is just mocked out
  repeatEachIndex: 0,
  results: [],
  retries: 0,
  tags: [],
  timeout: 0,
  type: "test",
}

export const mockTestSuccess: TestCase = {
  ...baseTestCase,
  title: "should redirect to dashboard on successful login",
  id: `mock-id-${++mockId}`,
}

export const mockTestFail: TestCase = {
  ...baseTestCase,
  title: "should display error message on failed login",
  id: `mock-id-${++mockId}`,
}

export const mockTestPrivacyPolicyLogin: TestCase = {
  ...baseTestCase,
  title: "should open privacy policy in new tab",
  id: `mock-id-${++mockId}`,
}

export const mockTestNewUserRegistration: TestCase = {
  ...baseTestCase,
  title: "should register a new user successfully",
  id: `mock-id-${++mockId}`,
}

export const mockTestPrivacyPolicyRegistration: TestCase = {
  ...baseTestCase,
  title: "should open privacy policy in new tab",
  id: `mock-id-${++mockId}`,
}

export const mockTestLoggedInUser: TestCase = {
  ...baseTestCase,
  title: "should display a list of todos",
  id: `mock-id-${++mockId}`,
}

export const mockTestLoggedOutUser: TestCase = {
  ...baseTestCase,
  title: "should redirect to login page",
  id: `mock-id-${++mockId}`,
}

export const mockSuiteForPages: Suite = {
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
                {
                  ...baseSuite,
                  title: "link to privacy policy",
                  tests: [mockTestPrivacyPolicyLogin],
                },
              ],
            },
            {
              ...baseSuite,
              title: withDocMeta("Registration Page", {
                title: "Registration Page Documentation",
                description: "The registration page for new users.",
                sidebar_position: 1,
              }), // Second Describe Block in the test file
              type: "describe",
              suites: [
                {
                  ...baseSuite,
                  title: "New User Registration",
                  tests: [mockTestNewUserRegistration],
                },
                {
                  ...baseSuite,
                  title: "link to privacy policy",
                  tests: [mockTestPrivacyPolicyRegistration],
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
                  tests: [mockTestLoggedInUser],
                  type: "describe",
                },
                {
                  ...baseSuite,
                  title: "Logged Out User",
                  tests: [mockTestLoggedOutUser],
                  type: "describe",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const mockSuiteForCategories: Suite = {
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

export const mockSuiteWithMultiProjects: Suite = {
  ...baseSuite,
  title: "", // Root Suite
  type: "root",
  suites: [
    {
      ...baseSuite,
      title: "login",
      type: "project",
      suites: [
        {
          ...baseSuite,
          title: "login.test.ts",
          type: "file",
          tests: [
            {
              ...baseTestCase,
              title: "how to login",
              id: `mock-id-${++mockId}`,
            },
            {
              ...baseTestCase,
              title: "how to logout",
              id: `mock-id-${++mockId}`,
            },
          ],
        },
      ],
    },
    {
      ...baseSuite,
      title: "setup",
      type: "project",
      suites: [
        {
          ...baseSuite,
          title: "auth.setup.ts",
          type: "file",
          tests: [
            {
              ...baseTestCase,
              title: "setup auth",
              id: `mock-id-${++mockId}`,
            },
          ],
        },
      ],
    },
    {
      ...baseSuite,
      title: "authenticated",
      type: "project",
      suites: [
        {
          ...baseSuite,
          title: "authenticated.spec.ts",
          type: "file",
          tests: [
            {
              ...baseTestCase,
              title: "user name and profile should be visible",
              id: `mock-id-${++mockId}`,
            },
            {
              ...baseTestCase,
              title: "setting button should set",
              id: `mock-id-${++mockId}`,
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

export const mockStep: TestStep = {
  ...baseTestStep,
  title: "Given user is on login page",
}
