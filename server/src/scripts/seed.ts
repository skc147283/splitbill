import { generateId, hashPassword, runAsync } from '../utils/helpers.js';

const seedDatabase = async () => {
  try {
    const user1Id = generateId();
    const user2Id = generateId();
    const user3Id = generateId();

    // Create sample users
    const password = await hashPassword('password123');

    await runAsync(
      'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
      [user1Id, 'john@example.com', password, 'John Doe']
    );

    await runAsync(
      'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
      [user2Id, 'jane@example.com', password, 'Jane Smith']
    );

    await runAsync(
      'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
      [user3Id, 'bob@example.com', password, 'Bob Johnson']
    );

    // Create a sample group
    const groupId = generateId();
    await runAsync(
      'INSERT INTO groups (id, name, createdBy) VALUES (?, ?, ?)',
      [groupId, 'Vacation Trip', user1Id]
    );

    // Add members to group
    await runAsync(
      'INSERT INTO group_members (id, groupId, userId) VALUES (?, ?, ?)',
      [generateId(), groupId, user1Id]
    );

    await runAsync(
      'INSERT INTO group_members (id, groupId, userId) VALUES (?, ?, ?)',
      [generateId(), groupId, user2Id]
    );

    await runAsync(
      'INSERT INTO group_members (id, groupId, userId) VALUES (?, ?, ?)',
      [generateId(), groupId, user3Id]
    );

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase();
