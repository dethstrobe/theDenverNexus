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
  http.get("/proxy/:url", ({ params }) => {
    const urlParam = Array.isArray(params.url) ? params.url[0] : params.url
    const url = decodeURIComponent(urlParam)

    switch (url) {
      case "https://example.com/rss":
        return new HttpResponse(rssData1, {
          headers: {
            "Content-Type": "application/xml",
          },
        })
      case "https://website.net/feed.xml":
        return new HttpResponse(rssData2, {
          headers: {
            "Content-Type": "application/xml",
          },
        })
      default:
        return new HttpResponse("Not Found", {
          status: 404,
          headers: { "Content-Type": "text/plain" },
        })
    }
  }),
]
