import { Router } from 'express';
import * as companionController from '../controllers/companion.controller';
import * as bookingController from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// GET /api/users/me/likes - Auth required
router.get('/me/likes', authenticate, companionController.getUserLikes);

// GET /api/users/me/bookings - Auth required
router.get('/me/bookings', authenticate, bookingController.getUserBookings);

export default router;

