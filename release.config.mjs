/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ["main"],
  repositoryUrl: "https://github.com/dethstrobe/theDenverNexus",
  pkgRoot: "packages/test2doc-playwright",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "packages/test2doc-playwright/CHANGELOG.md",
      },
    ],
    [
      "@semantic-release/npm",
      {
        pkgRoot: "packages/test2doc-playwright",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: [
          {
            path: "packages/test2doc-playwright/dist/**/*",
            label: "Distribution files",
          },
        ],
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: [
          "packages/test2doc-playwright/package.json",
          "packages/test2doc-playwright/CHANGELOG.md",
        ],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
}
