import api from '../utils/apiClient.js';
import { TestValidator } from '../utils/testValidator.js';
import { testState, setGroupId } from '../utils/testState.js';
import testGroups from '../fixtures/testGroups.json' assert { type: 'json' };

export async function testGroupManagement() {
  const validator = new TestValidator();
  validator.startTest();

  try {
    console.log('\n🧪 Testing Group Management...');

    // Test 1: Create first group
    console.log('  [1/4] Creating Trip to Vegas group...');
    const createGroupResult = await api.createGroup(testGroups.groups[0].name, 'user1');
    validator.assertTrue(createGroupResult.success, 'Group creation');
    validator.assertExists(createGroupResult.data?.id, 'Group ID exists');
    const groupId = createGroupResult.data?.id;

    if (!groupId) throw new Error('Group ID is missing');
    setGroupId(groupId);

    // Test 2: Get groups list
    console.log('  [2/4] Fetching groups for Alice...');
    const getGroupsResult = await api.getGroups('user1');
    validator.assertTrue(getGroupsResult.success, 'Get groups list');
    validator.assertTrue(Array.isArray(getGroupsResult.data), 'Groups is an array');

    // Test 3: Add members to group
    console.log('  [3/4] Adding Bob to the group...');
    const addBobResult = await api.addGroupMember(groupId, testState.user2Email, 'user1');
    validator.assertTrue(addBobResult.success, 'Add Bob to group');

    console.log('  [4/4] Adding Charlie to the group...');
    const addCharlieResult = await api.addGroupMember(groupId, testState.user3Email, 'user1');
    validator.assertTrue(addCharlieResult.success, 'Add Charlie to group');

    // Test 4: Get group details
    console.log('  [5/5] Getting group details...');
    const groupDetailsResult = await api.getGroupDetails(groupId, 'user1');
    validator.assertTrue(groupDetailsResult.success, 'Get group details');
    validator.assertExists(groupDetailsResult.data?.members, 'Group has members');

    return validator.getResults('Group Management');
  } catch (error: any) {
    return validator.getResults('Group Management', error.message);
  }
}
