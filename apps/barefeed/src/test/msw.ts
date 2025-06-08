import { beforeAll, afterAll, afterEach } from "vitest"
import { setupServer } from "msw/node"
import { handlers } from "../app/pages/Home/__mocks__/handlers"

export const server = setupServer(...handlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }))

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Close server after all tests
afterAll(() => server.close())
