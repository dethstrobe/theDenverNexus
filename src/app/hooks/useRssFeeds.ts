import { useState, useEffect } from "react"
import { openDB } from "idb"

interface RssFeed {
  url: string
  title: string
  description: string
  items: Array<{
    title: string
    link: string
    description: string
  }>
}

export function useRssFeeds() {
  const [savedFeeds, setSavedFeeds] = useState<RssFeed[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadFeeds() {
      try {
        const db = await openDB("rss-feeds", 1, {
          upgrade(db) {
            db.createObjectStore("feeds")
          },
        })
        const feeds = await db.getAll("feeds")
        setSavedFeeds(feeds)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load feeds"))
      } finally {
        setIsLoading(false)
      }
    }

    loadFeeds()
  }, [])

  const addFeed = async (feed: RssFeed) => {
    try {
      const db = await openDB("rss-feeds", 1, {
        upgrade(db) {
          db.createObjectStore("feeds")
        },
      })
      await db.put("feeds", feed, feed.url)
      setSavedFeeds((prev) => [...prev, feed])
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to add feed"))
    }
  }

  const removeFeed = async (url: string) => {
    try {
      const db = await openDB("rss-feeds", 1, {
        upgrade(db) {
          db.createObjectStore("feeds")
        },
      })
      await db.delete("feeds", url)
      setSavedFeeds((prev) => prev.filter((feed) => feed.url !== url))
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to remove feed"))
    }
  }

  return {
    feeds: savedFeeds,
    isLoading,
    error,
    addFeed,
    removeFeed,
  }
}
