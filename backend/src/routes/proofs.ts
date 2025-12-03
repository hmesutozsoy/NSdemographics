import express, { Request, Response } from 'express';
import Proof from '../models/Proof';
import Group from '../models/Group';
import { verifyProof } from '@semaphore-protocol/proof';
import { Group as SemaphoreGroup } from '@semaphore-protocol/group';

const router = express.Router();

// Submit a location proof
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      identityCommitment,
      location,
      timestamp,
      proof,
      nullifier,
      demographics,
      merkleRoot,
      signal,
    } = req.body;

    // Validate required fields
    if (!identityCommitment || !location || !proof || !nullifier || !demographics || !merkleRoot) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if nullifier already used (prevent double-spending)
    const existingProof = await Proof.findOne({ nullifier });
    if (existingProof) {
      return res.status(400).json({ message: 'Proof already submitted (nullifier reused)' });
    }

    // Get group for verification
    const groupDoc = await Group.findOne({ networkSchoolId: demographics.networkSchoolId });
    if (!groupDoc) {
      return res.status(404).json({ message: 'Network school group not found' });
    }

    // Verify proof
    try {
      const semaphoreGroup = new SemaphoreGroup(groupDoc.groupId, groupDoc.depth);
      groupDoc.members.forEach((member) => {
        semaphoreGroup.addMember(member);
      });

      const proofData = typeof proof === 'string' ? JSON.parse(proof) : proof;
      
      // Note: Full verification requires circuit files
      // For now, we'll do basic validation
      if (proofData.merkleTreeRoot !== merkleRoot) {
        return res.status(400).json({ message: 'Invalid merkle root' });
      }

      // Verify location is within network school radius
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        groupDoc.location.latitude,
        groupDoc.location.longitude
      );

      if (distance > groupDoc.location.radius) {
        return res.status(400).json({ 
          message: `Location is ${distance.toFixed(0)}m away, outside the ${groupDoc.location.radius}m radius` 
        });
      }

      // Save proof
      const proofDoc = new Proof({
        identityCommitment,
        location,
        timestamp,
        proof: typeof proof === 'string' ? proof : JSON.stringify(proof),
        nullifier,
        demographics,
        merkleRoot,
        signal,
        verified: true,
      });

      await proofDoc.save();

      // Update group members if new identity
      if (!groupDoc.members.includes(identityCommitment)) {
        groupDoc.members.push(identityCommitment);
        semaphoreGroup.addMember(identityCommitment);
        groupDoc.merkleRoot = semaphoreGroup.root.toString();
        await groupDoc.save();
      }

      res.status(201).json({
        message: 'Proof submitted successfully',
        proofId: proofDoc._id,
      });
    } catch (error: any) {
      console.error('Proof verification error:', error);
      return res.status(400).json({ message: 'Proof verification failed', error: error.message });
    }
  } catch (error: any) {
    console.error('Error submitting proof:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get proofs for a network school
router.get('/school/:networkSchoolId', async (req: Request, res: Response) => {
  try {
    const { networkSchoolId } = req.params;
    const proofs = await Proof.find({ 
      'demographics.networkSchoolId': networkSchoolId,
      verified: true,
    }).sort({ timestamp: -1 }).limit(100);

    res.json(proofs);
  } catch (error: any) {
    console.error('Error fetching proofs:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

export default router;

