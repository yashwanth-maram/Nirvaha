import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBooking extends Document {
  userId: Types.ObjectId;
  companionId: Types.ObjectId;
  companionName: string;
  type: 'chat' | 'video';
  platform: string;
  startDateTime: Date;
  status: 'requested' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
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
    companionName: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['chat', 'video'],
      required: true,
    },
    platform: {
      type: String,
      required: true,
      trim: true,
    },
    startDateTime: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['requested', 'confirmed', 'ongoing', 'completed', 'cancelled'],
      default: 'requested',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate bookings for same companion and time
BookingSchema.index({ companionId: 1, startDateTime: 1 }, { unique: true });

export default mongoose.model<IBooking>('Booking', BookingSchema);

