"use client"

import { useState } from "react"

interface RssArticle {
  title: string
  description: string
  link: string
  pubDate: string
  image: string
}

interface RssResponse {
  items: RssArticle[]
}

export const Home = () => {
  const [rssFeed, setRssFeed] = useState<RssArticle[] | null>(null)
  return (
    <div>
      <h1>Home</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const rssFeedUrl = formData.get("rssFeedUrl")
          if (rssFeedUrl) {
            fetch(rssFeedUrl.toString())
              .then((res) => res.json())
              .then((data) => {
                setRssFeed((data as RssResponse).items)
              })
            // Handle the RSS feed URL here
            console.log("RSS Feed URL:", rssFeedUrl)
            // Clear the input after submission
            e.currentTarget.reset()
          }
        }}
      >
        <label htmlFor="rssFeedUrl">RSS Feed URL to Follow</label>
        <input
          id="rssFeedUrl"
          type="text"
          name="rssFeedUrl"
          placeholder="Input RSS Feed URL"
        />
        <button type="submit">Add to Feed</button>
      </form>
      {rssFeed &&
        rssFeed.map((article) => (
          <article key={article.link} aria-labelledby={article.link}>
            <h2 id={article.link}>{article.title}</h2>
            <p>{article.description}</p>
          </article>
        ))}
    </div>
  )
}
