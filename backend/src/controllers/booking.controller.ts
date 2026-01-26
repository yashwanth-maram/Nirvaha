import { Request, Response } from 'express';
import Booking from '../models/Booking.model';
import Companion from '../models/Companion.model';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

// POST /api/bookings
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const { companionId, type, platform, startDateTime } = req.body;

    // Validate companion exists
    if (!Types.ObjectId.isValid(companionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid companion ID',
      });
    }

    const companion = await Companion.findById(companionId);
    if (!companion) {
      return res.status(404).json({
        success: false,
        message: 'Companion not found',
      });
    }

    // Validate companion is approved
    if (companion.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Companion is not approved for bookings',
      });
    }

    // Validate companion availability
    if (!companion.availability) {
      return res.status(400).json({
        success: false,
        message: 'Companion is not available',
      });
    }

    // Validate startDateTime
    const bookingDateTime = new Date(startDateTime);
    if (isNaN(bookingDateTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid startDateTime format',
      });
    }

    // Check if booking is in the past
    if (bookingDateTime < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book in the past',
      });
    }

    // Check for overlapping bookings (prevent bookings within 1 hour of each other)
    // Assuming bookings are typically 1 hour long
    const oneHourBefore = new Date(bookingDateTime.getTime() - 60 * 60 * 1000);
    const oneHourAfter = new Date(bookingDateTime.getTime() + 60 * 60 * 1000);

    const overlappingBooking = await Booking.findOne({
      companionId: new Types.ObjectId(companionId),
      startDateTime: {
        $gte: oneHourBefore,
        $lte: oneHourAfter,
      },
      status: {
        $in: ['requested', 'confirmed', 'ongoing'],
      },
    });

    if (overlappingBooking) {
      return res.status(409).json({
        success: false,
        message: 'Time slot is already booked or overlaps with an existing booking',
      });
    }

    // Create booking
    const booking = await Booking.create({
      userId: new Types.ObjectId(userId),
      companionId: new Types.ObjectId(companionId),
      companionName: companion.name,
      type,
      platform,
      startDateTime: bookingDateTime,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        id: booking._id.toString(),
        companionId: booking.companionId.toString(),
        companionName: booking.companionName,
        type: booking.type,
        platform: booking.platform,
        startDateTime: booking.startDateTime.toISOString(),
        status: booking.status,
        createdAt: booking.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Booking already exists for this time slot',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking',
    });
  }
};

// GET /api/users/me/bookings
export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const bookings = await Booking.find({
      userId: new Types.ObjectId(userId),
    })
      .sort({ startDateTime: -1 })
      .populate('companionId', 'name title avatar');

    const formattedBookings = bookings.map((booking) => ({
      id: booking._id.toString(),
      companionId: booking.companionId.toString(),
      companionName: booking.companionName,
      type: booking.type,
      platform: booking.platform,
      startDateTime: booking.startDateTime.toISOString(),
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));

    res.status(200).json({
      success: true,
      data: formattedBookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch bookings',
    });
  }
};

// GET /api/companions/me/bookings
export const getCompanionBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Find companion by userId (assuming companion has userId reference)
    // For now, we'll use companionId from bookings - companions can only see bookings for their companion profile
    // This assumes the companion's profile ID matches their user ID or we need to link them
    // For simplicity, we'll fetch bookings where companionId matches a companion profile
    // In a real system, you'd have a User-Companion relationship
    
    // Alternative: If companion has a userId field, use that
    // For now, we'll need to get companionId from the user's companion profile
    // This is a simplified approach - in production, you'd have proper linking
    
    // Since we don't have a direct link, we'll need to find the companion by some identifier
    // For now, let's assume companions can query by their companion profile ID
    // This would require passing companionId as query param or having it in the user model
    
    // For MVP, let's return all bookings and let frontend filter, or add companionId to query
    const { companionId } = req.query;

    if (!companionId || !Types.ObjectId.isValid(companionId as string)) {
      return res.status(400).json({
        success: false,
        message: 'Companion ID is required',
      });
    }

    // Verify the companion exists and is linked to this user (if you have that relationship)
    // For now, we'll just fetch bookings for the companionId
    const bookings = await Booking.find({
      companionId: new Types.ObjectId(companionId as string),
    })
      .populate('userId', 'name email')
      .sort({ startDateTime: -1 });

    const formattedBookings = bookings.map((booking) => ({
      id: booking._id.toString(),
      userId: booking.userId.toString(),
      user: booking.userId
        ? {
            id: (booking.userId as any)._id?.toString() || booking.userId.toString(),
            name: (booking.userId as any).name || 'N/A',
            email: (booking.userId as any).email || 'N/A',
          }
        : null,
      companionId: booking.companionId.toString(),
      companionName: booking.companionName,
      type: booking.type,
      platform: booking.platform,
      startDateTime: booking.startDateTime.toISOString(),
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    }));

    res.status(200).json({
      success: true,
      data: formattedBookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch companion bookings',
    });
  }
};

// PATCH /api/bookings/:id/confirm
export const confirmBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.status !== 'requested') {
      return res.status(400).json({
        success: false,
        message: 'Only requested bookings can be confirmed',
      });
    }

    booking.status = 'confirmed';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: {
        id: booking._id.toString(),
        status: booking.status,
        updatedAt: booking.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to confirm booking',
    });
  }
};

// PATCH /api/bookings/:id/complete
export const completeBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (!['confirmed', 'ongoing'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Only confirmed or ongoing bookings can be completed',
      });
    }

    booking.status = 'completed';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking completed successfully',
      data: {
        id: booking._id.toString(),
        status: booking.status,
        updatedAt: booking.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete booking',
    });
  }
};

// DELETE /api/bookings/:id (cancel booking - user only)
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID',
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify booking belongs to user
    if (booking.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        id: booking._id.toString(),
        status: booking.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel booking',
    });
  }
};

