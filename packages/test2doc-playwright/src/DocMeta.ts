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

export type metadataType = "page" | "category"

// Assume false by default
// biome-ignore lint/complexity/useLiteralKeys: TS recommends accessing Index Signatures with dot notation
let test2docActive = process.env["TEST2DOC"] === "true"

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
  test2docActive ? addConfigToTitle(title, config, "page") : title

const addConfigToTitle = (
  title: string,
  config: DocusaurusHeaderConfig | DocusaurusCategoryMetadata,
  metaType: metadataType,
): string => `${title}[test2doc_${metaType}]:${JSON.stringify(config)}`

interface DocusaurusCategoryLinkGeneratedIndex {
  type: "generated-index"
  title?: string
  description?: string
  slug?: string
  keywords?: string[]
  image?: string
}

interface DocusaurusCategoryLinkDoc {
  type: "doc"
  id: string
}

interface DocusaurusCategoryLinkExternal {
  type: "link"
  href: string
}

type DocusaurusCategoryLink =
  | DocusaurusCategoryLinkGeneratedIndex
  | DocusaurusCategoryLinkDoc
  | DocusaurusCategoryLinkExternal

export interface DocusaurusCategoryMetadata {
  label?: string
  position?: number
  link?: DocusaurusCategoryLink
  collapsible?: boolean
  collapsed?: boolean
  className?: string
  customProps?: Record<string, unknown>
}

export const withDocCategory = (
  title: string,
  metadata: DocusaurusCategoryMetadata,
): string =>
  test2docActive ? addConfigToTitle(title, metadata, "category") : title
