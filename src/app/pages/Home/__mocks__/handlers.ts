import { http, HttpResponse } from "msw"
import { rssData1, rssData2 } from "./rssData"

export const handlers = [
  http.get("https://example.com/rss", () => {
    return new HttpResponse(rssData1, {
      headers: {
        "Content-Type": "application/xml",
      },
    })
  }),
  http.get("https://website.net/feed.xml", () => {
    return new HttpResponse(rssData2, {
      headers: {
        "Content-Type": "application/xml",
      },
    })
  }),
]
