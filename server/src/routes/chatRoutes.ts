import express from 'express';
import { accessChat, fetchChats, sendMessage } from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .post(protect, accessChat)
    .get(protect, fetchChats);

router.route('/message')
    .post(protect, sendMessage);

export default router;
