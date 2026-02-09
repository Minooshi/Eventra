export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'organizer' | 'provider';
    token: string;
}

export interface ProviderProfile {
    _id: string;
    user: User;
    category: string;
    bio: string;
    location: string;
    pricingPackages: PricingPackage[];
    portfolio: PortfolioItem[];
    availability: string[];
    rating: number;
}

export interface PricingPackage {
    name: string;
    price: number;
    description: string;
}

export interface PortfolioItem {
    type: string;
    url: string;
    description: string;
}

export interface Event {
    _id: string;
    title: string;
    type: string;
    date: string;
    location: string;
    guestCount: number;
    budget: number;
    description?: string;
}

export interface Booking {
    _id: string;
    event: Event;
    provider: User | ProviderProfile; // Depending on population
    serviceName: string;
    date: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    price: number;
    notes?: string;
}
