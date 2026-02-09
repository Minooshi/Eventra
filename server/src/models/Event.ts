import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
    organizer: mongoose.Schema.Types.ObjectId;
    title: string;
    type: string;
    date: Date;
    location: string;
    guestCount: number;
    budget: number;
    description?: string;
    createdAt: Date;
}

const EventSchema: Schema = new Schema({
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    guestCount: { type: Number, required: true },
    budget: { type: Number, required: true },
    description: { type: String }
}, {
    timestamps: true
});

export default mongoose.model<IEvent>('Event', EventSchema);
