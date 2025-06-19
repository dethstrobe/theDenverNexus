import type {
  Reporter,
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

  onBegin() {
    this.docs.clear()
  }

  onTestBegin(test: TestCase) {
    this.docs.set(test.id, {
      title: test.title,
      steps: [],
    })
  }

  onStepBegin(test: TestCase, _result: TestResult, step: TestStep): void {
    const docSection = this.docs.get(test.id)
    if (docSection && step.category === "test.step") {
      docSection.steps.push({ title: step.title })
    } else {
      console.warn(`No documentation section found for test ${test.id}`)
    }
  }

  onEnd() {
    for (const [_, section] of this.docs) {
      const docContent = `# ${section.title}\n\n${section.steps
        .map((step) => `- ${step.title}`)
        .join("\n")}\n`

      const filePath = `${this.outputDir}/${section.title}.md`
      writeFileSync(filePath, docContent)
      console.log(
        `Documentation for test "${section.title}" written to ${filePath}`,
      )
    }
  }
}

export default Test2DocReporter
