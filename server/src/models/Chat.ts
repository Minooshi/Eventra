import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
    sender: mongoose.Schema.Types.ObjectId;
    content: string;
    createdAt: Date;
}

export interface IChat extends Document {
    participants: mongoose.Schema.Types.ObjectId[];
    messages: IMessage[];
    updatedAt: Date;
}

const ChatSchema: Schema = new Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

export default mongoose.model<IChat>('Chat', ChatSchema);
