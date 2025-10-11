import { SELF, fetchMock } from "cloudflare:test"
import { describe, it, expect, beforeAll, afterEach } from "vitest"

describe("newsletter worker", () => {
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
          if (!req.body.includes("upsert")) {
            return {
              statusCode: 400,
              data: JSON.stringify({ message: "bad request" }),
            }
          }
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
    expect(response.status).toBe(202)
    expect(response.headers.get("content-type")).toMatch(/text\/html/i)
    const text = await response.text()
    expect(text).toContain('<meta http-equiv="refresh" content="0;url=/thanks"')
    expect(text).toContain('location.replace("/thanks")')
  })

  it("returns 404 for non-newsletter paths", async () => {
    const req = new Request("https://test2doc.com/invalid-path", {
      method: "POST",
    })
    const response = await SELF.fetch(req)
    expect(response.status).toBe(404)
    const text = await response.text()
    expect(text).toBe("Not found")
  })
})
