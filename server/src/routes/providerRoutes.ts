import express from 'express';
import { updateProfile, getProviders, getProviderById } from '../controllers/providerController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/profile', protect, updateProfile);
router.get('/', getProviders);
router.get('/:id', getProviderById);

export default router;
