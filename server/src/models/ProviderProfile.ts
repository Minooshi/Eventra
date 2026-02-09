import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolioItem {
    type: string;
    url: string;
    description?: string;
}

export interface IProviderProfile extends Document {
    user: mongoose.Schema.Types.ObjectId;
    category: string;
    bio?: string;
    location?: string;
    pricingPackages: {
        name: string;
        price: number;
        description: string;
    }[];
    portfolio: IPortfolioItem[];
    availability: Date[]; // Array of available dates
    rating: number;
}

const ProviderProfileSchema: Schema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    bio: { type: String },
    location: { type: String },
    pricingPackages: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String }
    }],
    portfolio: [{
        type: { type: String },
        url: { type: String },
        description: { type: String }
    }],
    availability: [{ type: Date }],
    rating: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.model<IProviderProfile>('ProviderProfile', ProviderProfileSchema);
