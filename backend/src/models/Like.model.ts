import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ILike extends Document {
  userId: Types.ObjectId;
  companionId: Types.ObjectId;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    companionId: {
      type: Schema.Types.ObjectId,
      ref: 'Companion',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one like per user per companion
LikeSchema.index({ userId: 1, companionId: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);

