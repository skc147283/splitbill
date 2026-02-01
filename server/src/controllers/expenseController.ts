import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { generateId, runAsync, getAsync, allAsync } from '../utils/helpers.js';

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId, description, amount, splits } = req.body;

    if (!groupId || !description || !amount || !splits || Object.keys(splits).length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const expenseId = generateId();

    await runAsync(
      'INSERT INTO expenses (id, groupId, description, amount, paidBy) VALUES (?, ?, ?, ?, ?)',
      [expenseId, groupId, description, amount, req.userId]
    );

    for (const [userId, splitAmount] of Object.entries(splits)) {
      const splitId = generateId();
      await runAsync(
        'INSERT INTO expense_splits (id, expenseId, userId, amount) VALUES (?, ?, ?, ?)',
        [splitId, expenseId, userId, splitAmount as number]
      );
    }

    const expense = await getAsync('SELECT * FROM expenses WHERE id = ?', [expenseId]);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;

    const expenses = await allAsync(
      `SELECT e.*, u.name as paidByName FROM expenses e 
       LEFT JOIN users u ON e.paidBy = u.id 
       WHERE e.groupId = ? 
       ORDER BY e.createdAt DESC`,
      [groupId]
    );

    const expensesWithSplits = await Promise.all(
      expenses.map(async (expense) => {
        const splits = await allAsync(
          `SELECT userId, amount FROM expense_splits WHERE expenseId = ?`,
          [expense.id]
        );
        return { ...expense, splits };
      })
    );

    res.json(expensesWithSplits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

export const updateExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { expenseId } = req.params;
    const { description, amount, splits } = req.body;

    const expense = await getAsync('SELECT * FROM expenses WHERE id = ?', [expenseId]);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (description) {
      await runAsync('UPDATE expenses SET description = ? WHERE id = ?', [description, expenseId]);
    }

    if (amount) {
      await runAsync('UPDATE expenses SET amount = ? WHERE id = ?', [amount, expenseId]);
    }

    if (splits) {
      await runAsync('DELETE FROM expense_splits WHERE expenseId = ?', [expenseId]);

      for (const [userId, splitAmount] of Object.entries(splits)) {
        const splitId = generateId();
        await runAsync(
          'INSERT INTO expense_splits (id, expenseId, userId, amount) VALUES (?, ?, ?, ?)',
          [splitId, expenseId, userId, splitAmount as number]
        );
      }
    }

    const updatedExpense = await getAsync('SELECT * FROM expenses WHERE id = ?', [expenseId]);
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { expenseId } = req.params;

    await runAsync('DELETE FROM expense_splits WHERE expenseId = ?', [expenseId]);
    await runAsync('DELETE FROM expenses WHERE id = ?', [expenseId]);

    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};
