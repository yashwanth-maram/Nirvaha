import { Router } from 'express';
import * as companionController from '../controllers/companion.controller';
import * as bookingController from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validator.middleware';
import { applyCompanionSchema, getCompanionsQuerySchema } from '../validators/companion.validator';

const router = Router();

// GET /api/companions - Public (optional auth for personalized results)
router.get(
  '/',
  validate(getCompanionsQuerySchema),
  companionController.getCompanions
);

// POST /api/companions/apply - Public (no auth required for application)
// Must come before /:id route to avoid route conflicts
router.post(
  '/apply',
  validate(applyCompanionSchema),
  companionController.applyAsCompanion
);

// GET /api/companions/:id - Public
router.get('/:id', companionController.getCompanionById);

// POST /api/companions/:id/like - Auth required
router.post('/:id/like', authenticate, companionController.likeCompanion);

// DELETE /api/companions/:id/like - Auth required
router.delete('/:id/like', authenticate, companionController.unlikeCompanion);

// GET /api/companions/me/bookings - Auth required (companion bookings)
router.get('/me/bookings', authenticate, bookingController.getCompanionBookings);

export default router;

