import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { requireAdmin } from '../middleware/admin.middleware';
import { validate } from '../middleware/validator.middleware';
import {
  approveCompanionSchema,
  rejectCompanionSchema,
  suspendCompanionSchema,
  getCompanionsAdminQuerySchema,
  createMeditationSchema,
  updateMeditationSchema,
  deleteMeditationSchema,
  createSoundSchema,
  updateSoundSchema,
  deleteSoundSchema,
  createCourseSchema,
  updateCourseSchema,
  deleteCourseSchema,
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  cancelBookingAdminSchema,
} from '../validators/admin.validator';

const router = Router();

// All admin routes require admin authentication
router.use(requireAdmin);

// ============================================
// COMPANION APPROVAL SYSTEM
// ============================================

// GET /api/admin/companions?status=pending
router.get(
  '/companions',
  validate(getCompanionsAdminQuerySchema),
  adminController.getCompanionsAdmin
);

// PATCH /api/admin/companions/:id/approve
router.patch(
  '/companions/:id/approve',
  validate(approveCompanionSchema),
  adminController.approveCompanion
);

// PATCH /api/admin/companions/:id/reject
router.patch(
  '/companions/:id/reject',
  validate(rejectCompanionSchema),
  adminController.rejectCompanion
);

// PATCH /api/admin/companions/:id/suspend
router.patch(
  '/companions/:id/suspend',
  validate(suspendCompanionSchema),
  adminController.suspendCompanion
);

// DELETE /api/admin/companions/:id
router.delete(
  '/companions/:id',
  validate(approveCompanionSchema), // Reuse schema for ID validation
  adminController.deleteCompanion
);

// ============================================
// MEDITATION CONTENT MANAGEMENT
// ============================================

// POST /api/admin/meditations
router.post(
  '/meditations',
  validate(createMeditationSchema),
  adminController.createMeditation
);

// PUT /api/admin/meditations/:id
router.put(
  '/meditations/:id',
  validate(updateMeditationSchema),
  adminController.updateMeditation
);

// DELETE /api/admin/meditations/:id
router.delete(
  '/meditations/:id',
  validate(deleteMeditationSchema),
  adminController.deleteMeditation
);

// GET /api/admin/meditations
router.get('/meditations', adminController.getMeditationsAdmin);

// ============================================
// SOUND HEALING CONTENT MANAGEMENT
// ============================================

// POST /api/admin/sounds
router.post(
  '/sounds',
  validate(createSoundSchema),
  adminController.createSound
);

// PUT /api/admin/sounds/:id
router.put(
  '/sounds/:id',
  validate(updateSoundSchema),
  adminController.updateSound
);

// DELETE /api/admin/sounds/:id
router.delete(
  '/sounds/:id',
  validate(deleteSoundSchema),
  adminController.deleteSound
);

// GET /api/admin/sounds
router.get('/sounds', adminController.getSoundsAdmin);

// ============================================
// MARKETPLACE MANAGEMENT (COURSES & PRODUCTS)
// ============================================

// POST /api/admin/courses
router.post(
  '/courses',
  validate(createCourseSchema),
  adminController.createCourse
);

// PUT /api/admin/courses/:id
router.put(
  '/courses/:id',
  validate(updateCourseSchema),
  adminController.updateCourse
);

// DELETE /api/admin/courses/:id
router.delete(
  '/courses/:id',
  validate(deleteCourseSchema),
  adminController.deleteCourse
);

// POST /api/admin/products
router.post(
  '/products',
  validate(createProductSchema),
  adminController.createProduct
);

// PUT /api/admin/products/:id
router.put(
  '/products/:id',
  validate(updateProductSchema),
  adminController.updateProduct
);

// DELETE /api/admin/products/:id
router.delete(
  '/products/:id',
  validate(deleteProductSchema),
  adminController.deleteProduct
);

// ============================================
// ADMIN DASHBOARD METRICS
// ============================================

// GET /api/admin/stats
router.get('/stats', adminController.getAdminStats);

// ============================================
// BOOKING ADMIN ENDPOINTS
// ============================================

// GET /api/admin/bookings
router.get('/bookings', adminController.getAdminBookings);

// PATCH /api/admin/bookings/:id/cancel
router.patch(
  '/bookings/:id/cancel',
  validate(cancelBookingAdminSchema),
  adminController.cancelBookingAdmin
);

export default router;

