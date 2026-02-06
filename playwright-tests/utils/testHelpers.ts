export function generateTestData() {
  const timestamp = Date.now();
  return {
    user1: {
      email: `alice-${timestamp}@test.com`,
      password: 'Test@123456',
      name: 'Alice Test User',
    },
    user2: {
      email: `bob-${timestamp}@test.com`,
      password: 'Test@123456',
      name: 'Bob Test User',
    },
    user3: {
      email: `charlie-${timestamp}@test.com`,
      password: 'Test@123456',
      name: 'Charlie Test User',
    },
    group: {
      name: `Test Group ${timestamp}`,
      description: 'Test group for expense sharing',
    },
    expenses: [
      {
        description: 'Dinner at Restaurant',
        amount: '150',
        paidBy: 'Alice Test User',
      },
      {
        description: 'Hotel Stay',
        amount: '300',
        paidBy: 'Bob Test User',
      },
      {
        description: 'Gas',
        amount: '60',
        paidBy: 'Charlie Test User',
      },
    ],
  };
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retryAsync<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(delayMs);
    }
  }
  throw new Error('Max retries exceeded');
}
