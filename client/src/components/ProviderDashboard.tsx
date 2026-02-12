import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Booking } from '../types';
import {
    Briefcase,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    ExternalLink,
    MessageSquare,
    Sparkles,
    Plus,
    Trash2,
    Image as ImageIcon,
    Eye,
    Tag,
    Save
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ProviderDashboard = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState({ url: '', description: '', type: 'image' });
    const [isUpdating, setIsUpdating] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        return `http://localhost:5001${url}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsRes, profileRes] = await Promise.all([
                    api.get('/bookings'),
                    api.get('/providers/profile/me')
                ]);
                setBookings(bookingsRes.data);
                setProfile(profileRes.data);
            } catch (error) {
                console.error("Error fetching provider data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await api.put(`/bookings/${id}/status`, { status });
            setBookings(bookings.map(b => b._id === id ? { ...b, status: status as any } : b));
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    const handleAddPortfolioItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file && !newItem.url) return;
        setIsUpdating(true);

        try {
            let finalUrl = newItem.url;

            if (file) {
                setUploading(true);
                const formData = new FormData();
                formData.append('image', file);
                const uploadRes = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                finalUrl = uploadRes.data;
                setUploading(false);
            }

            const updatedPortfolio = [...(profile.portfolio || []), { ...newItem, url: finalUrl }];
            const { data } = await api.post('/providers/profile', {
                ...profile,
                portfolio: updatedPortfolio
            });
            setProfile(data);
            setNewItem({ url: '', description: '', type: 'image' });
            setFile(null);
        } catch (error) {
            console.error("Error updating portfolio", error);
        } finally {
            setIsUpdating(false);
            setUploading(false);
        }
    };

    const handleDeletePortfolioItem = async (index: number) => {
        const updatedPortfolio = profile.portfolio.filter((_: any, i: number) => i !== index);
        try {
            const { data } = await api.post('/providers/profile', {
                ...profile,
                portfolio: updatedPortfolio
            });
            setProfile(data);
        } catch (error) {
            console.error("Error deleting item", error);
        }
    };

    const handleUpdatePackages = async () => {
        setIsUpdating(true);
        try {
            const { data } = await api.post('/providers/profile', {
                ...profile,
            });
            setProfile(data);
            alert("Investment tiers updated successfully!");
        } catch (error) {
            console.error("Error updating packages", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePackageChange = (index: number, field: string, value: any) => {
        const defaultPackages = [
            { name: 'Classic Orchestration', price: 25000, description: 'Essence of elegance. Essential coverage for your masterpiece.' },
            { name: 'Royal Collection', price: 50000, description: 'Unparalleled luxury. Full-spectrum artistic service with premium deliverables.' },
            { name: 'Elite Visionary', price: 85000, description: 'The absolute pinnacle. Bespoke craftsmanship tailored to your singular legacy.' }
        ];
        const currentPackages = (profile.pricingPackages && profile.pricingPackages.length > 0)
            ? profile.pricingPackages
            : defaultPackages;

        const updatedPackages = [...currentPackages];
        updatedPackages[index] = { ...updatedPackages[index], [field]: value };
        setProfile({ ...profile, pricingPackages: updatedPackages });
    };

    if (loading) return <div className="min-h-screen bg-luxury-black flex items-center justify-center"><Sparkles className="w-12 h-12 text-primary animate-pulse" /></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-16">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-4xl font-serif mb-2 gold-text italic tracking-tight">Studio Suite</h1>
                    <p className="text-white text-opacity-40 text-sm font-light uppercase tracking-widest leading-loose">Manage your collaborations and portfolio requests</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Link to={`/providers/${profile?._id}`} className="button-secondary flex items-center scale-90">
                        <Eye className="w-4 h-4 mr-2" />
                        PREVIEW PORTFOLIO
                    </Link>
                    <button className="button-primary flex items-center scale-90">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        MESSAGE SYNC
                    </button>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Projects', val: bookings.filter(b => b.status === 'confirmed').length, color: 'text-primary' },
                    { label: 'Pending Invitations', val: bookings.filter(b => b.status === 'pending').length, color: 'text-white text-opacity-40' },
                    { label: 'Estimated Revenue', val: 'RS. ' + (bookings.filter(b => b.status === 'confirmed').reduce((acc, b) => acc + (b.price || 0), 0) * 10).toLocaleString(), color: 'gold-text' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 flex justify-between items-end">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white text-opacity-30">{stat.label}</span>
                        <span className={`text-4xl font-serif italic ${stat.color}`}>{stat.val}</span>
                    </div>
                ))}
            </div>

            {/* Portfolio Manager Section */}
            <section className="space-y-8">
                <div className="flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-display uppercase tracking-[0.3em] font-bold">Portfolio Masterpieces</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Card */}
                    <div className="glass-card p-8 border-primary border-opacity-20 flex flex-col justify-center">
                        <h3 className="text-lg font-serif italic mb-6">Archive New Work</h3>
                        <form onSubmit={handleAddPortfolioItem} className="space-y-4">
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Artistic Vision (File)</label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        id="portfolio-upload"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <label
                                        htmlFor="portfolio-upload"
                                        className="w-full bg-white/5 border border-white/10 border-dashed rounded-xl px-4 py-8 flex flex-col items-center justify-center cursor-pointer group-hover:border-primary/50 transition-all"
                                    >
                                        <Plus className="w-6 h-6 text-white/20 mb-2 group-hover:text-primary transition-colors" />
                                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                                            {file ? file.name : "Select Local Masterpiece"}
                                        </span>
                                    </label>
                                </div>
                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-white/5"></div>
                                    <span className="flex-shrink mx-4 text-[8px] font-black text-white/10 uppercase tracking-[0.3em]">OR USE URL</span>
                                    <div className="flex-grow border-t border-white/5"></div>
                                </div>
                                <input
                                    type="text"
                                    placeholder="https://images.unsplash.com/..."
                                    value={newItem.url}
                                    onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] text-white focus:outline-none focus:border-primary transition-all font-light"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Artistic Narrative</label>
                                <textarea
                                    placeholder="Describe the soul of this piece..."
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all font-light h-24"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isUpdating || uploading}
                                className="w-full button-primary flex items-center justify-center"
                            >
                                {isUpdating || uploading ? (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                        ARCHIVING...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        ADD TO PORTFOLIO
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Portfolio Items Grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profile?.portfolio?.length === 0 ? (
                            <div className="col-span-full glass-card flex flex-col items-center justify-center p-12 text-center bg-transparent border-dashed border-2">
                                <p className="text-white text-opacity-20 italic">The gallery is awaiting your first orchestration.</p>
                            </div>
                        ) : (
                            profile?.portfolio?.map((item: any, index: number) => (
                                <div key={index} className="glass-card p-0 overflow-hidden group relative aspect-[4/3]">
                                    <img src={getImageUrl(item.url)} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                                    <div className="absolute bottom-0 left-0 p-6 w-full">
                                        <p className="text-xs text-white/80 font-light truncate">{item.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeletePortfolioItem(index)}
                                        className="absolute top-4 right-4 p-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Investment Collections Management */}
            <section className="space-y-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Tag className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-display uppercase tracking-[0.3em] font-bold">Investment Collections</h2>
                    </div>
                    <button
                        onClick={handleUpdatePackages}
                        disabled={isUpdating}
                        className="button-primary scale-90 flex items-center"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isUpdating ? 'SAVING...' : 'SAVE ALL TIERS'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {(profile?.pricingPackages?.length > 0 ? profile.pricingPackages : [
                        { name: 'Classic Orchestration', price: 25000, description: 'Essence of elegance. Essential coverage for your masterpiece.' },
                        { name: 'Royal Collection', price: 50000, description: 'Unparalleled luxury. Full-spectrum artistic service with premium deliverables.' },
                        { name: 'Elite Visionary', price: 85000, description: 'The absolute pinnacle. Bespoke craftsmanship tailored to your singular legacy.' }
                    ]).map((pkg: any, index: number) => (
                        <div key={index} className="glass-card p-8 space-y-6 border-opacity-10 hover:border-primary/20 transition-all">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary">Tier Name</label>
                                <input
                                    type="text"
                                    value={pkg.name}
                                    onChange={(e) => handlePackageChange(index, 'name', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-serif italic text-white focus:outline-none focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary">Budget (RS.)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xs">RS.</span>
                                    <input
                                        type="text"
                                        value={(pkg.price * 10).toLocaleString()}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/,/g, '').replace(/RS\.\s?/g, '');
                                            if (!isNaN(Number(val))) {
                                                handlePackageChange(index, 'price', Number(val) / 10);
                                            }
                                        }}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-2xl font-display font-medium text-white focus:outline-none focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-primary">Artistic Scope</label>
                                <textarea
                                    value={pkg.description}
                                    onChange={(e) => handlePackageChange(index, 'description', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-light text-white/60 focus:outline-none focus:border-primary transition-all h-24 resize-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Collaborations Section */}
            <section className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-display uppercase tracking-[0.3em] font-bold">Collaborations</h2>
                </div>

                {bookings.filter(b => b.status !== 'cancelled').length === 0 ? (
                    <div className="glass-card p-20 text-center bg-transparent border-dashed border-2">
                        <Sparkles className="w-12 h-12 text-white text-opacity-10 mx-auto mb-4" />
                        <p className="text-white text-opacity-20 italic font-serif text-lg">Your portfolio is awaiting requests.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {bookings.filter(b => b.status !== 'cancelled').map(booking => (
                            <div key={booking._id} className="glass-card hover:border-white hover:border-opacity-10 transition-all p-0 overflow-hidden flex flex-col md:flex-row">
                                <div className="md:w-64 bg-premium-dark p-8 flex flex-col justify-center border-r border-white border-opacity-5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Protocol</span>
                                    <span className={`text-xs font-bold uppercase tracking-widest ${booking.status === 'confirmed' ? 'text-green-400' :
                                        booking.status === 'pending' ? 'text-primary' : 'text-red-400'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="flex-grow p-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 text-left">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-serif italic text-white leading-none">{(booking.event as any)?.title || 'Untitled Masterpiece'}</h3>
                                        <div className="flex items-center space-x-6">
                                            <div className="flex items-center space-x-2 text-xs text-white text-opacity-30">
                                                <Calendar className="w-3 h-3" />
                                                <span>{new Date(booking.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-xs text-white text-opacity-30 uppercase tracking-widest">
                                                <Briefcase className="w-3 h-3" />
                                                <span>{booking.serviceName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4 w-full md:w-auto">
                                        <span className="text-2xl font-display font-medium text-white px-8">RS. {((booking.price || 0) * 10).toLocaleString()}</span>
                                        {booking.status === 'pending' ? (
                                            <div className="flex space-x-2 flex-grow md:flex-grow-0">
                                                <button
                                                    onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                    className="flex-grow md:flex-none p-3 rounded-full bg-green-500 bg-opacity-10 text-green-400 hover:bg-green-500 hover:text-white transition-all border border-green-500 border-opacity-20"
                                                    title="Accept Reservation"
                                                >
                                                    <CheckCircle2 className="w-5 h-5 mx-auto" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                    className="flex-grow md:flex-none p-3 rounded-full bg-red-500 bg-opacity-10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500 border-opacity-20"
                                                    title="Decline Invitation"
                                                >
                                                    <XCircle className="w-5 h-5 mx-auto" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="button-secondary scale-75 group">
                                                VIEW DETAILS
                                                <ExternalLink className="ml-2 w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default ProviderDashboard;
