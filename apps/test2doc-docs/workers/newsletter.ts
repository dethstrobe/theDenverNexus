import type { ExportedHandler } from "@cloudflare/workers-types"

export default {
  async fetch(request, env, _ctx): Promise<Response> {
    const url = new URL(request.url)
    const pathname = url.pathname
    if (pathname === "/404") {
      return new Response("Not found", { status: 404 })
    }
    const incoming = await request.formData()
    const outbound = new FormData()
    for (const [k, v] of incoming.entries()) {
      // v may be string or File/Blob — append preserves it
      outbound.append(k, v)
    }

    return fetch(
      "https://api.mailgun.net/v3/lists/newsletter@test2doc.com/members",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`,
        },
        body: outbound,
      },
    )
  },
} satisfies ExportedHandler<Env>
