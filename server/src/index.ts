import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

import authRoutes from './routes/authRoutes';
import providerRoutes from './routes/providerRoutes';
import eventRoutes from './routes/eventRoutes';
import bookingRoutes from './routes/bookingRoutes';
import chatRoutes from './routes/chatRoutes';
import aiRoutes from './routes/aiRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
    res.send('EVENTRA API is running');
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
