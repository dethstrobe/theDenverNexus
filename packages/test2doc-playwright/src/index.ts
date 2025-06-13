import type {
  FullConfig, FullResult, Reporter, Suite, TestCase, TestResult
} from '@playwright/test/reporter';

class MyReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`, config.version);
  }

  onTestBegin(test: TestCase, result: TestResult) {
    console.log(`Starting test ${test.title}`, result.status);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Finished test ${test.title}: ${result.status}`);
  }

  onEnd(result: FullResult) {
    console.log(`Finished the run: ${result.status}`);
  }
}

export default MyReporter;