import { Router } from 'express';
import {
  createGroup,
  getGroups,
  getGroup,
  addMemberToGroup,
} from '../controllers/groupController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, createGroup);
router.get('/', authMiddleware, getGroups);
router.get('/:groupId', authMiddleware, getGroup);
router.post('/:groupId/members', authMiddleware, addMemberToGroup);

export default router;
