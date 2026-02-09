import express from 'express';
import { suggestServices, matchProviders, optimizeBudget, generateTimeline } from '../controllers/aiController';

const router = express.Router();

router.post('/suggest-services', suggestServices);
router.post('/match-providers', matchProviders);
router.post('/optimize-budget', optimizeBudget);
router.post('/timeline', generateTimeline);

export default router;
