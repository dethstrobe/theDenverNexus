import { http, HttpResponse } from "msw"

export const handlers = [
  http.get("https://example.com/rss", () => {
    return HttpResponse.json({
      items: [
        {
          title: "Example Post Title",
          description: "This is an example post description",
          link: "https://example.com/post/1",
          pubDate: "2024-03-20T12:00:00Z",
          image: "https://example.com/image.jpg",
        },
      ],
    })
  }),
]
