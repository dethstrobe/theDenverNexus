export interface DocusaurusHeaderConfig {
  title?: string
  description?: string
  slug?: string
  sidebar_label?: string
  sidebar_position?: number
  hide_table_of_contents?: boolean
  keywords?: string[]
  image?: string
  // Add any other custom Docusaurus fields you might use
  [key: string]: string | number | boolean | string[] // Allows for additional, non-defined properties
}

// Assume false by default
let test2docActive = process.argv.includes("--test2doc")

/**
 * activateTest2Doc - Activates withDocMeta to add Docusaurus Page Meta Data to Describe Title.
 */
export const activateTest2Doc = () => {
  test2docActive = true
}

/**
 * withDocMeta - Adds Docusaurus Page Meta Data to Playwright Describe Title when test2doc is active.
 * @param title - The title of the describe block.
 * @param config - The Docusaurus Page Metadata configuration object.
 * For a list of fields for the config see https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#markdown-front-matter
 * @returns The title with appended JSON string of config if test2doc is active, otherwise just the title.
 */
export const withDocMeta = (title: string, config: DocusaurusHeaderConfig) =>
  test2docActive ? title + JSON.stringify(config) : title
