import type {
  FullConfig,
  Reporter,
  Suite,
  TestCase,
  TestResult,
  TestStep,
} from "@playwright/test/reporter"
import { writeFileSync } from "node:fs"

interface DocNode {
  title: string
  children: DocNode[]
  tests?: DocTest[]
}

interface DocTest {
  title: string
  steps: Array<{
    title: string
  }>
}

interface Test2DocReporterOptions {
  outputDir?: string
}

/**
 * Test2DocReporter is a Playwright reporter that generates documentation
 * for tests in markdown and consumed by Docusaurus.
 */
class Test2DocReporter implements Reporter {
  private docs: DocNode = { title: "", children: [] }
  private docMap: Map<string, DocTest | DocNode> = new Map()
  private outputDir: string

  constructor(options: Test2DocReporterOptions = { outputDir: "./docs" }) {
    this.outputDir = options.outputDir || "./docs"
  }

  onBegin(_config: FullConfig, suite: Suite) {
    this.docs = { title: suite.title, children: [] }
    this.docMap.clear()
    this.docMap.set(suite.title, this.docs)
    this.docs = this.buildDocTree(suite)
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

  onTestBegin(test: TestCase) {
    const docSection = this.docMap.get(test.title)
    console.log(`Test started: ${test.title}`, docSection)
    // TODO: Add screenshots here?
  }

  onStepBegin(test: TestCase, _result: TestResult, step: TestStep): void {
    const docSection = this.docMap.get(test.title)
    if (docSection && step.category === "test.step" && "steps" in docSection) {
      docSection.steps.push({ title: step.title })

      // TODO: Add screenshots here?
      console.log("Screen shot here?")
    } else {
      console.warn(`No documentation section found for test ${test.id}`)
    }
  }

  private convertToKebabCase(title: string): string {
    return title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
  }

  onEnd() {
    const markdown = this.generateMarkdown(this.docs)
    const filePath = `${this.outputDir}/${this.convertToKebabCase(this.docs.title)}.md`
    writeFileSync(filePath, markdown)
  }

  private generateTitle(title: string, depth: number): string {
    let titleMarkdown = ""
    for (let i = 0; i < depth; ++i) {
      titleMarkdown += "#"
    }
    return `${titleMarkdown} ${title}\n\n`
  }

  private generateMarkdown(docNode: DocNode, depth = 1): string {
    let markdown = this.generateTitle(docNode.title, depth)

    if (docNode.tests) {
      for (const test of docNode.tests) {
        markdown += this.generateTitle(test.title, depth + 1)
        if (test.steps.length > 0) {
          for (const step of test.steps) {
            markdown += `- ${step.title}\n`
          }
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
