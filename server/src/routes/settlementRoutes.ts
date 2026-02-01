import { Router } from 'express';
import {
  settlePayment,
  getSettlements,
  calculateBalance,
} from '../controllers/settlementController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, settlePayment);
router.get('/group/:groupId', authMiddleware, getSettlements);
router.get('/balance/:groupId', authMiddleware, calculateBalance);

export default router;
