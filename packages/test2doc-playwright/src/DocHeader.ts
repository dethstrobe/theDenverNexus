interface DocusaurusHeaderConfig {
  title: string
  description?: string
  slug?: string
  sidebar_label?: string
  sidebar_position?: number
  hide_table_of_contents?: boolean
  keywords?: string[]
  image?: string
  // Add any other custom Docusaurus fields you might use
  [key: string]: any // Allows for additional, non-defined properties
}

export const createDocusaurusPageAnnotation = (
  config: DocusaurusHeaderConfig,
) => ({
  type: "test2doc-docusaurus-header",
  description: JSON.stringify(config),
})
