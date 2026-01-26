import { Request, Response } from 'express';
import Companion from '../models/Companion.model';
import Like from '../models/Like.model';
import CompanionApplication from '../models/CompanionApplication.model';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

// GET /api/companions
export const getCompanions = async (req: Request, res: Response) => {
  try {
    const {
      availability,
      specialty,
      language,
      minPrice,
      maxPrice,
    } = req.query;

    const filter: any = {
      status: 'approved', // Only show approved companions to users
    };

    if (availability !== undefined) {
      filter.availability = availability === 'true' || availability === 'available';
    }

    if (specialty) {
      filter.specialties = { $in: [specialty] };
    }

    if (language) {
      filter.languages = { $in: [language] };
    }

    if (minPrice || maxPrice) {
      // Filter companions where at least one rate (hourly or call) falls within the price range
      const priceFilter: any = {
        $or: []
      };
      
      if (minPrice && maxPrice) {
        priceFilter.$or.push(
          { hourlyRate: { $gte: Number(minPrice), $lte: Number(maxPrice) } },
          { callRate: { $gte: Number(minPrice), $lte: Number(maxPrice) } }
        );
      } else if (minPrice) {
        priceFilter.$or.push(
          { hourlyRate: { $gte: Number(minPrice) } },
          { callRate: { $gte: Number(minPrice) } }
        );
      } else if (maxPrice) {
        priceFilter.$or.push(
          { hourlyRate: { $lte: Number(maxPrice) } },
          { callRate: { $lte: Number(maxPrice) } }
        );
      }
      
      if (priceFilter.$or.length > 0) {
        filter.$and = filter.$and || [];
        filter.$and.push(priceFilter);
      }
    }

    const companions = await Companion.find(filter).sort({ createdAt: -1 });

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
      hourlyRate: `$${companion.hourlyRate}`,
      callRate: `$${companion.callRate}`,
      availability: companion.availability ? 'Available' : 'Busy',
      responseTime: companion.responseTime,
      color: companion.color,
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

// GET /api/companions/:id
export const getCompanionById = async (req: Request, res: Response) => {
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

    // Only show approved companions to public
    if (companion.status !== 'approved') {
      return res.status(404).json({
        success: false,
        message: 'Companion not found',
      });
    }

    const formattedCompanion = {
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
      hourlyRate: `$${companion.hourlyRate}`,
      callRate: `$${companion.callRate}`,
      availability: companion.availability ? 'Available' : 'Busy',
      responseTime: companion.responseTime,
      color: companion.color,
    };

    res.status(200).json({
      success: true,
      data: formattedCompanion,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch companion',
    });
  }
};

// POST /api/companions/:id/like
export const likeCompanion = async (req: AuthRequest, res: Response) => {
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

    // Check if already liked (idempotent)
    const existingLike = await Like.findOne({
      userId: new Types.ObjectId(userId),
      companionId: new Types.ObjectId(id),
    });

    if (existingLike) {
      return res.status(200).json({
        success: true,
        message: 'Companion already liked',
        data: { liked: true },
      });
    }

    // Create new like
    await Like.create({
      userId: new Types.ObjectId(userId),
      companionId: new Types.ObjectId(id),
    });

    res.status(201).json({
      success: true,
      message: 'Companion liked successfully',
      data: { liked: true },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate key error (already liked)
      return res.status(200).json({
        success: true,
        message: 'Companion already liked',
        data: { liked: true },
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to like companion',
    });
  }
};

// DELETE /api/companions/:id/like
export const unlikeCompanion = async (req: AuthRequest, res: Response) => {
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
        message: 'Invalid companion ID',
      });
    }

    const result = await Like.deleteOne({
      userId: new Types.ObjectId(userId),
      companionId: new Types.ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Like not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Companion unliked successfully',
      data: { liked: false },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to unlike companion',
    });
  }
};

// GET /api/users/me/likes
export const getUserLikes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const likes = await Like.find({
      userId: new Types.ObjectId(userId),
    }).select('companionId');

    const likedIds = likes.map((like) => like.companionId.toString());

    res.status(200).json({
      success: true,
      data: likedIds,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user likes',
    });
  }
};

// POST /api/companions/apply
export const applyAsCompanion = async (req: Request, res: Response) => {
  try {
    const { name, email, specialties, experience, bio } = req.body;

    const application = await CompanionApplication.create({
      name,
      email,
      specialties,
      experience,
      bio,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        id: application._id.toString(),
        status: application.status,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit application',
    });
  }
};

