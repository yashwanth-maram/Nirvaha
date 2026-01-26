import mongoose, { Schema, Document } from 'mongoose';

export interface ICompanionApplication extends Document {
  name: string;
  email: string;
  specialties: string[];
  experience: string;
  bio: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const CompanionApplicationSchema = new Schema<ICompanionApplication>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    specialties: {
      type: [String],
      required: true,
      default: [],
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICompanionApplication>('CompanionApplication', CompanionApplicationSchema);

