import api from '../utils/apiClient.js';
import { TestValidator } from '../utils/testValidator.js';
import { testState } from '../utils/testState.js';
import testExpenses from '../fixtures/testExpenses.json' assert { type: 'json' };

export async function testExpenseTracking() {
  const validator = new TestValidator();
  validator.startTest();

  try {
    const groupId = testState.groupId;
    if (!groupId) throw new Error('Group ID not set');

    console.log('\n🧪 Testing Expense Tracking...');

    // Test 1: Add first expense (Restaurant)
    console.log('  [1/4] Adding Restaurant Dinner expense...');
    const expense1 = testExpenses.expenses[0];
    const addExpense1Result = await api.addExpense(
      groupId,
      expense1.description,
      expense1.amount,
      'user1',
      ['user1', 'user2', 'user3'],
      'user1'
    );
    validator.assertTrue(addExpense1Result.success, 'Add Restaurant expense');
    validator.assertExists(addExpense1Result.data?.id, 'Expense 1 ID exists');

    // Test 2: Add second expense (Hotel)
    console.log('  [2/4] Adding Hotel Stay expense...');
    const expense2 = testExpenses.expenses[1];
    const addExpense2Result = await api.addExpense(
      groupId,
      expense2.description,
      expense2.amount,
      'user2',
      ['user1', 'user2', 'user3'],
      'user1'
    );
    validator.assertTrue(addExpense2Result.success, 'Add Hotel expense');
    validator.assertExists(addExpense2Result.data?.id, 'Expense 2 ID exists');

    // Test 3: Add third expense (Gas)
    console.log('  [3/4] Adding Gas expense...');
    const expense3 = testExpenses.expenses[2];
    const addExpense3Result = await api.addExpense(
      groupId,
      expense3.description,
      expense3.amount,
      'user3',
      ['user1', 'user2'],
      'user1'
    );
    validator.assertTrue(addExpense3Result.success, 'Add Gas expense');

    // Test 4: Get all expenses
    console.log('  [4/4] Fetching all expenses...');
    const getExpensesResult = await api.getExpenses(groupId, 'user1');
    validator.assertTrue(getExpensesResult.success, 'Get expenses list');
    validator.assertTrue(Array.isArray(getExpensesResult.data), 'Expenses is an array');
    validator.assertGreaterThan(getExpensesResult.data?.length || 0, 2, 'At least 3 expenses created');

    return validator.getResults('Expense Tracking');
  } catch (error: any) {
    return validator.getResults('Expense Tracking', error.message);
  }
}
