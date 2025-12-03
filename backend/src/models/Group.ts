import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  groupId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  networkSchoolId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    radius: { type: Number, required: true },
  },
  members: [{
    type: String,
    required: true,
  }],
  merkleRoot: {
    type: String,
    required: true,
  },
  depth: {
    type: Number,
    default: 20,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

GroupSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export interface IGroup extends mongoose.Document {
  groupId: string;
  networkSchoolId: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  members: string[];
  merkleRoot: string;
  depth: number;
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.model<IGroup>('Group', GroupSchema);

