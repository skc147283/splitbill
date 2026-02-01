export interface TestAssertion {
  name: string;
  passed: boolean;
  message?: string;
  expected?: any;
  actual?: any;
}

export interface TestResult {
  testName: string;
  status: 'passed' | 'failed';
  assertions: TestAssertion[];
  duration: number;
  error?: string;
}

export class TestValidator {
  private assertions: TestAssertion[] = [];
  private startTime: number = 0;

  startTest() {
    this.startTime = Date.now();
  }

  assertEqual(actual: any, expected: any, message: string) {
    const passed = JSON.stringify(actual) === JSON.stringify(expected);
    this.assertions.push({
      name: message,
      passed,
      ...((!passed) && { expected, actual }),
    });
    return passed;
  }

  assertTrue(condition: boolean, message: string) {
    this.assertions.push({
      name: message,
      passed: condition,
    });
    return condition;
  }

  assertFalse(condition: boolean, message: string) {
    this.assertions.push({
      name: message,
      passed: !condition,
    });
    return !condition;
  }

  assertExists(value: any, message: string) {
    const passed = value !== null && value !== undefined;
    this.assertions.push({
      name: message,
      passed,
    });
    return passed;
  }

  assertContains(array: any[], value: any, message: string) {
    const passed = array.includes(value);
    this.assertions.push({
      name: message,
      passed,
      ...((!passed) && { expected: value, actual: array }),
    });
    return passed;
  }

  assertGreaterThan(actual: number, expected: number, message: string) {
    const passed = actual > expected;
    this.assertions.push({
      name: message,
      passed,
      ...((!passed) && { expected: `> ${expected}`, actual }),
    });
    return passed;
  }

  getResults(testName: string, error?: string): TestResult {
    return {
      testName,
      status: this.assertions.every(a => a.passed) ? 'passed' : 'failed',
      assertions: this.assertions,
      duration: Date.now() - this.startTime,
      error,
    };
  }
}

export class TestReporter {
  private results: TestResult[] = [];

  addResult(result: TestResult) {
    this.results.push(result);
  }

  generateReport() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'passed').length;
    const failedTests = totalTests - passedTests;
    const totalAssertions = this.results.reduce((sum, r) => sum + r.assertions.length, 0);
    const passedAssertions = this.results.reduce(
      (sum, r) => sum + r.assertions.filter(a => a.passed).length,
      0
    );
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    return {
      summary: {
        totalTests,
        passedTests,
        failedTests,
        totalAssertions,
        passedAssertions,
        failedAssertions: totalAssertions - passedAssertions,
        successRate: `${((passedTests / totalTests) * 100).toFixed(2)}%`,
        totalDuration: `${totalDuration}ms`,
      },
      results: this.results,
    };
  }

  printReport() {
    const report = this.generateReport();
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                      TEST REPORT SUMMARY                       ');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`Total Tests:        ${report.summary.totalTests}`);
    console.log(`Passed:             ${report.summary.passedTests} ✓`);
    console.log(`Failed:             ${report.summary.failedTests} ✗`);
    console.log(`Success Rate:       ${report.summary.successRate}`);
    console.log(`Total Assertions:   ${report.summary.totalAssertions}`);
    console.log(`Passed Assertions:  ${report.summary.passedAssertions}`);
    console.log(`Failed Assertions:  ${report.summary.failedAssertions}`);
    console.log(`Total Duration:     ${report.summary.totalDuration}`);
    console.log('═══════════════════════════════════════════════════════════════');

    // Print failed tests details
    const failedTests = this.results.filter(r => r.status === 'failed');
    if (failedTests.length > 0) {
      console.log('\nFAILED TESTS:');
      failedTests.forEach(test => {
        console.log(`\n❌ ${test.testName}`);
        if (test.error) console.log(`   Error: ${test.error}`);
        test.assertions.forEach(assertion => {
          if (!assertion.passed) {
            console.log(`   ✗ ${assertion.name}`);
            if (assertion.expected) console.log(`     Expected: ${JSON.stringify(assertion.expected)}`);
            if (assertion.actual) console.log(`     Actual: ${JSON.stringify(assertion.actual)}`);
          }
        });
      });
    }

    return report;
  }
}
