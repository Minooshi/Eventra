import { Request, Response } from 'express';
import User from '../models/User';
import ProviderProfile from '../models/ProviderProfile';
import Event from '../models/Event';
import Booking from '../models/Booking';
import Chat from '../models/Chat';
import generateToken from '../utils/generateToken';
import bcrypt from 'bcryptjs';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken((user._id as unknown) as string),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for email: ${email}`);

        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User not found: ${email}`);
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password as string);
        if (isMatch) {
            console.log(`Login successful for: ${email}`);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken((user._id as unknown) as string),
            });
        } else {
            console.log(`Invalid password for: ${email}`);
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


// @desc    Delete user account
// @route   DELETE /api/auth/profile
// @access  Private
export const deleteAccount = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (user.role === 'provider') {
            // Delete provider profile
            await ProviderProfile.findOneAndDelete({ user: user._id } as any);
            // Delete bookings associated with this provider
            await Booking.deleteMany({ provider: user._id } as any);
        } else if (user.role === 'organizer') {
            // Find all events by this organizer
            const events = await Event.find({ organizer: user._id } as any);
            const eventIds = events.map(event => event._id);

            // Delete all bookings for these events
            await Booking.deleteMany({ event: { $in: eventIds } } as any);

            // Delete all events
            await Event.deleteMany({ organizer: user._id } as any);
        }

        // Delete chats where user is participant
        await Chat.deleteMany({ participants: user._id } as any);

        // Finally delete the user
        await User.findByIdAndDelete(user._id);

        res.json({ message: 'Account and all associated data deleted successfully' });
    } catch (error: any) {
        console.error('Delete account error:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Update user account
// @route   PUT /api/auth/profile
// @access  Private
export const updateUser = async (req: any, res: Response) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken((updatedUser._id as unknown) as string),
        });
    } catch (error: any) {
        console.error('Update user error:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
