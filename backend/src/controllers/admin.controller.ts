import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Companion from '../models/Companion.model';
import Booking from '../models/Booking.model';
import Meditation from '../models/Meditation.model';
import Sound from '../models/Sound.model';
import Course from '../models/Course.model';
import Product from '../models/Product.model';
import User from '../models/User.model';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    role?: string;
  };
}

// ============================================
// COMPANION APPROVAL SYSTEM
// ============================================

// GET /api/admin/companions?status=pending
export const getCompanionsAdmin = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const companions = await Companion.find(filter)
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    const formattedCompanions = companions.map((companion) => ({
      id: companion._id.toString(),
      name: companion.name,
      title: companion.title,
      avatar: companion.avatar,
      coverImage: companion.coverImage,
      rating: companion.rating,
      reviews: companion.reviews,
      sessions: companion.sessions,
      location: companion.location,
      languages: companion.languages,
      specialties: companion.specialties,
      bio: companion.bio,
      hourlyRate: companion.hourlyRate,
      callRate: companion.callRate,
      availability: companion.availability,
      responseTime: companion.responseTime,
      color: companion.color,
      status: companion.status,
      approvedBy: companion.approvedBy
        ? {
            id: (companion.approvedBy as any)._id.toString(),
            name: (companion.approvedBy as any).name,
            email: (companion.approvedBy as any).email,
          }
        : null,
      approvedAt: companion.approvedAt?.toISOString() || null,
      createdAt: companion.createdAt.toISOString(),
      updatedAt: companion.updatedAt.toISOString(),
    }));

    res.status(200).json({
      success: true,
      data: formattedCompanions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch companions',
    });
  }
};

// PATCH /api/admin/companions/:id/approve
export const approveCompanion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = req.user?.userId;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid companion ID',
      });
    }

    const companion = await Companion.findById(id);

    if (!companion) {
      return res.status(404).json({
        success: false,
        message: 'Companion not found',
      });
    }

    companion.status = 'approved';
    companion.approvedBy = new Types.ObjectId(adminId);
    companion.approvedAt = new Date();
    await companion.save();

    res.status(200).json({
      success: true,
      message: 'Companion approved successfully',
      data: {
        id: companion._id.toString(),
        status: companion.status,
        approvedAt: companion.approvedAt.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to approve companion',
    });
  }
};

// PATCH /api/admin/companions/:id/reject
export const rejectCompanion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid companion ID',
      });
    }

    const companion = await Companion.findById(id);

    if (!companion) {
      return res.status(404).json({
        success: false,
        message: 'Companion not found',
      });
    }

    companion.status = 'rejected';
    await companion.save();

    res.status(200).json({
      success: true,
      message: 'Companion rejected successfully',
      data: {
        id: companion._id.toString(),
        status: companion.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject companion',
    });
  }
};

// PATCH /api/admin/companions/:id/suspend
export const suspendCompanion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid companion ID',
      });
    }

    const companion = await Companion.findById(id);

    if (!companion) {
      return res.status(404).json({
        success: false,
        message: 'Companion not found',
      });
    }

    companion.status = 'suspended';
    await companion.save();

    res.status(200).json({
      success: true,
      message: 'Companion suspended successfully',
      data: {
        id: companion._id.toString(),
        status: companion.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to suspend companion',
    });
  }
};

// DELETE /api/admin/companions/:id
export const deleteCompanion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid companion ID',
      });
    }

    const companion = await Companion.findByIdAndDelete(id);

    if (!companion) {
      return res.status(404).json({
        success: false,
        message: 'Companion not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Companion deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete companion',
    });
  }
};

// ============================================
// MEDITATION CONTENT MANAGEMENT
// ============================================

// POST /api/admin/meditations
export const createMeditation = async (req: Request, res: Response) => {
  try {
    const { title, description, duration, level, type, mediaUrl, isActive } = req.body;

    const meditation = await Meditation.create({
      title,
      description,
      duration,
      level,
      type,
      mediaUrl,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Meditation created successfully',
      data: {
        id: meditation._id.toString(),
        title: meditation.title,
        description: meditation.description,
        duration: meditation.duration,
        level: meditation.level,
        type: meditation.type,
        mediaUrl: meditation.mediaUrl,
        isActive: meditation.isActive,
        createdAt: meditation.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create meditation',
    });
  }
};

// PUT /api/admin/meditations/:id
export const updateMeditation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meditation ID',
      });
    }

    const meditation = await Meditation.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!meditation) {
      return res.status(404).json({
        success: false,
        message: 'Meditation not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Meditation updated successfully',
      data: {
        id: meditation._id.toString(),
        title: meditation.title,
        description: meditation.description,
        duration: meditation.duration,
        level: meditation.level,
        type: meditation.type,
        mediaUrl: meditation.mediaUrl,
        isActive: meditation.isActive,
        updatedAt: meditation.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update meditation',
    });
  }
};

// DELETE /api/admin/meditations/:id
export const deleteMeditation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meditation ID',
      });
    }

    const meditation = await Meditation.findByIdAndDelete(id);

    if (!meditation) {
      return res.status(404).json({
        success: false,
        message: 'Meditation not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Meditation deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete meditation',
    });
  }
};

