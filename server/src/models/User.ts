import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'organizer' | 'provider';
    profileRef?: mongoose.Schema.Types.ObjectId; // Reference to ProviderProfile if role is provider
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['organizer', 'provider'], required: true },
    profileRef: { type: mongoose.Schema.Types.ObjectId, ref: 'ProviderProfile' },
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
