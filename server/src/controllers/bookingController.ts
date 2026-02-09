import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private (Organizer)
export const createBooking = async (req: AuthRequest, res: Response) => {
    const { eventId, providerId, serviceName, date, price, notes } = req.body;

    // Check availability logic would go here (simplified for now)

    const booking = new Booking({
        event: eventId,
        provider: providerId,
        serviceName,
        date,
        price,
        notes
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
};

// @desc    Get bookings for a user (Organizer's events OR Provider's jobs)
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req: AuthRequest, res: Response) => {
    // If provider, find bookings where they are the provider
    if (req.user?.role === 'provider') {
        const bookings = await Booking.find({ provider: req.user._id } as any).populate('event');
        res.json(bookings);
    } else {
        // If organizer, find bookings for their events
        // First find events owned by user
        const events = await Event.find({ organizer: req.user?._id } as any);
        const eventIds = events.map(e => e._id);

        const bookings = await Booking.find({ event: { $in: eventIds } } as any).populate('provider', 'name email');
        res.json(bookings);
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Provider only for confirm/cancel, Organizer for cancel?)
export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        res.status(404).json({ message: 'Booking not found' });
        return;
    }

    // Only provider can confirm/complete? Or maybe organizer accepts too?
    // For simplicity: Provider updates status
    if (req.user?.role !== 'provider' && status === 'confirmed') {
        // Allow only provider to confirm
        // But for now, let's keep it simple
    }

    booking.status = status;
    await booking.save();
    res.json(booking);
};
