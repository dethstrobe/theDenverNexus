import { SELF, fetchMock } from "cloudflare:test"
import { describe, it, expect, beforeAll, afterEach } from "vitest"

describe("Hello World worker", () => {
  beforeAll(() => {
    fetchMock.activate()
    fetchMock.disableNetConnect()
  })
  afterEach(() => fetchMock.assertNoPendingInterceptors())

  it("forwards newsletter signup to Mailgun and returns response", async () => {
    fetchMock
      .get("https://api.mailgun.net")
      .intercept({
        path: "/v3/lists/newsletter@test2doc.com/members",
        method: "POST",
      })
      .reply((req) => {
        // capture the request for later assertions
        if (!req.headers["authorization"].includes("Basic ")) {
          return {
            statusCode: 401,
            data: JSON.stringify({ message: "unauthorized" }),
            responseOptions: {
              headers: { "content-type": "application/json" },
            },
          }
        }

        if (
          typeof req.body === "string" &&
          req.body.includes("test@example.com")
        ) {
          return {
            statusCode: 200,
            data: JSON.stringify({ message: "queued" }),
            responseOptions: {
              headers: { "content-type": "application/json" },
            },
          }
        }

        return {
          statusCode: 400,
          data: JSON.stringify({ message: "bad request" }),
          responseOptions: { headers: { "content-type": "application/json" } },
        }
      })

    const form = new FormData()
    form.append("address", "test@example.com")
    form.append("name", "Tester")

    const req = new Request("https://test2doc.com/api/newsletter", {
      method: "POST",
      body: form,
    })

    const response = await SELF.fetch(req)
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ message: "queued" })
  })
})
