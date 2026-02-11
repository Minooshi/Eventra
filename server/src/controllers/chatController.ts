import { Request, Response } from 'express';
import Chat from '../models/Chat';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create or access chat for a user or event
// @route   POST /api/chats
// @access  Private
export const accessChat = async (req: AuthRequest, res: Response) => {
    const { userId, eventId } = req.body;

    if (!userId && !eventId) {
        res.status(400).send('UserId or EventId param not sent with request');
        return;
    }

    if (eventId) {
        // Find chat for this event
        let eventChat = await Chat.findOne({ event: eventId })
            .populate('participants', '-password')
            .populate('messages.sender', 'name email');

        if (eventChat) {
            res.send(eventChat);
        } else {
            if (!req.user?._id) {
                res.status(401).send('Unauthorized');
                return;
            }

            // Create new group chat for the event
            var chatData = {
                participants: [req.user._id],
                event: eventId,
                messages: []
            };

            try {
                const createdChat = await Chat.create(chatData as any);
                const FullChat = await Chat.findOne({ _id: (createdChat as any)._id }).populate(
                    'participants',
                    '-password'
                );
                res.status(200).json(FullChat);
            } catch (error) {
                res.status(400);
                throw new Error((error as Error).message);
            }
        }
        return;
    }

    // Individual chat logic (existing)
    if (!req.user?._id) return;

    let isChat = await Chat.find({
        participants: { $all: [req.user._id, userId] },
        event: { $exists: false }
    } as any).populate('participants', '-password').populate('messages.sender', 'name email');

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var individualChatData = {
            participants: [req.user._id, userId],
            messages: []
        };

        try {
            const createdChat = await Chat.create(individualChatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                'participants',
                '-password'
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error((error as Error).message);
        }
    }
};

// @desc    Fetch all chats for a user
// @route   GET /api/chats
// @access  Private
export const fetchChats = async (req: AuthRequest, res: Response) => {
    try {
        const results = await Chat.find({ participants: { $elemMatch: { $eq: req.user?._id } } } as any)
            .populate('participants', '-password')
            .sort({ updatedAt: -1 });
        res.status(200).send(results);
    } catch (error) {
        res.status(400);
        throw new Error((error as Error).message);
    }
};

// @desc    Send a message
// @route   POST /api/chats/message
// @access  Private
export const sendMessage = async (req: AuthRequest, res: Response) => {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
        res.status(400).send('Invalid data passed into request');
        return;
    }

    var newMessage = {
        sender: req.user?._id,
        content: content,
        createdAt: new Date()
    };

    try {
        let chat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { messages: newMessage },
                $set: { updatedAt: new Date() }
            },
            { new: true }
        )
            .populate('participants', '-password')
            .populate('messages.sender', 'name email');

        res.json(chat);
    } catch (error) {
        res.status(400);
        throw new Error((error as Error).message);
    }
};
