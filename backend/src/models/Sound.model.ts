import mongoose, { Schema, Document } from 'mongoose';

export interface ISound extends Document {
  title: string;
  frequency: number; // Hz
  category: string;
  duration: number; // in minutes
  audioUrl: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SoundSchema = new Schema<ISound>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    frequency: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISound>('Sound', SoundSchema);

