import { http, HttpResponse } from "msw"
import { rssData } from "./rssData"

export const handlers = [
  http.get("https://example.com/rss", () => {
    return new HttpResponse(rssData, {
      headers: {
        "Content-Type": "application/xml",
      },
    })
  }),
]
