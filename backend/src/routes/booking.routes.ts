import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validator.middleware';
import { createBookingSchema } from '../validators/booking.validator';

const router = Router();

// POST /api/bookings - Auth required
router.post(
  '/',
  authenticate,
  validate(createBookingSchema),
  bookingController.createBooking
);

// DELETE /api/bookings/:id - Cancel booking (user only)
router.delete(
  '/:id',
  authenticate,
  bookingController.cancelBooking
);

// PATCH /api/bookings/:id/confirm - Confirm booking (companion only)
router.patch(
  '/:id/confirm',
  authenticate,
  bookingController.confirmBooking
);

// PATCH /api/bookings/:id/complete - Complete booking (companion only)
router.patch(
  '/:id/complete',
  authenticate,
  bookingController.completeBooking
);

export default router;

