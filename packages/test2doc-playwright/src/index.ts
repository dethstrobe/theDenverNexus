import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
  TestStep,
} from "@playwright/test/reporter"
import { writeFileSync } from "node:fs"

interface DocSection {
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
 *
 * @example
 * ```ts
 * import { test } from '@playwright/test';
 * import Test2DocReporter from 'test2doc-playwright';
 *
 * test.use({ reporter: new Test2DocReporter() });
 * ```
 */
class Test2DocReporter implements Reporter {
  private docs: Map<string, DocSection> = new Map()
  private outputDir: string

  constructor(options: Test2DocReporterOptions = { outputDir: "./docs" }) {
    this.outputDir = options.outputDir || "./docs"
  }

  onBegin(config: FullConfig, suite: Suite) {
    this.docs.clear()
  }

  onTestBegin(test: TestCase, result: TestResult) {
    console.log(`Starting test ${test.title}`, result.status)
    this.docs.set(test.id, {
      title: test.title,
      steps: [],
    })
  }

  onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
    const docSection = this.docs.get(test.id)
    if (docSection) {
      docSection.steps.push({ title: step.title })
    } else {
      console.warn(`No documentation section found for test ${test.id}`)
    }
  }

  onEnd(result: FullResult) {
    this.docs.forEach((section, id) => {
      const docContent = `# ${section.title}\n\n${section.steps
        .map((step) => `- ${step.title}`)
        .join("\n")}\n`

      const filePath = `${this.outputDir}/${id}.md`
      writeFileSync(filePath, docContent)
      console.log(`Documentation for test ${id} written to ${filePath}`)
    })
  }
}

export default Test2DocReporter
