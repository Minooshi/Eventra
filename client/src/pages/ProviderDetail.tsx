import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Star, MapPin, Sparkles, ArrowLeft, Check, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';

const ProviderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [provider, setProvider] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Calendar logic
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pRes, eRes] = await Promise.all([
                    api.get(`/providers/${id}`),
                    api.get('/events/myevents')
                ]);
                setProvider(pRes.data);
                setEvents(eRes.data);
                if (pRes.data.pricingPackages?.length > 0) {
                    setSelectedPackage(pRes.data.pricingPackages[0]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleBooking = async () => {
        if (!selectedDate || !selectedEvent || !selectedPackage) {
            setError('Please complete the orchestration protocols (Select Date, Event, and Package).');
            return;
        }

        try {
            await api.post('/bookings', {
                event: selectedEvent,
                provider: provider.user._id,
                serviceName: selectedPackage.name,
                date: selectedDate,
                price: selectedPackage.price
            });
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Booking failed');
        }
    };

    // Calendar Helper Functions
    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const days = [];
        const totalDays = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);

        // Header
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        // Fill empty days
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10"></div>);
        }

        // Fill actual days
        for (let d = 1; d <= totalDays; d++) {
            const date = new Date(year, month, d);
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

            days.push(
                <button
                    key={d}
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
                    <button onClick={() => setCurrentMonth(new Date(year, month - 1))} className="p-2 hover:bg-white hover:bg-opacity-5 rounded-full">
                        <ChevronLeft className="w-4 h-4 text-primary" />
                    </button>
                    <span className="font-serif italic text-sm">{monthNames[month]} {year}</span>
                    <button onClick={() => setCurrentMonth(new Date(year, month + 1))} className="p-2 hover:bg-white hover:bg-opacity-5 rounded-full">
                        <ChevronRight className="w-4 h-4 text-primary" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} className="text-[8px] font-bold text-white text-opacity-20 uppercase tracking-widest pb-2">{day}</div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };

    if (loading) return <div className="min-h-screen bg-luxury-black"></div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-white text-opacity-40 hover:text-primary transition-all mb-12 uppercase tracking-[0.2em] text-[10px] font-bold"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Curations</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Profile Section */}
                <div className="lg:col-span-2 space-y-12">
                    <header className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-primary border border-primary border-opacity-20 px-3 py-1 rounded-full">{provider.category}</span>
                            <div className="flex items-center space-x-1 text-primary">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-xs font-bold">{provider.rating || '5.0'}</span>
                            </div>
                        </div>
                        <h1 className="text-6xl font-serif italic text-white leading-none">{provider.user.name}</h1>
                        <div className="flex items-center space-x-6 text-white text-opacity-40">
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm font-light italic">{provider.location || 'Global Presence'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Verified Artisan</span>
                            </div>
                        </div>
                    </header>

                    <section className="space-y-6">
                        <h2 className="text-xl font-display uppercase tracking-[0.3em] font-bold flex items-center">
                            <Sparkles className="w-5 h-5 mr-3 text-primary" />
                            Creative Philosophy
                        </h2>
                        <p className="text-white text-opacity-50 font-light leading-relaxed text-lg max-w-3xl">
                            {provider.bio || "Crafting moments of absolute elegance and profound emotional resonance. Every orchestration is a unique legacy tailored to the singular vision of our distinguished patrons."}
                        </p>
                    </section>

                    <section className="space-y-8">
                        <h2 className="text-xl font-display uppercase tracking-[0.3em] font-bold">Investments & Packages</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {provider.pricingPackages.map((pkg: any, idx: number) => (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedPackage(pkg)}
                                    className={`glass-card p-8 cursor-pointer transition-all border-opacity-5 ${selectedPackage?.name === pkg.name ? 'border-primary border-opacity-40 bg-white bg-opacity-[0.03]' : 'hover:border-opacity-20'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-serif italic text-xl">{pkg.name}</h3>
                                        <span className="text-xl font-display font-bold text-primary">${pkg.price.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-white text-opacity-40 font-light leading-extended mb-6">{pkg.description}</p>
                                    <div className={`w-6 h-6 rounded-full border border-primary flex items-center justify-center transition-all ${selectedPackage?.name === pkg.name ? 'bg-primary text-black' : 'text-transparent'
                                        }`}>
                                        <Check className="w-3 h-3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Booking Sidebar / Calendar */}
                <div className="space-y-8">
                    <div className="glass-card p-10 top-32 lg:sticky">
                        {success ? (
                            <div className="text-center py-20 space-y-6">
                                <div className="w-20 h-20 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mx-auto mb-6">
                                    <Check className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-2xl font-serif italic">Orchestration Confirmed</h3>
                                <p className="text-white text-opacity-40 text-xs uppercase tracking-widest">Redirecting to your gallery...</p>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                <div>
                                    <h3 className="text-2xl font-serif italic mb-2">Initiate Request</h3>
                                    <p className="text-white text-opacity-40 text-[10px] font-bold uppercase tracking-[0.2em]">Secure your date in the orchestration</p>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-xl text-red-400 text-[10px] text-center uppercase tracking-widest">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {/* Event Selector */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-20 ml-1">For Which Vision?</label>
                                        <select
                                            value={selectedEvent}
                                            onChange={(e) => setSelectedEvent(e.target.value)}
                                            className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all text-xs appearance-none"
                                        >
                                            <option value="" className="bg-luxury-black">Select Your Event</option>
                                            {events.map(ev => (
                                                <option key={ev._id} value={ev._id} className="bg-luxury-black font-serif italic text-primary">{ev.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Real Calendar Component */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-20 ml-1">Select The Premiere Date</label>
                                        <div className="bg-white bg-opacity-[0.02] border border-white border-opacity-[0.05] rounded-2xl p-6">
                                            {renderCalendar()}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white border-opacity-5">
                                        <div className="flex justify-between items-end mb-8">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white text-opacity-20 mb-1 block">Total Investment</span>
                                                <span className="text-3xl font-display font-medium text-white">${selectedPackage?.price.toLocaleString() || '0'}</span>
                                            </div>
                                            <span className="text-[10px] text-primary font-bold italic">Inclusive of Royal Service</span>
                                        </div>

                                        <button
                                            onClick={handleBooking}
                                            className="w-full button-primary py-4 group flex items-center justify-center"
                                        >
                                            REQUEST COLLABORATION
                                            <Sparkles className="ml-3 w-4 h-4 group-hover:rotate-12 transition-transform" />
                                        </button>
                                        <p className="text-center mt-6 text-[8px] font-bold uppercase tracking-[0.3em] text-white text-opacity-10">Selection subject to artisan approval</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDetail;
