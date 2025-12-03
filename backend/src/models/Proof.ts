import mongoose from 'mongoose';
import { DemographicProof } from '../../shared/types';

const ProofSchema = new mongoose.Schema({
  identityCommitment: {
    type: String,
    required: true,
    index: true,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number, required: true },
  },
  timestamp: {
    type: Number,
    required: true,
    index: true,
  },
  proof: {
    type: String,
    required: true,
  },
  nullifier: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  demographics: {
    ageRange: { type: String, required: true },
    gender: { type: String },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      radius: { type: Number, required: true },
    },
    networkSchoolId: { type: String, required: true, index: true },
    timestamp: { type: Number, required: true },
  },
  merkleRoot: {
    type: String,
    required: true,
  },
  signal: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface IProof extends mongoose.Document, Omit<DemographicProof, 'proof'> {
  proof: string;
  verified: boolean;
  createdAt: Date;
}

export default mongoose.model<IProof>('Proof', ProofSchema);

