import { promises as fs } from "node:fs"
import path from "node:path"

export const getLatestBlogPost = async (): Promise<string> => {
  const blogDir = path.join(process.cwd(), "blog")

  // Read all entries in blog directory
  const entries = await fs.readdir(blogDir, { withFileTypes: true })

  let earliestPost: { date: number; path: string }

  for (const entry of entries) {
    let filePath: string
    const dateMatch = entry.name.match(/^(\d{4})-(\d{2})-(\d{2})-/)
    if (!dateMatch) continue

    if (entry.isDirectory()) {
      const indexPath = path.join(blogDir, entry.name, "index.md")
      try {
        await fs.access(indexPath) // check if index.md exists
        filePath = indexPath
      } catch {
        continue // skip if index.md doesn't exist
      }
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      filePath = path.join(blogDir, entry.name)
    } else {
      continue
    }

    const [, year, month, day] = dateMatch
    const date = new Date(`${year}-${month}-${day}`).getTime()
    if (!earliestPost || date > earliestPost.date) {
      earliestPost = { date, path: filePath }
    }
  }

  if (!earliestPost) {
    throw new Error(`No blog posts found in ${blogDir}`)
  }

  const latestPath = earliestPost.path
  return await fs.readFile(latestPath, "utf8")
}
