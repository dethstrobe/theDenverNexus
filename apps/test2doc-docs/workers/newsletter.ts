import type { ExportedHandler } from "@cloudflare/workers-types"

export default {
  async fetch(request, env, _ctx) {
    const url = new URL(request.url)
    const pathname = url.pathname
    if (pathname !== "/api/newsletter") {
      return new Response("Not found", { status: 404 })
    }
    const incoming = await request.formData()
    const outbound = new FormData()
    for (const [k, v] of incoming.entries()) {
      // v may be string or File/Blob — append preserves it
      outbound.append(k, v)
    }
    outbound.append("upsert", "yes")

    try {
      const res = await fetch(
        "https://api.mailgun.net/v3/lists/newsletter@test2doc.com/members",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`,
          },
          body: outbound,
        },
      )

      if (!res.ok) {
        return new Response(`Error: ${res.statusText}`, { status: 500 })
      }

      return new Response(
        `<!doctype html><html><head><meta http-equiv="refresh" content="0;url=/thanks"></head><body><script>location.replace("/thanks")</script></body></html>`,
        {
          status: 202,
          headers: { "content-type": "text/html; charset=utf-8" },
        },
      )
    } catch (e) {
      return new Response(`Error: ${e}`, { status: 500 })
    }
  },
} satisfies ExportedHandler<Env>
