import express from 'express';
import { updateProfile, getProviders, getProviderById, getOwnProfile } from '../controllers/providerController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/profile', protect, updateProfile);
router.get('/profile/me', protect, getOwnProfile);
router.get('/', getProviders);
router.get('/:id', getProviderById);

export default router;
