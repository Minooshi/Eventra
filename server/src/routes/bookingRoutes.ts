import express from 'express';
import { createBooking, getBookings, updateBookingStatus } from '../controllers/bookingController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .post(protect, createBooking)
    .get(protect, getBookings);

router.route('/:id/status')
    .put(protect, updateBookingStatus);

export default router;
