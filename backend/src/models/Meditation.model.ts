import mongoose, { Schema, Document } from 'mongoose';

export interface IMeditation extends Document {
  title: string;
  description: string;
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  type: 'guided' | 'mudra' | 'breathwork';
  mediaUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MeditationSchema = new Schema<IMeditation>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    type: {
      type: String,
      enum: ['guided', 'mudra', 'breathwork'],
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
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

export default mongoose.model<IMeditation>('Meditation', MeditationSchema);

