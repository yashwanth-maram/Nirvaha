import { z } from 'zod';

// Companion approval validators
export const approveCompanionSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Companion ID is required'),
  }),
});

export const rejectCompanionSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Companion ID is required'),
  }),
});

export const suspendCompanionSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Companion ID is required'),
  }),
});

export const getCompanionsAdminQuerySchema = z.object({
  query: z.object({
    status: z.enum(['pending', 'approved', 'rejected', 'suspended']).optional(),
  }),
});

// Meditation validators
export const createMeditationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').trim(),
    description: z.string().min(1, 'Description is required').trim(),
    duration: z.number().min(1, 'Duration must be at least 1 minute'),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    type: z.enum(['guided', 'mudra', 'breathwork']),
    mediaUrl: z.string().url('Invalid media URL'),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateMeditationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Meditation ID is required'),
  }),
  body: z.object({
    title: z.string().min(1).trim().optional(),
    description: z.string().min(1).trim().optional(),
    duration: z.number().min(1).optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    type: z.enum(['guided', 'mudra', 'breathwork']).optional(),
    mediaUrl: z.string().url().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const deleteMeditationSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Meditation ID is required'),
  }),
});

// Sound validators
export const createSoundSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').trim(),
    frequency: z.number().min(0, 'Frequency must be non-negative'),
    category: z.string().min(1, 'Category is required').trim(),
    duration: z.number().min(1, 'Duration must be at least 1 minute'),
    audioUrl: z.string().url('Invalid audio URL'),
    description: z.string().min(1, 'Description is required').trim(),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateSoundSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Sound ID is required'),
  }),
  body: z.object({
    title: z.string().min(1).trim().optional(),
    frequency: z.number().min(0).optional(),
    category: z.string().min(1).trim().optional(),
    duration: z.number().min(1).optional(),
    audioUrl: z.string().url().optional(),
    description: z.string().min(1).trim().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const deleteSoundSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Sound ID is required'),
  }),
});

// Course validators
export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').trim(),
    description: z.string().min(1, 'Description is required').trim(),
    price: z.number().min(0, 'Price must be non-negative'),
    duration: z.number().min(1, 'Duration must be at least 1 hour'),
    instructor: z.string().min(1, 'Instructor is required').trim(),
    imageUrl: z.string().url('Invalid image URL'),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateCourseSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Course ID is required'),
  }),
  body: z.object({
    title: z.string().min(1).trim().optional(),
    description: z.string().min(1).trim().optional(),
    price: z.number().min(0).optional(),
    duration: z.number().min(1).optional(),
    instructor: z.string().min(1).trim().optional(),
    imageUrl: z.string().url().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const deleteCourseSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Course ID is required'),
  }),
});

// Product validators
export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').trim(),
    description: z.string().min(1, 'Description is required').trim(),
    price: z.number().min(0, 'Price must be non-negative'),
    category: z.string().min(1, 'Category is required').trim(),
    imageUrl: z.string().url('Invalid image URL'),
    stock: z.number().min(0, 'Stock must be non-negative').default(0),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Product ID is required'),
  }),
  body: z.object({
    name: z.string().min(1).trim().optional(),
    description: z.string().min(1).trim().optional(),
    price: z.number().min(0).optional(),
    category: z.string().min(1).trim().optional(),
    imageUrl: z.string().url().optional(),
    stock: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const deleteProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Product ID is required'),
  }),
});

// Booking admin validators
export const cancelBookingAdminSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Booking ID is required'),
  }),
});

