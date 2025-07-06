import type {
  FullConfig,
  Reporter,
  Suite,
  TestCase,
  TestResult,
  TestStep,
} from "@playwright/test/reporter"
import { mkdirSync, writeFileSync } from "node:fs"
import { activateTest2Doc } from "./DocMeta.js"
import type {
  DocusaurusCategoryMetadata,
  DocusaurusHeaderConfig,
  metadataType,
} from "./DocMeta.js"
import { convertToKebabCase } from "./utils.js"

interface DocNode {
  title: string
  children: DocNode[]
  tests?: DocTest[]
}

interface DocScreenshot {
  name: string // name of the screenshot file
  buffer: Buffer // buffer of the screenshot image
}

interface DocTest {
  title: string
  steps: Array<{
    title?: string
    screenshot?: DocScreenshot
  }>
}

interface Test2DocReporterOptions {
  outputDir?: string
}

type ExtractDocMetadataPage = [string, DocusaurusHeaderConfig, "page"]

type ExtractDocMetadataCategory = [
  string,
  DocusaurusCategoryMetadata,
  "category",
]

type ExtractedDocMetadataUnspecified = [
  string,
  Record<string, unknown>,
  undefined,
]

type ExtractedDocMetadata =
  | ExtractDocMetadataPage
  | ExtractDocMetadataCategory
  | ExtractedDocMetadataUnspecified

activateTest2Doc()

/**
 * Test2DocReporter is a Playwright reporter that generates documentation
 * for tests in markdown and consumed by Docusaurus.
 */
class Test2DocReporter implements Reporter {
  private docs: DocNode[] = []
  private docMap: Map<string, DocTest | DocNode> = new Map()
  private outputDir: string
  private screenshotMoveQueue: DocScreenshot[] = []
  private stepStartTime = Date.now()

  constructor(
    options: Test2DocReporterOptions = {
      outputDir: "./docs",
    },
  ) {
    this.outputDir = options.outputDir || "./docs"
  }

  onBegin(_config: FullConfig, suite: Suite) {
    this.docs = []
    this.docMap.clear()
    // this.docMap.set(suite.title, this.docs)
    this.docs =
      suite.suites[0]?.suites.flatMap(({ suites }) =>
        suites.map((s) => this.buildDocTree(s)),
      ) || []
  }

  private buildDocTree(suite: Suite) {
    const docNode: DocNode = {
      title: suite.title,
      children: [],
    }

    for (const child of suite.suites) {
      const childDocNode = this.buildDocTree(child)
      this.docMap.set(child.title, childDocNode)
      docNode.children.push(childDocNode)
    }

    for (const test of suite.tests) {
      const testDoc: DocTest = {
        title: test.title,
        steps: [],
      }
      this.docMap.set(test.title, testDoc)
      docNode.tests = docNode.tests || []
      docNode.tests.push(testDoc)
    }

    return docNode
  }

  onStepBegin(test: TestCase, _result: TestResult, step: TestStep): void {
    const docSection = this.docMap.get(test.title)
    if (docSection && step.category === "test.step" && "steps" in docSection) {
      this.stepStartTime = Date.now()
      docSection.steps.push({ title: step.title })
    }
  }

  onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
    const docSection = this.docMap.get(test.title)
    if (docSection && step.category === "test.step" && "steps" in docSection) {
      const stepEndTime = Date.now()
      result.attachments.forEach((attachment) => {
        const match = attachment.name.match(/test2doc-(\d+).png/) || []

        const screenshotTime = +(match.at(1) ?? 0)

        if (
          screenshotTime < stepEndTime &&
          screenshotTime >= this.stepStartTime &&
          attachment.body
        ) {
          docSection.steps.push({
            screenshot: { name: attachment.name, buffer: attachment.body },
          })
        }
      })
      this.stepStartTime = Date.now() // Reset step start time
    }
  }

  onEnd() {
    this.docs.forEach((doc) => this.buildDocFiles(doc))
  }

  private buildDocFiles(doc: DocNode, outputDir: string = this.outputDir) {
    const [title, metadata, metaType] = this.extractDocMetadata(doc.title)

    if (metaType === "page") {
      const markdownHeader = this.generateHeader(metadata)
      const markdown =
        markdownHeader + this.generateMarkdown({ ...doc, title }, 1)
      const filePath = `${outputDir}/${convertToKebabCase(title)}.md`
      writeFileSync(filePath, markdown)
      this.generateScreenshots(outputDir)
    } else if (metaType === "category") {
      const filePath = `${outputDir}/${convertToKebabCase(title)}`
      mkdirSync(filePath, { recursive: true })

      writeFileSync(
        `${filePath}/__category__.json`,
        JSON.stringify(metadata, null, 2),
      )
      doc.children.forEach((child) => this.buildDocFiles(child, filePath))
      this.generateScreenshots(filePath)
    } else {
      const markdown = this.generateMarkdown(doc, 1)
      const filePath = `${outputDir}/${convertToKebabCase(doc.title)}.md`
      writeFileSync(filePath, markdown)
      this.generateScreenshots(outputDir)
    }
  }

  private generateScreenshots(output: string) {
    this.screenshotMoveQueue.forEach(({ name, buffer }) => {
      const dest = `${output}/${name}`
      writeFileSync(dest, buffer)
    })
    this.screenshotMoveQueue = []
  }

  private extractDocMetadata(docTitle: string): ExtractedDocMetadata {
    const [_ignore, title, metaType, metadataJson] =
      docTitle.match(/^(.*?)\[test2doc_(.+)\]:(.+)$/) ?? []

    return [
      title ?? docTitle,
      metadataJson ? JSON.parse(metadataJson) : {},
      metaType as metadataType,
    ]
  }

  private generateHeader(metadata: DocusaurusHeaderConfig): string {
    let header = "---\n"
    for (const [key, value] of Object.entries(metadata)) {
      switch (typeof value) {
        case "string":
        case "number":
        case "boolean":
          header += `${key}: ${value}\n`
          break
        case "object":
          if (Array.isArray(value)) {
            header += `${key}:\n`
            for (const item of value) {
              header += `  - ${item}\n`
            }
          } else {
            header += `${key}:\n`
            for (const [subKey, subValue] of Object.entries(value)) {
              header += `  ${subKey}: ${subValue}\n`
            }
          }
          break
        default:
          console.warn(
            `Unsupported metadata type for key "${key}": ${typeof value}`,
          )
          break
      }
    }
    header += "---\n\n"
    return header
  }

  private generateTitle(title: string, depth: number): string {
    let titleMarkdown = ""
    for (let i = 0; i < depth; ++i) {
      titleMarkdown += "#"
    }
    return `${titleMarkdown} ${title}\n\n`
  }

  private generateMarkdown(docNode: DocNode, depth: number): string {
    let markdown = this.generateTitle(docNode.title, depth)

    if (docNode.tests) {
      for (const test of docNode.tests) {
        markdown += this.generateTitle(test.title, depth + 1)
        if (test.steps.length > 0) {
          for (const step of test.steps) {
            if (step.title) {
              markdown += `- ${step.title}\n`
            }
            if (step.screenshot) {
              this.screenshotMoveQueue.push(step.screenshot)
              markdown += `![screenshot](./${step.screenshot.name})\n`
            }
          }
          markdown += "\n"
        }
      }
    }

    if (docNode.children.length > 0) {
      for (const child of docNode.children) {
        markdown += this.generateMarkdown(child, depth + 1)
      }
    }

    return markdown
  }
}

export default Test2DocReporter
