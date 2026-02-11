import { Request, Response } from 'express';
import ProviderProfile from '../models/ProviderProfile';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create or update provider profile
// @route   POST /api/providers/profile
// @access  Private (Provider only)
export const updateProfile = async (req: AuthRequest, res: Response) => {
    const { category, bio, location, pricingPackages, portfolio, availability } = req.body;

    const profileFields: any = {
        user: req.user?._id,
        category,
        bio,
        location,
        pricingPackages,
        portfolio,
        availability
    };

    let profile = await ProviderProfile.findOne({ user: req.user?._id } as any);

    if (profile) {
        // Update
        profile = await ProviderProfile.findOneAndUpdate(
            { user: req.user?._id } as any,
            { $set: profileFields },
            { new: true }
        );
        res.json(profile);
    } else {
        // Create
        profile = new ProviderProfile(profileFields);
        await profile.save();

        // Update user to reference profile
        await User.findByIdAndUpdate(req.user?._id, { profileRef: profile._id });

        res.json(profile);
    }
};

// @desc    Get current provider's profile
// @route   GET /api/providers/profile/me
// @access  Private (Provider only)
export const getOwnProfile = async (req: AuthRequest, res: Response) => {
    try {
        const profile = await ProviderProfile.findOne({ user: req.user?._id } as any).populate('user', 'name email');
        if (!profile) {
            res.status(404).json({ msg: 'Profile not found' });
            return;
        }
        res.json(profile);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all providers
// @route   GET /api/providers
// @access  Public
export const getProviders = async (req: Request, res: Response) => {
    try {
        const providers = await ProviderProfile.find().populate('user', 'name email');
        res.json(providers);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get provider by ID
// @route   GET /api/providers/:id
// @access  Public
export const getProviderById = async (req: Request, res: Response) => {
    try {
        const provider = await ProviderProfile.findById(req.params.id).populate('user', 'name email');
        if (!provider) {
            res.status(404).json({ msg: 'Provider not found' });
            return;
        }
        res.json(provider);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server Error');
    }
};
