import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { generateId, runAsync, getAsync, allAsync } from '../utils/helpers.js';

export const createGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Group name is required' });
    }

    const groupId = generateId();

    await runAsync('INSERT INTO groups (id, name, createdBy) VALUES (?, ?, ?)', [groupId, name, req.userId]);

    await runAsync('INSERT INTO group_members (id, groupId, userId) VALUES (?, ?, ?)', [generateId(), groupId, req.userId]);

    const group = await getAsync('SELECT * FROM groups WHERE id = ?', [groupId]);
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
};

export const getGroups = async (req: AuthRequest, res: Response) => {
  try {
    const groups = await allAsync(
      `SELECT DISTINCT g.* FROM groups g 
       INNER JOIN group_members gm ON g.id = gm.groupId 
       WHERE gm.userId = ? 
       ORDER BY g.createdAt DESC`,
      [req.userId]
    );

    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

export const getGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;

    const group = await getAsync('SELECT * FROM groups WHERE id = ?', [groupId]);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const members = await allAsync(
      `SELECT u.id, u.name, u.email FROM users u 
       INNER JOIN group_members gm ON u.id = gm.userId 
       WHERE gm.groupId = ?`,
      [groupId]
    );

    res.json({ ...group, members });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group' });
  }
};

export const addMemberToGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await getAsync('SELECT id FROM users WHERE email = ?', [email]);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingMember = await getAsync(
      'SELECT id FROM group_members WHERE groupId = ? AND userId = ?',
      [groupId, user.id]
    );

    if (existingMember) {
      return res.status(400).json({ error: 'User is already a member of this group' });
    }

    const memberId = generateId();
    await runAsync('INSERT INTO group_members (id, groupId, userId) VALUES (?, ?, ?)', [memberId, groupId, user.id]);

    res.status(201).json({ id: memberId, groupId, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add member' });
  }
};
