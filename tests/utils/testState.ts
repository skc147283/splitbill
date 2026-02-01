// Shared test state
export const testState = {
  user1Email: '',
  user2Email: '',
  user3Email: '',
  user1Id: '',
  user2Id: '',
  user3Id: '',
  groupId: '',
};

export function setUserEmails(user1: string, user2: string, user3: string) {
  testState.user1Email = user1;
  testState.user2Email = user2;
  testState.user3Email = user3;
}

export function setUserIds(user1: string, user2: string, user3: string) {
  testState.user1Id = user1;
  testState.user2Id = user2;
  testState.user3Id = user3;
}

export function setGroupId(id: string) {
  testState.groupId = id;
}
