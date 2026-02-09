import { Request, Response } from 'express';
import ProviderProfile from '../models/ProviderProfile';

// @desc    Get AI service suggestions based on event type
// @route   POST /api/ai/suggest-services
// @access  Public
export const suggestServices = async (req: Request, res: Response) => {
    const { eventType, budget, guestCount } = req.body;

    // Mock Logic
    let suggestedServices = [
        'Photography', 'Catering'
    ];

    if (eventType === 'Wedding') {
        suggestedServices.push('Decoration', 'Makeup', 'Entertainment');
    } else if (eventType === 'Birthday') {
        suggestedServices.push('Cake', 'Decoration');
    }

    if (Number(guestCount) > 100) {
        suggestedServices.push('Security', 'Vehicle Rental');
    }

    res.json({ services: suggestedServices });
};

// @desc    Get AI provider matches
// @route   POST /api/ai/match-providers
// @access  Public
export const matchProviders = async (req: Request, res: Response) => {
    const { eventType, date, budget } = req.body;

    try {
        // Mock Matching Logic
        // In real app, this would use vector search or complex filtering
        const providers = await ProviderProfile.find().populate('user', 'name email');

        // Sort randomly to simulate "AI ranking"
        const ranked = providers.sort(() => 0.5 - Math.random());

        res.json(ranked.slice(0, 5)); // Return top 5 matches
    } catch (error) {
        res.status(500).json({ message: 'AI matching failed' });
    }
};

// @desc    Get AI budget feedback
// @route   POST /api/ai/optimize-budget
// @access  Public
export const optimizeBudget = async (req: Request, res: Response) => {
    const { budget, services } = req.body;

    // Mock Logic
    const feedback = [];
    if (budget < 5000) {
        feedback.push("Budget is tight. Consider DIY decorations.");
    } else {
        feedback.push("Budget looks healthy. You can afford premium catering.");
    }

    res.json({ feedback, alternativeOptions: [] });
};

// @desc    Generate AI timeline
// @route   POST /api/ai/timeline
// @access  Public
export const generateTimeline = async (req: Request, res: Response) => {
    const { date, eventType } = req.body;

    // Mock Timeline
    const timeline = [
        { date: '1 month before', task: 'Book venue and core services' },
        { date: '2 weeks before', task: 'Finalize guest list' },
        { date: '1 week before', task: 'Confirm all vendors' },
        { date: '1 day before', task: 'Final check' }
    ];

    res.json({ timeline });
};
