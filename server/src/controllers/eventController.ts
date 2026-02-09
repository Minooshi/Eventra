import { Request, Response } from 'express';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer only)
export const createEvent = async (req: AuthRequest, res: Response) => {
    const { title, type, date, location, guestCount, budget, description } = req.body;

    const event = new Event({
        organizer: req.user?._id,
        title,
        type,
        date,
        location,
        guestCount,
        budget,
        description
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
};

// @desc    Get logged in user's events
// @route   GET /api/events/myevents
// @access  Private
export const getMyEvents = async (req: AuthRequest, res: Response) => {
    const events = await Event.find({ organizer: req.user?._id } as any);
    res.json(events);
};

// @desc    Get all events (for providers to browse?) - Optional
// @route   GET /api/events
// @access  Private
export const getEvents = async (req: AuthRequest, res: Response) => {
    // Implement if providers need to search for events
    res.json([]);
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Private
export const getEventById = async (req: AuthRequest, res: Response) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        res.json(event);
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
};
