import { Request, Response } from 'express';
import Chat from '../models/Chat';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create or access chat with a user
// @route   POST /api/chats
// @access  Private
export const accessChat = async (req: AuthRequest, res: Response) => {
    const { userId } = req.body; // The other user's ID

    if (!userId) {
        res.status(400).send('UserId param not sent with request');
        return;
    }

    // Check if chat exists
    let isChat = await Chat.find({
        participants: { $all: [req.user?._id, userId] } as any
    }).populate('participants', '-password').populate('messages.sender', 'name email');

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        // Create new chat
        var chatData = {
            participants: [req.user?._id, userId],
            messages: []
        };

        try {
            const createdChat = await Chat.create(chatData);
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
