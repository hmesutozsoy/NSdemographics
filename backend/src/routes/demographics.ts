import express, { Request, Response } from 'express';
import Proof from '../models/Proof';
import { AggregatedDemographics } from '../../shared/types';

const router = express.Router();

// Generate mock demographic data
function generateMockData(networkSchoolId?: string): AggregatedDemographics {
  const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
  const genders = ['male', 'female', 'non-binary', 'prefer_not_to_say'];
  
  const ageDistribution: Record<string, number> = {};
  const genderDistribution: Record<string, number> = {};
  
  // Generate realistic age distribution (more young people)
  ageRanges.forEach((range, index) => {
    const baseCount = [45, 35, 25, 15, 8, 5][index];
    const variance = Math.floor(Math.random() * 10) - 5;
    ageDistribution[range] = Math.max(5, baseCount + variance);
  });
  
  // Generate gender distribution
  genders.forEach((gender, index) => {
    const baseCount = [40, 35, 10, 15][index];
    const variance = Math.floor(Math.random() * 8) - 4;
    genderDistribution[gender] = Math.max(3, baseCount + variance);
  });
  
  // Generate location distribution (multiple clusters)
  const locationDistribution = [
    {
      center: { latitude: 40.7128 + (Math.random() - 0.5) * 0.1, longitude: -74.0060 + (Math.random() - 0.5) * 0.1 },
      radius: 500,
      memberCount: Math.floor(Math.random() * 30) + 20,
    },
    {
      center: { latitude: 40.7580 + (Math.random() - 0.5) * 0.1, longitude: -73.9855 + (Math.random() - 0.5) * 0.1 },
      radius: 300,
      memberCount: Math.floor(Math.random() * 25) + 15,
    },
    {
      center: { latitude: 40.7505 + (Math.random() - 0.5) * 0.1, longitude: -73.9934 + (Math.random() - 0.5) * 0.1 },
      radius: 400,
      memberCount: Math.floor(Math.random() * 20) + 10,
    },
  ];
  
  const totalMembers = Object.values(ageDistribution).reduce((sum, count) => sum + count, 0);
  
  return {
    networkSchoolId: networkSchoolId || 'all',
    totalMembers,
    ageDistribution,
    genderDistribution,
    locationDistribution,
    lastUpdated: Date.now(),
  };
}

// Get aggregated demographics for a network school
router.get('/:networkSchoolId?', async (req: Request, res: Response) => {
  try {
    const { networkSchoolId } = req.params;
    const query = networkSchoolId 
      ? { 'demographics.networkSchoolId': networkSchoolId, verified: true }
      : { verified: true };

    const proofs = await Proof.find(query);

    // Return mock data if no real data exists (for demo purposes)
    if (proofs.length === 0) {
      return res.json(generateMockData(networkSchoolId));
    }

    // Aggregate demographics
    const ageDistribution: Record<string, number> = {};
    const genderDistribution: Record<string, number> = {};
    const locationMap = new Map<string, { center: { lat: number; lng: number }; count: number }>();
    const uniqueMembers = new Set<string>();

    proofs.forEach((proof) => {
      // Count unique members
      uniqueMembers.add(proof.identityCommitment);

      // Age distribution
      const ageRange = proof.demographics.ageRange;
      ageDistribution[ageRange] = (ageDistribution[ageRange] || 0) + 1;

      // Gender distribution
      const gender = proof.demographics.gender || 'prefer_not_to_say';
      genderDistribution[gender] = (genderDistribution[gender] || 0) + 1;

      // Location distribution (group by approximate location)
      const locKey = `${Math.round(proof.location.latitude * 1000)},${Math.round(proof.location.longitude * 1000)}`;
      if (!locationMap.has(locKey)) {
        locationMap.set(locKey, {
          center: {
            lat: proof.location.latitude,
            lng: proof.location.longitude,
          },
          count: 0,
        });
      }
      const loc = locationMap.get(locKey)!;
      loc.count += 1;
    });

    // Convert location map to array
    const locationDistribution = Array.from(locationMap.values()).map((loc) => ({
      center: {
        latitude: loc.center.lat,
        longitude: loc.center.lng,
      },
      radius: 100, // Approximate radius in meters
      memberCount: loc.count,
    }));

    const aggregated: AggregatedDemographics = {
      networkSchoolId: networkSchoolId || 'all',
      totalMembers: uniqueMembers.size,
      ageDistribution,
      genderDistribution,
      locationDistribution,
      lastUpdated: Date.now(),
    };

    res.json(aggregated);
  } catch (error: any) {
    console.error('Error aggregating demographics:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

export default router;

