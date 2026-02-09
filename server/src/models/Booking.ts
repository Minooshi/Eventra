import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
    event: mongoose.Schema.Types.ObjectId;
    provider: mongoose.Schema.Types.ObjectId; // User ID of provider
    serviceName: string; // From provider's pricing package
    date: Date;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    price: number;
    notes?: string;
    createdAt: Date;
}

const BookingSchema: Schema = new Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceName: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    price: { type: Number, required: true },
    notes: { type: String }
}, {
    timestamps: true
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
