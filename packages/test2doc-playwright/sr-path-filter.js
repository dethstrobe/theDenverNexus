import { execSync } from "node:child_process"

/**
 * Filters context.commits to only those that touched this package directory.
 * Must run before @semantic-release/commit-analyzer in the plugins array so
 * the analyzer (and all subsequent plugins) only see package-relevant commits.
 */
export async function analyzeCommits(_, context) {
  const pathHashes = new Set(
    execSync("git log --format=%H -- .", { cwd: context.cwd })
      .toString()
      .trim()
      .split("\n")
      .filter(Boolean),
  )
  context.commits = context.commits.filter((c) => pathHashes.has(c.hash))
  // Return null — let the real commit-analyzer determine the release type
  return null
}
