import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../splitbill.db');

export const db = new sqlite3.Database(dbPath);

export const initializeDatabase = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Groups table
      db.run(`
        CREATE TABLE IF NOT EXISTS groups (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          createdBy TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (createdBy) REFERENCES users(id)
        )
      `);

      // Group members table
      db.run(`
        CREATE TABLE IF NOT EXISTS group_members (
          id TEXT PRIMARY KEY,
          groupId TEXT NOT NULL,
          userId TEXT NOT NULL,
          joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (groupId) REFERENCES groups(id),
          FOREIGN KEY (userId) REFERENCES users(id),
          UNIQUE(groupId, userId)
        )
      `);

      // Expenses table
      db.run(`
        CREATE TABLE IF NOT EXISTS expenses (
          id TEXT PRIMARY KEY,
          groupId TEXT NOT NULL,
          description TEXT NOT NULL,
          amount REAL NOT NULL,
          paidBy TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (groupId) REFERENCES groups(id),
          FOREIGN KEY (paidBy) REFERENCES users(id)
        )
      `);

      // Expense splits table
      db.run(`
        CREATE TABLE IF NOT EXISTS expense_splits (
          id TEXT PRIMARY KEY,
          expenseId TEXT NOT NULL,
          userId TEXT NOT NULL,
          amount REAL NOT NULL,
          FOREIGN KEY (expenseId) REFERENCES expenses(id),
          FOREIGN KEY (userId) REFERENCES users(id),
          UNIQUE(expenseId, userId)
        )
      `);

      // Settlements table
      db.run(`
        CREATE TABLE IF NOT EXISTS settlements (
          id TEXT PRIMARY KEY,
          groupId TEXT NOT NULL,
          fromUserId TEXT NOT NULL,
          toUserId TEXT NOT NULL,
          amount REAL NOT NULL,
          settledAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (groupId) REFERENCES groups(id),
          FOREIGN KEY (fromUserId) REFERENCES users(id),
          FOREIGN KEY (toUserId) REFERENCES users(id)
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
};
