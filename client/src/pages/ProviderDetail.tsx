import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Star, MapPin, Sparkles, ArrowLeft, Check, ShieldCheck, ChevronLeft, ChevronRight, Camera, Palette, Scissors, Mail, Music, Utensils, ChevronDown, LogIn } from 'lucide-react';


const ProviderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const [provider, setProvider] = useState<any>(null);

    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [bookingType, setBookingType] = useState('');
    const [guestCount, setGuestCount] = useState('');

    // Calendar logic
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Dummy Packages if missing
    const dummyPackages = [
        { name: 'Classic Orchestration', price: 25000, description: 'Essence of elegance. Essential coverage for your masterpiece.' },
        { name: 'Royal Collection', price: 50000, description: 'Unparalleled luxury. Full-spectrum artistic service with premium deliverables.' },
        { name: 'Elite Visionary', price: 85000, description: 'The absolute pinnacle. Bespoke craftsmanship tailored to your singular legacy.' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch provider data (public)
                const pRes = await api.get(`/providers/${id}`);
                setProvider(pRes.data);

                // Set initial package from real or dummy data
                const initialPackages = (pRes.data.pricingPackages && pRes.data.pricingPackages.length > 0)
                    ? pRes.data.pricingPackages
                    : dummyPackages;

                setSelectedPackage(initialPackages[0]);
            } catch (err) {
                console.error(err);
                setError("Failed to load provider details.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleBooking = async () => {
        if (!auth?.user) {
            setError('Please sign in to initiate an orchestration.');
            return;
        }

        if (!selectedDate || !bookingType || !guestCount || !selectedPackage) {
            setError('Please complete the orchestration protocols (Select Category, Guests, Date, and Package).');
            return;
        }

        try {
            // 1. Create the event first
            const eventRes = await api.post('/events', {
                title: `${bookingType} with ${provider.user.name}`,
                type: bookingType,
                date: selectedDate,
                location: provider.location || 'Flexible',
                guestCount: Number(guestCount),
                budget: selectedPackage.price * 10,
                description: `Orchestration with ${provider.user.name}`
            });

            const newEventId = eventRes.data._id;

            // 2. Create the booking linked to the new event
            await api.post('/bookings', {
                event: newEventId,
                provider: provider.user._id,
                serviceName: selectedPackage.name,
                date: selectedDate,
                price: selectedPackage.price * 10
            });

            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Orchestration failed to initialize.');
        }
    };

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const days = [];
        const totalDays = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10"></div>);
        }

        for (let d = 1; d <= totalDays; d++) {
            const date = new Date(year, month, d);
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

            days.push(
                <button
                    key={d}
                    type="button"
                    disabled={isPast}
                    onClick={() => setSelectedDate(date)}
                    className={`h-10 w-full flex items-center justify-center rounded-lg text-xs transition-all ${isPast ? 'opacity-10 cursor-not-allowed' :
                        isSelected ? 'bg-primary text-black font-bold shadow-gold-glow' :
                            'hover:bg-white hover:bg-opacity-[0.05] text-white text-opacity-60'
                        } ${isToday && !isSelected ? 'border border-primary border-opacity-30' : ''}`}
                >
                    {d}
                </button>
            );
        }

        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                    <button type="button" onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-2 hover:bg-white hover:bg-opacity-5 rounded-full">
                        <ChevronLeft className="w-4 h-4 text-primary" />
                    </button>
                    <span className="font-serif italic text-sm">{monthNames[month]} {year}</span>
                    <button type="button" onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-2 hover:bg-white hover:bg-opacity-5 rounded-full">
                        <ChevronRight className="w-4 h-4 text-primary" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                        <div key={i} className="text-[8px] font-bold text-white text-opacity-20 uppercase tracking-widest pb-2">{day}</div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="min-h-screen bg-luxury-black flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-primary animate-pulse" />
        </div>
    );

    if (!provider) return (
        <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center space-y-4">
            <h2 className="text-2xl font-serif italic text-white">Artisan Not Found</h2>
            <button onClick={() => navigate('/explore')} className="button-secondary">Return to Curations</button>
        </div>
    );

    const isOwnProfile = auth?.user?._id === provider.user._id;

    // Dynamic icon based on category
    const CategoryIcon = () => {
        const iconClass = "w-6 h-6";
        switch (provider.category) {
            case 'Photography & Videography': return <Camera className={iconClass} />;
            case 'Decorations': return <Sparkles className={iconClass} />;
            case 'Beauticians': return <Palette className={iconClass} />;
            case 'Dressing & Styling': return <Scissors className={iconClass} />;
            case 'Invitation Designers': return <Mail className={iconClass} />;
            case 'Entertainment': return <Music className={iconClass} />;
            case 'Catering Services': return <Utensils className={iconClass} />;
            default: return <Sparkles className={iconClass} />;
        }
    };

    // Dummy data generation if portfolio is empty
    const portfolioItems = (provider.portfolio && provider.portfolio.length > 0)
        ? provider.portfolio
        : [
            { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800', description: 'Grand Gala Orchestration' },
            { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', description: 'Royal Nuptial Design' },
            { url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800', description: 'Private Haute Soirée' },
            { url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800', description: 'VIP Artistic Showcase' }
        ];

    const pricingPackages = (provider.pricingPackages && provider.pricingPackages.length > 0)
        ? provider.pricingPackages
        : dummyPackages;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-white text-opacity-40 hover:text-primary transition-all mb-12 uppercase tracking-[0.2em] text-[10px] font-bold"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Curations</span>
            </button>

            {/* Story Hero Section */}
            <div className="relative h-[80vh] rounded-[40px] overflow-hidden mb-16 group shadow-2xl">
                <img
                    src={portfolioItems[0].url}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-1000"
                    alt="Hero"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent"></div>

                <div className="absolute top-12 right-12">
                    <div className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-primary scale-125">
                        <CategoryIcon />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 p-12 w-full flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-primary border border-primary border-opacity-30 bg-primary/10 backdrop-blur-md px-4 py-1.5 rounded-full">{provider.category}</span>
                            <div className="flex items-center space-x-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-primary border border-white/10">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-xs font-bold text-white">{provider.rating || '5.0'}</span>
                            </div>
                        </div>
                        <h1 className="text-7xl md:text-9xl font-serif italic text-white leading-none tracking-tighter drop-shadow-2xl">{provider.user?.name}</h1>
                        <div className="flex items-center space-x-6 text-white/60">
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-sm font-light italic tracking-wide">{provider.location || 'Global Presence'}</span>
                            </div>
                            <div className="flex items-center space-x-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-lg">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Verified Artisan</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Profile Content */}
                <div className="lg:col-span-2 space-y-24">
                    <section className="space-y-8">
                        <div className="flex items-center space-x-4">
                            <div className="h-px flex-1 bg-gold-gradient opacity-20"></div>
                            <h2 className="text-sm font-display uppercase tracking-[0.4em] font-black text-primary/60">Creative Philosophy</h2>
                            <div className="h-px flex-1 bg-gold-gradient opacity-20"></div>
                        </div>
                        <p className="text-white text-opacity-70 font-light leading-relaxed text-2xl md:text-4xl font-serif italic max-w-4xl mx-auto text-center">
                            "{provider.bio || "Crafting moments of absolute elegance and profound emotional resonance. Every orchestration is a unique legacy tailored to the singular vision of our distinguished patrons."}"
                        </p>
                    </section>

                    {/* Portfolio Grid */}
                    <section className="space-y-12">
                        <header className="flex justify-between items-end">
                            <div>
                                <h2 className="text-4xl font-serif italic mb-2">The Gallery</h2>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">A collective of archived masterpieces</p>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-serif italic gold-text">{portfolioItems.length}</span>
                                <span className="block text-[8px] font-bold uppercase tracking-widest text-white/20">Works Archived</span>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {portfolioItems.map((item: any, idx: number) => (
                                <div
                                    key={idx}
                                    className={`group relative rounded-3xl overflow-hidden glass-card p-0 border-white/5 transition-all duration-700 ${idx % 3 === 0 ? 'h-[600px]' : 'h-[500px]'
                                        }`}
                                >
                                    <img src={item.url} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 opacity-60 group-hover:opacity-100" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <span className="w-8 h-px bg-primary"></span>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Masterwork 0{idx + 1}</p>
                                        </div>
                                        <h4 className="text-2xl font-serif italic text-white mb-2">{item.description || "Experimental Orchestration"}</h4>
                                        <p className="text-xs text-white/40 font-light max-w-xs">{item.location || "Confidential Project"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Packages */}
                    <section className="space-y-10">
                        <header>
                            <h2 className="text-4xl font-serif italic mb-2">Collections</h2>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Curated investment tiers</p>
                        </header>
                        <div className="grid grid-cols-1 gap-6">
                            {pricingPackages.map((pkg: any, idx: number) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedPackage(pkg)}
                                    className={`group glass-card p-10 cursor-pointer transition-all border-opacity-5 flex justify-between items-center ${selectedPackage?.name === pkg.name ? 'border-primary border-opacity-40 bg-primary/5' : 'hover:border-primary/20'}`}
                                >
                                    <div className="space-y-2">
                                        <h3 className="font-serif italic text-3xl group-hover:gold-text transition-colors">{pkg.name}</h3>
                                        <p className="text-sm text-white text-opacity-50 font-light max-w-md">{pkg.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-display font-medium text-white block mb-4">RS. {(pkg.price * 10).toLocaleString()}</span>
                                        <div className={`flex items-center justify-end space-x-3 text-[10px] font-black uppercase tracking-widest ${selectedPackage?.name === pkg.name ? 'text-primary' : 'text-white/20'}`}>
                                            <span>{selectedPackage?.name === pkg.name ? 'Selected' : 'Select'}</span>
                                            <div className={`w-6 h-6 rounded-full border border-primary flex items-center justify-center ${selectedPackage?.name === pkg.name ? 'bg-primary text-black' : 'text-transparent'}`}>
                                                <Check className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Booking Protocol */}
                <aside className="space-y-8">
                    <div className="glass-card p-10 top-32 lg:sticky">
                        {isOwnProfile ? (
                            <div className="text-center py-10 space-y-6">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10">
                                    <ShieldCheck className="w-8 h-8 text-white/40" />
                                </div>
                                <h3 className="text-2xl font-serif italic text-white">Your Public Profile</h3>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] max-w-xs mx-auto">
                                    This is how organizers see your portfolio. manage your showcase from the dashboard.
                                </p>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="button-secondary w-full"
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        ) : success ? (
                            <div className="text-center py-20 space-y-6">
                                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                                    <Check className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-2xl font-serif italic">Request Dispatched</h3>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">The artist will review your vision.</p>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-2xl font-serif italic mb-2">Initiate Request</h3>
                                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Secure your alliance</p>
                                </div>

                                {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] text-center uppercase tracking-widest">{error}</div>}

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-40 ml-1">Atmosphere / Category</label>
                                        <div className="relative">
                                            <select
                                                value={bookingType}
                                                onChange={(e) => setBookingType(e.target.value)}
                                                className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-primary transition-all text-xs appearance-none pr-10"
                                            >
                                                <option value="" className="bg-luxury-black">Select Your Aura</option>
                                                <option value="Wedding" className="bg-luxury-black">Wedding</option>
                                                <option value="Birthday" className="bg-luxury-black">Birthday</option>
                                                <option value="Corporate" className="bg-luxury-black">Corporate</option>
                                                <option value="Custom" className="bg-luxury-black">Custom</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white text-opacity-20 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-40 ml-1">Guest List Count</label>
                                        <input
                                            type="number"
                                            value={guestCount}
                                            onChange={(e) => setGuestCount(e.target.value)}
                                            placeholder="Ex: 150"
                                            className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-primary transition-all text-xs"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-40 ml-1">Proposed Date</label>
                                        <div className="bg-white/2 border border-white/5 rounded-2xl p-6">{renderCalendar()}</div>
                                    </div>

                                    <div className="pt-8 border-t border-white border-opacity-5">
                                        <div className="flex justify-between items-center mb-8">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white text-opacity-20 mb-1 block">Total Investment</span>
                                                <span className="text-4xl font-display font-medium text-white">RS. {(selectedPackage?.price * 10)?.toLocaleString() || '0'}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[8px] font-black uppercase tracking-tighter text-white/20 block mb-1">Status</span>
                                                <span className="text-[10px] font-bold text-primary uppercase">Draft Protocol</span>
                                            </div>
                                        </div>

                                        {!auth?.user ? (
                                            <Link to="/register" className="w-full button-primary py-5 flex items-center justify-center shadow-gold-glow">
                                                JOIN TO ORCHESTRATE
                                                <LogIn className="ml-3 w-4 h-4" />
                                            </Link>
                                        ) : (
                                            <button onClick={handleBooking} className="w-full button-primary py-5 group flex items-center justify-center shadow-gold-glow">
                                                REQUEST COLLABORATION
                                                <Sparkles className="ml-3 w-4 h-4 group-hover:rotate-12 transition-transform" />
                                            </button>
                                        )}
                                        <p className="text-center mt-6 text-[8px] font-bold text-white text-opacity-20 uppercase tracking-[0.2em]">Subject to artistic availability</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ProviderDetail;
