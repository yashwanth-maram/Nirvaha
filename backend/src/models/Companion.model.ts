import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICompanion extends Document {
  name: string;
  title: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviews: number;
  sessions: number;
  location: string;
  languages: string[];
  specialties: string[];
  bio: string;
  hourlyRate: number;
  callRate: number;
  availability: boolean;
  responseTime: string;
  color: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CompanionSchema = new Schema<ICompanion>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    sessions: {
      type: Number,
      default: 0,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    languages: {
      type: [String],
      required: true,
      default: [],
    },
    specialties: {
      type: [String],
      required: true,
      default: [],
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    callRate: {
      type: Number,
      required: true,
      min: 0,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    responseTime: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
      index: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICompanion>('Companion', CompanionSchema);

