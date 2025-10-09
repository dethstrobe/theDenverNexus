import { test, expect } from "@playwright/test"

test("submit an email to the subscription endpoint", async ({ page }) => {
  await page.goto("/")

  const input = page.getByRole("textbox", { name: "Join our newsletter" })

  const captured: { headers?: Record<string, string>; body?: string | null } =
    {}

  // intercept and mock the endpoint, capture headers + raw body
  await page.route("**/api/newsletter", async (route, request) => {
    captured.headers = request.headers()
    // postData() returns the request body as string when available
    captured.body = request.postData()
    await route.fulfill({
      status: 202,
      contentType: "text/html",
      body: `<!doctype html><html><head><meta http-equiv="refresh" content="0;url=/thanks"></head><body><script>location.replace("/thanks")</script></body></html>`,
    })
  })

  // type and submit
  await input.fill("test@email.com")
  await page.click('button[type="submit"]')

  // assertions about the outbound request (behavioral, not implementation)
  expect(captured.headers).toHaveProperty("content-type")
  expect(captured.headers["content-type"]).toMatch(/^multipart\/form-data/i)

  // check raw body contains the submitted email (avoids brittle multipart parsing)
  expect(captured.body).toContain("test@email.com")

  await expect(
    page.getByRole("heading", { name: "Thank you for subscribing!" }),
  ).toBeVisible()
})
