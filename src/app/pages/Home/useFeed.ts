import { useState, useEffect, useCallback, useMemo } from "react"
import { RssArticle } from "./types"
import { IDBPDatabase, openDB } from "idb"

const updateFeed = {
  upgrade(db: IDBPDatabase<unknown>) {
    db.createObjectStore("feeds")
  },
}

const FEED_STORE = "feeds"
const DB_NAME = "rss-feeds"

export const useFeed = () => {
  const [feed, setFeed] = useState<RssArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    openDB(DB_NAME, 1, updateFeed).then((db) => {
      db.transaction(FEED_STORE, "readonly")
        .objectStore(FEED_STORE)
        .getAll()
        .then((articles: RssArticle[]) => {
          // Sort articles by publication date in descending order (newest first)
          const sortedArticles = articles.toSorted((a, b) => {
            const dateA = new Date(a.pubDate || 0)
            const dateB = new Date(b.pubDate || 0)
            return dateB.getTime() - dateA.getTime()
          })
          setFeed(sortedArticles)
          setIsLoading(false)
        })
    })
  }, [setFeed, setIsLoading])

  const saveFeeds = useCallback(
    async (feeds: RssArticle[]) => {
      const db = await openDB(DB_NAME, 1, updateFeed)
      const tx = db.transaction(FEED_STORE, "readwrite")
      const store = tx.objectStore(FEED_STORE)

      const combinedFeeds = [...feed, ...feeds].toSorted((a, b) => {
        const dateA = new Date(a.pubDate || 0)
        const dateB = new Date(b.pubDate || 0)
        return dateB.getTime() - dateA.getTime()
      })

      // Clear existing feeds
      await store.clear()

      // Store each feed individually
      for (const article of combinedFeeds) {
        await store.put(article, article.link)
      }

      await tx.done
      setFeed(combinedFeeds)
    },
    [feed],
  )

  return useMemo(
    () => ({ feed, saveFeeds, isLoading }),
    [feed, saveFeeds, isLoading],
  )
}
