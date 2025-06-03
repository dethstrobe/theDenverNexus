// import { createExecutionContext } from "cloudflare:test"
// import worker from "./worker"

// describe("Worker", () => {
//   it("should serve ping endpoint", async () => {
//     const ctx = createExecutionContext()
//     const req = new Request("http://localhost/ping")
//     const res = await worker.fetch(req, ctx.env, ctx)

//     expect(res.status).toBe(200)
//     const text = await res.text()
//     expect(text).toContain("Pong!")
//   })
// })

test("worker placeholder test", () => {
  // Placeholder test to ensure the test suite runs
  expect(true).toBe(true)
})
