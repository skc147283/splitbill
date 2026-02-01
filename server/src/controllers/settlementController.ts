import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { generateId, runAsync, getAsync, allAsync } from '../utils/helpers.js';

export const settlePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId, toUserId, amount } = req.body;

    if (!groupId || !toUserId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const settlementId = generateId();

    await runAsync(
      'INSERT INTO settlements (id, groupId, fromUserId, toUserId, amount) VALUES (?, ?, ?, ?, ?)',
      [settlementId, groupId, req.userId, toUserId, amount]
    );

    res.status(201).json({ settlementId, groupId, fromUserId: req.userId, toUserId, amount });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record settlement' });
  }
};

export const getSettlements = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;

    const settlements = await allAsync(
      `SELECT s.*, u1.name as fromUserName, u2.name as toUserName 
       FROM settlements s 
       LEFT JOIN users u1 ON s.fromUserId = u1.id 
       LEFT JOIN users u2 ON s.toUserId = u2.id 
       WHERE s.groupId = ? 
       ORDER BY s.settledAt DESC`,
      [groupId]
    );

    res.json(settlements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settlements' });
  }
};

export const calculateBalance = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;

    // Get all expenses in the group
    const expenses = await allAsync(
      'SELECT * FROM expenses WHERE groupId = ?',
      [groupId]
    );

    // Calculate who owes whom
    const balances: { [key: string]: number } = {};

    for (const expense of expenses) {
      const splits = await allAsync(
        'SELECT userId, amount FROM expense_splits WHERE expenseId = ?',
        [expense.id]
      );

      for (const split of splits) {
        const key = `${split.userId}-${expense.paidBy}`;
        balances[key] = (balances[key] || 0) + (expense.amount - split.amount);
      }
    }

    // Get all settlements in the group
    const settlements = await allAsync(
      'SELECT fromUserId, toUserId, amount FROM settlements WHERE groupId = ?',
      [groupId]
    );

    for (const settlement of settlements) {
      const key = `${settlement.fromUserId}-${settlement.toUserId}`;
      balances[key] = (balances[key] || 0) - settlement.amount;
    }

    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate balance' });
  }
};
