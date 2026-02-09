import express from 'express';
import { createEvent, getMyEvents, getEventById } from '../controllers/eventController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .post(protect, createEvent);

router.route('/myevents')
    .get(protect, getMyEvents);

router.route('/:id')
    .get(protect, getEventById);

export default router;
