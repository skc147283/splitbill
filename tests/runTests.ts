#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { testUserManagement } from './scenarios/userManagement.js';
import { testGroupManagement } from './scenarios/groupManagement.js';
import { testExpenseTracking } from './scenarios/expenseTracking.js';
import { testSettlement } from './scenarios/settlement.js';
import { TestReporter } from './utils/testValidator.js';
import api from './utils/apiClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runAllTests() {
  const reporter = new TestReporter();

  console.log('═════════════════════════════════════════════════════════════════');
  console.log('                   SPLITBILL TEST AUTOMATION                       ');
  console.log('═════════════════════════════════════════════════════════════════');
  console.log(`API URL: ${process.env.API_URL || 'https://splitbill-api2.onrender.com/api'}`);
  console.log(`Start Time: ${new Date().toISOString()}`);

  try {
    // Test 1: User Management
    console.log('\n📋 Test Suite 1: User Management');
    console.log('─────────────────────────────────────────────────────────────────');
    const userResult = await testUserManagement();
    reporter.addResult(userResult);
    console.log(`✓ ${userResult.status.toUpperCase()}: ${userResult.assertions.filter(a => a.passed).length}/${userResult.assertions.length} assertions passed`);

    // Test 2: Group Management
    console.log('\n📋 Test Suite 2: Group Management');
    console.log('─────────────────────────────────────────────────────────────────');
    const groupResult = await testGroupManagement();
    reporter.addResult(groupResult);
    console.log(`✓ ${groupResult.status.toUpperCase()}: ${groupResult.assertions.filter(a => a.passed).length}/${groupResult.assertions.length} assertions passed`);

    // Test 3: Expense Tracking
    console.log('\n📋 Test Suite 3: Expense Tracking');
    console.log('─────────────────────────────────────────────────────────────────');
    const expenseResult = await testExpenseTracking();
    reporter.addResult(expenseResult);
    console.log(`✓ ${expenseResult.status.toUpperCase()}: ${expenseResult.assertions.filter(a => a.passed).length}/${expenseResult.assertions.length} assertions passed`);

    // Test 4: Settlement
    console.log('\n📋 Test Suite 4: Settlement & Balance');
    console.log('─────────────────────────────────────────────────────────────────');
    const settlementResult = await testSettlement();
    reporter.addResult(settlementResult);
    console.log(`✓ ${settlementResult.status.toUpperCase()}: ${settlementResult.assertions.filter(a => a.passed).length}/${settlementResult.assertions.length} assertions passed`);

    // Generate and save report
    console.log('\n');
    const report = reporter.printReport();

    // Save report to file
    const reportPath = path.join(__dirname, 'reports', `test-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📊 Report saved to: ${reportPath}`);

    // Save summary to reports.log
    const summaryPath = path.join(__dirname, 'reports', 'reports.log');
    const summary = `[${new Date().toISOString()}] Tests: ${report.summary.totalTests} | Passed: ${report.summary.passedTests} | Failed: ${report.summary.failedTests} | Success Rate: ${report.summary.successRate}\n`;
    fs.appendFileSync(summaryPath, summary);

    process.exit(report.summary.failedTests > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
}

runAllTests();
