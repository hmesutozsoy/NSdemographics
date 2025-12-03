import express, { Request, Response } from 'express';
import Group from '../models/Group';
import { Group as SemaphoreGroup } from '@semaphore-protocol/group';

const router = express.Router();

// Get group info by network school ID
router.get('/:networkSchoolId', async (req: Request, res: Response) => {
  try {
    const { networkSchoolId } = req.params;
    const group = await Group.findOne({ networkSchoolId });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json({
      groupId: group.groupId,
      networkSchoolId: group.networkSchoolId,
      name: group.name,
      members: group.members,
      merkleRoot: group.merkleRoot,
      depth: group.depth,
    });
  } catch (error: any) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Create a new group
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      networkSchoolId,
      name,
      location,
      depth = 20,
    } = req.body;

    if (!networkSchoolId || !name || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if group already exists
    const existingGroup = await Group.findOne({ networkSchoolId });
    if (existingGroup) {
      return res.status(400).json({ message: 'Group already exists' });
    }

    // Create Semaphore group
    const groupId = `group_${networkSchoolId}_${Date.now()}`;
    const semaphoreGroup = new SemaphoreGroup(groupId, depth);
    const merkleRoot = semaphoreGroup.root.toString();

    // Create group document
    const group = new Group({
      groupId,
      networkSchoolId,
      name,
      location,
      members: [],
      merkleRoot,
      depth,
    });

    await group.save();

    res.status(201).json({
      message: 'Group created successfully',
      group: {
        groupId: group.groupId,
        networkSchoolId: group.networkSchoolId,
        name: group.name,
        merkleRoot: group.merkleRoot,
      },
    });
  } catch (error: any) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// List all groups
router.get('/', async (req: Request, res: Response) => {
  try {
    const groups = await Group.find().select('groupId networkSchoolId name location createdAt');
    res.json(groups);
  } catch (error: any) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

export default router;

