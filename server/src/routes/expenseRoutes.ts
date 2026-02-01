import { Router } from 'express';
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, createExpense);
router.get('/group/:groupId', authMiddleware, getExpenses);
router.put('/:expenseId', authMiddleware, updateExpense);
router.delete('/:expenseId', authMiddleware, deleteExpense);

export default router;
