"use client"

import { useFeed } from "./useFeed"
import { Button, Input } from "@headlessui/react"

export const Home = () => {
  const { feed, saveFeeds, isLoading } = useFeed()
  return (
    <div>
      <h1>Home</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget
          const formData = new FormData(form)
          const rssFeedUrl = formData.get("rssFeedUrl")
          if (rssFeedUrl) {
            fetch(`/proxy/${encodeURIComponent(rssFeedUrl.toString())}`)
              .then((res) => res.text())
              .then((xmlText) => {
                const parser = new DOMParser()
                const xmlDoc = parser.parseFromString(xmlText, "text/xml")
                // Try RSS format first
                let items = Array.from(xmlDoc.getElementsByTagName("item"))
                // If no RSS items found, try Atom format
                if (items.length === 0) {
                  items = Array.from(xmlDoc.getElementsByTagName("entry"))
                }
                const articles = items.map((item) => ({
                  title:
                    item.getElementsByTagName("title")[0]?.textContent || "",
                  description:
                    item.getElementsByTagName("description")[0]?.textContent ||
                    item.getElementsByTagName("summary")[0]?.textContent ||
                    "",
                  link:
                    item
                      .getElementsByTagName("link")[0]
                      ?.getAttribute("href") ||
                    item.getElementsByTagName("link")[0]?.textContent ||
                    "",
                  pubDate:
                    item.getElementsByTagName("pubDate")[0]?.textContent ||
                    item.getElementsByTagName("updated")[0]?.textContent ||
                    "",
                  image:
                    item.getElementsByTagName("image")[0]?.textContent ||
                    item.querySelector("content img")?.getAttribute("src") ||
                    "",
                }))
                saveFeeds(articles)
                // Clear the input after submission
                form.reset()
              })
          }
        }}
      >
        <label htmlFor="rssFeedUrl">RSS Feed URL to Follow</label>
        <Input
          id="rssFeedUrl"
          type="text"
          name="rssFeedUrl"
          placeholder="Input RSS Feed URL"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>Add to Feed</Button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        feed.map((article) => (
          <article
            className="p-2"
            key={article.link}
            aria-labelledby={article.link}
          >
            <h2 className="text-4xl font-bolder mb-2" id={article.link}>
              <a href={article.link}>{article.title}</a>
            </h2>
            <p>{article.description}</p>
          </article>
        ))
      )}
    </div>
  )
}
