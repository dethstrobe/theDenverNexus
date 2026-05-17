import { execSync } from "node:child_process"

const EXCLUDED_SCOPES = ["ci", "cd", "ci/cd", "deps", "release"]

/**
 * Filters context.commits to only those that touched this package directory
 * and are not CI/CD or infrastructure commits.
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
  context.commits = context.commits.filter((c) => {
    if (!pathHashes.has(c.hash)) return false
    const scope = c.message?.match(/^\w+\(([^)]+)\):/)?.[1]?.toLowerCase()
    if (scope && EXCLUDED_SCOPES.includes(scope)) return false
    return true
  })
  // Return null — let the real commit-analyzer determine the release type
  return null
}
