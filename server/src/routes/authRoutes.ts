import express from 'express';
import { registerUser, loginUser, deleteAccount, updateUser } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/profile', protect, deleteAccount);
router.put('/profile', protect, updateUser);

export default router;
