import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
  TestStep,
} from "@playwright/test/reporter"

class MyReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    console.log(
      `Starting the run with ${suite.allTests().length} tests`,
      config.version,
    )
  }

  onTestBegin(test: TestCase, result: TestResult) {
    console.log(`Starting test ${test.title}`, result.status)
  }

  onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
    console.log(`Starting step ${step.title} in test ${test.title}`)
  }

  onStepEnd(test: TestCase, result: TestResult, step: TestStep): void {
    console.log(`Finished step ${step.title} in test ${test.title}`)
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Finished test ${test.title}: ${result.status}`)
  }

  onEnd(result: FullResult) {
    console.log(`Finished the run: ${result.status}`)
  }
}

export default MyReporter