// GET /api/admin/meditations
export const getMeditationsAdmin = async (req: Request, res: Response) => {
  try {
    const meditations = await Meditation.find().sort({ createdAt: -1 });

    const formattedMeditations = meditations.map((meditation) => ({
      id: meditation._id.toString(),
      title: meditation.title,
      description: meditation.description,
      duration: meditation.duration,
      level: meditation.level,
      type: meditation.type,
      mediaUrl: meditation.mediaUrl,
      isActive: meditation.isActive,
      createdAt: meditation.createdAt.toISOString(),
      updatedAt: meditation.updatedAt.toISOString(),
    }));

    res.status(200).json({
      success: true,
      data: formattedMeditations,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch meditations',
    });
  }
};

// ============================================
// SOUND HEALING CONTENT MANAGEMENT
// ============================================

// POST /api/admin/sounds
export const createSound = async (req: Request, res: Response) => {
  try {
    const { title, frequency, category, duration, audioUrl, description, isActive } = req.body;

    const sound = await Sound.create({
      title,
      frequency,
      category,
      duration,
      audioUrl,
      description,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Sound created successfully',
      data: {
        id: sound._id.toString(),
        title: sound.title,
        frequency: sound.frequency,
        category: sound.category,
        duration: sound.duration,
        audioUrl: sound.audioUrl,
        description: sound.description,
        isActive: sound.isActive,
        createdAt: sound.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create sound',
    });
  }
};

// PUT /api/admin/sounds/:id
export const updateSound = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sound ID',
      });
    }

    const sound = await Sound.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!sound) {
      return res.status(404).json({
        success: false,
        message: 'Sound not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sound updated successfully',
      data: {
        id: sound._id.toString(),
        title: sound.title,
        frequency: sound.frequency,
        category: sound.category,
        duration: sound.duration,
        audioUrl: sound.audioUrl,
        description: sound.description,
        isActive: sound.isActive,
        updatedAt: sound.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update sound',
    });
  }
};

// DELETE /api/admin/sounds/:id
export const deleteSound = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sound ID',
      });
    }

    const sound = await Sound.findByIdAndDelete(id);

    if (!sound) {
      return res.status(404).json({
        success: false,
        message: 'Sound not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sound deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete sound',
    });
  }
};

// GET /api/admin/sounds
export const getSoundsAdmin = async (req: Request, res: Response) => {
  try {
    const sounds = await Sound.find().sort({ createdAt: -1 });

    const formattedSounds = sounds.map((sound) => ({
      id: sound._id.toString(),
      title: sound.title,
      frequency: sound.frequency,
      category: sound.category,
      duration: sound.duration,
      audioUrl: sound.audioUrl,
      description: sound.description,
      isActive: sound.isActive,
      createdAt: sound.createdAt.toISOString(),
      updatedAt: sound.updatedAt.toISOString(),
    }));

    res.status(200).json({
      success: true,
      data: formattedSounds,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch sounds',
    });
  }
};

// ============================================
// MARKETPLACE MANAGEMENT (COURSES & PRODUCTS)
// ============================================

// POST /api/admin/courses
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, price, duration, instructor, imageUrl, isActive } = req.body;

    const course = await Course.create({
      title,
      description,
      price,
      duration,
      instructor,
      imageUrl,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: {
        id: course._id.toString(),
        title: course.title,
        description: course.description,
        price: course.price,
        duration: course.duration,
        instructor: course.instructor,
        imageUrl: course.imageUrl,
        isActive: course.isActive,
        createdAt: course.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create course',
    });
  }
};

// PUT /api/admin/courses/:id
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID',
      });
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: {
        id: course._id.toString(),
        title: course.title,
        description: course.description,
        price: course.price,
        duration: course.duration,
        instructor: course.instructor,
        imageUrl: course.imageUrl,
        isActive: course.isActive,
        updatedAt: course.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update course',
    });
  }
};

// DELETE /api/admin/courses/:id
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID',
      });
    }

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete course',
    });
  }
};

// POST /api/admin/products
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, imageUrl, stock, isActive } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      imageUrl,
      stock: stock !== undefined ? stock : 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
        stock: product.stock,
        isActive: product.isActive,
        createdAt: product.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

// PUT /api/admin/products/:id
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: {
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
        stock: product.stock,
        isActive: product.isActive,
        updatedAt: product.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

// DELETE /api/admin/products/:id
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete product',
    });
  }
};

// ============================================
// ADMIN DASHBOARD METRICS
// ============================================

// GET /api/admin/stats
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Active companions (approved status)
    const activeCompanions = await Companion.countDocuments({ status: 'approved' });

    // Pending approvals
    const pendingApprovals = await Companion.countDocuments({ status: 'pending' });

    // Total bookings
    const totalBookings = await Booking.countDocuments();

    // Daily bookings count (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailyBookings = await Booking.countDocuments({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // Revenue placeholder (future implementation)
    const revenue = 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeCompanions,
        pendingApprovals,
        totalBookings,
        dailyBookings,
        revenue,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch admin stats',
    });
  }
};

// ============================================
// BOOKING ADMIN ENDPOINTS
// ============================================

// GET /api/admin/bookings
export const getAdminBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('companionId', 'name title avatar')
      .sort({ createdAt: -1 });

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
      companion: booking.companionId
        ? {
            id: (booking.companionId as any)._id?.toString() || booking.companionId.toString(),
            name: (booking.companionId as any).name || booking.companionName,
            title: (booking.companionId as any).title || 'N/A',
            avatar: (booking.companionId as any).avatar || 'N/A',
          }
        : null,
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

// PATCH /api/admin/bookings/:id/cancel
export const cancelBookingAdmin = async (req: AuthRequest, res: Response) => {
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

