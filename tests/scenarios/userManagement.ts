import api from '../utils/apiClient.js';
import { TestValidator } from '../utils/testValidator.js';
import { setUserEmails } from '../utils/testState.js';
import testUsers from '../fixtures/testUsers.json' assert { type: 'json' };

export async function testUserManagement() {
  const validator = new TestValidator();
  validator.startTest();

  try {
    console.log('\n🧪 Testing User Management...');
    
    // Generate unique emails based on timestamp to avoid conflicts
    const timestamp = Date.now();
    const user1 = { ...testUsers.users[0], email: `alice-${timestamp}@test.com` };
    const user2 = { ...testUsers.users[1], email: `bob-${timestamp}@test.com` };
    const user3 = { ...testUsers.users[2], email: `charlie-${timestamp}@test.com` };
    
    // Save emails for use in other tests
    setUserEmails(user1.email, user2.email, user3.email);

    // Test 1: Register User 1
    console.log('  [1/3] Registering Alice...');
    const registerResult1 = await api.register(user1.email, user1.password, user1.name);
    validator.assertTrue(registerResult1.success, 'User 1 (Alice) registration');

    // Test 2: Register User 2
    console.log('  [2/3] Registering Bob...');
    const registerResult2 = await api.register(user2.email, user2.password, user2.name);
    validator.assertTrue(registerResult2.success, 'User 2 (Bob) registration');

    // Test 3: Register User 3
    console.log('  [3/3] Registering Charlie...');
    const registerResult3 = await api.register(user3.email, user3.password, user3.name);
    validator.assertTrue(registerResult3.success, 'User 3 (Charlie) registration');

    // Test 4: Login all users
    console.log('  [4/6] Logging in Alice...');
    const loginResult1 = await api.login(user1.email, user1.password, 'user1');
    validator.assertTrue(loginResult1.success, 'Alice login');
    validator.assertExists(loginResult1.token, 'Alice token exists');

    console.log('  [5/6] Logging in Bob...');
    const loginResult2 = await api.login(user2.email, user2.password, 'user2');
    validator.assertTrue(loginResult2.success, 'Bob login');

    console.log('  [6/6] Logging in Charlie...');
    const loginResult3 = await api.login(user3.email, user3.password, 'user3');
    validator.assertTrue(loginResult3.success, 'Charlie login');

    // Test 5: Verify user profiles
    console.log('  [7/9] Verifying Alice profile...');
    const userResult1 = await api.getUser('user1');
    validator.assertTrue(userResult1.success, 'Get Alice profile');
    validator.assertEqual(userResult1.data?.email, user1.email, 'Alice email matches');

    console.log('  [8/9] Verifying Bob profile...');
    const userResult2 = await api.getUser('user2');
    validator.assertTrue(userResult2.success, 'Get Bob profile');

    console.log('  [9/9] Verifying Charlie profile...');
    const userResult3 = await api.getUser('user3');
    validator.assertTrue(userResult3.success, 'Get Charlie profile');

    return validator.getResults('User Management');
  } catch (error: any) {
    return validator.getResults('User Management', error.message);
  }
}
