import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Event, Booking } from '../types';
import { Sparkles, Plus, Calendar, MapPin, Users, DollarSign, ArrowRight, LayoutDashboard, Clock, History, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const OrganizerDashboard = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        type: '',
        date: '',
        location: '',
        guestCount: '',
        budget: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Calendar logic
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventsRes = await api.get('/events/myevents');
                setEvents(eventsRes.data);

                const bookingsRes = await api.get('/bookings');
                setBookings(bookingsRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!newEvent.date) {
            setError('Please select a Grand Premiere Date in the orchestration calendar.');
            return;
        }

        try {
            const eventData = {
                ...newEvent,
                guestCount: Number(newEvent.guestCount),
                budget: Number(newEvent.budget)
            };

            const res = await api.post('/events', eventData);
            setEvents(prev => [...prev, res.data]);
            setSuccess('Your masterpiece has been initiated.');
            setShowCreateForm(false);
            setNewEvent({
                title: '',
                type: '',
                date: '',
                location: '',
                guestCount: '',
                budget: '',
                description: ''
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to initiate event');
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

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10"></div>);
        }

        for (let d = 1; d <= totalDays; d++) {
            const date = new Date(year, month, d);
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = newEvent.date && new Date(newEvent.date).toDateString() === date.toDateString();
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

            days.push(
                <button
                    key={d}
                    type="button"
                    disabled={isPast}
                    onClick={() => setNewEvent(prev => ({ ...prev, date: date.toISOString() }))}
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
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                        <div key={day} className="text-[8px] font-bold text-white text-opacity-20 uppercase tracking-widest pb-2">{day}</div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
            {/* Header section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-4xl font-serif mb-2 gold-text italic tracking-tight">The Gallery</h1>
                    <p className="text-white text-opacity-40 text-sm font-light uppercase tracking-widest">Manage your curated events and bookings</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="button-primary flex items-center group"
                >
                    {showCreateForm ? 'CLOSE CANVAS' : (
                        <>
                            <Plus className="w-5 h-5 mr-4" />
                            INITIALIZE NEW EVENT
                        </>
                    )}
                </button>
            </header>

            {error && (
                <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-xl text-red-400 text-xs text-center animate-pulse">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-xl text-primary text-xs text-center">
                    {success}
                </div>
            )}

            {/* Event Creation Form - Glassmorphism */}
            {showCreateForm && (
                <div className="glass-card p-8 border-primary border-opacity-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Sparkles className="w-24 h-24" />
                    </div>

                    <h2 className="text-2xl font-serif mb-8 italic">Define Your Vision</h2>
                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="col-span-1 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-40 ml-1">Event Master Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newEvent.title}
                                    onChange={handleInputChange}
                                    className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all font-light"
                                    placeholder="e.g., The Sinclair - Montgomery Nuptials"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-40 ml-1">Atmosphere / Category</label>
                                <select
                                    name="type"
                                    value={newEvent.type}
                                    onChange={handleInputChange}
                                    className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all font-light appearance-none"
                                    required
                                >
                                    <option value="" className="bg-luxury-black">Select Aura</option>
                                    <option value="Wedding" className="bg-luxury-black font-serif italic text-primary">Royal Wedding</option>
                                    <option value="Corporate" className="bg-luxury-black font-serif italic text-primary">Executive Gala</option>
                                    <option value="Birthday" className="bg-luxury-black font-serif italic text-primary">Milestone Soirée</option>
                                    <option value="Other" className="bg-luxury-black font-serif italic text-primary">Custom Experience</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-40 ml-1">Exclusive Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={newEvent.location}
                                    onChange={handleInputChange}
                                    className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all font-light"
                                    placeholder="e.g., The Belvedere Estate"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-40 ml-1">Guest List Count</label>
                                    <input
                                        type="number"
                                        name="guestCount"
                                        value={newEvent.guestCount}
                                        onChange={handleInputChange}
                                        className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all font-light"
                                        required
                                        min="1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-40 ml-1">Reserve Budget ($)</label>
                                    <input
                                        type="number"
                                        name="budget"
                                        value={newEvent.budget}
                                        onChange={handleInputChange}
                                        className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl py-3 px-4 text-primary focus:outline-none focus:border-primary transition-all font-bold"
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-1 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-40 ml-1">Grand Premiere Date</label>
                                <div className="bg-white bg-opacity-[0.02] border border-white border-opacity-[0.05] rounded-2xl p-6">
                                    {renderCalendar()}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-40 ml-1">Creative Narrative</label>
                                <textarea
                                    name="description"
                                    value={newEvent.description}
                                    onChange={handleInputChange}
                                    className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary transition-all font-light h-24"
                                    placeholder="Describe the soul of your event..."
                                />
                            </div>
                        </div>

                        <div className="col-span-2 flex justify-end items-center space-x-8 pt-4 border-t border-white border-opacity-5">
                            {newEvent.date && (
                                <div className="flex items-center space-x-2 text-primary">
                                    <Check className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Date Orchestrated</span>
                                </div>
                            )}
                            <button
                                type="submit"
                                className="button-primary px-12 group flex items-center"
                            >
                                BEGIN ORCHESTRATION
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>
                </div>
            )}


            {/* Events Grid */}
            <section className="space-y-6">
                <div className="flex items-center space-x-2">
                    <LayoutDashboard className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-display uppercase tracking-[0.3em]">Active Visions</h2>
                </div>

                {events.length === 0 ? (
                    <div className="glass-card p-12 text-center border-dashed border-2">
                        <p className="text-white text-opacity-20 italic font-serif text-lg">Your gallery is currently empty.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map(event => (
                            <div key={event._id} className="group glass-card border-opacity-5 hover:border-primary hover:border-opacity-20 transition-all p-0 overflow-hidden cursor-pointer">
                                <div className="h-32 bg-premium-dark relative overflow-hidden p-6 flex flex-col justify-end">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all">
                                        <Sparkles className="w-16 h-16 text-primary" />
                                    </div>
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1">{event.type}</span>
                                    <h3 className="text-xl font-serif text-white group-hover:gold-text transition-colors truncate">{event.title}</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <Calendar className="w-4 h-4 text-white text-opacity-20" />
                                        <span className="text-sm font-light text-white text-opacity-50">{new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <MapPin className="w-4 h-4 text-white text-opacity-20" />
                                        <span className="text-sm font-light text-white text-opacity-50 italic truncate">{event.location}</span>
                                    </div>
                                    <div className="pt-4 flex justify-between items-center border-t border-white border-opacity-5">
                                        <div className="flex -space-x-2">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full border border-luxury-black bg-luxury-charcoal flex items-center justify-center text-[10px]">
                                                    {i === 2 ? '+' : <Users className="w-3 h-3 text-white text-opacity-30" />}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[8px] font-bold uppercase tracking-widest text-white text-opacity-20">Remaining Budget</span>
                                            <span className="text-sm font-bold text-primary">${event.budget.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Bookings Section */}
            <section className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-display uppercase tracking-[0.3em] font-bold">Confirmed Alliances</h2>
                </div>

                {bookings.length === 0 ? (
                    <div className="glass-card p-8 text-center bg-transparent">
                        <p className="text-white text-opacity-20 italic">No services curated yet.</p>
                    </div>
                ) : (
                    <div className="glass-card overflow-hidden border-opacity-5">
                        <table className="w-full text-left">
                            <thead className="bg-white bg-opacity-[0.02] border-b border-white border-opacity-10 text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-30">
                                <tr>
                                    <th className="px-6 py-4">Service Experience</th>
                                    <th className="px-6 py-4">Lead Designer</th>
                                    <th className="px-6 py-4">Protocol Status</th>
                                    <th className="px-6 py-4 text-right">Investment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white divide-opacity-[0.03]">
                                {bookings.map(booking => (
                                    <tr key={booking._id} className="hover:bg-white hover:bg-opacity-[0.01] transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-serif italic text-white">{booking.serviceName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-6 h-6 rounded-full bg-primary bg-opacity-20 flex items-center justify-center text-[10px] text-primary">
                                                    {(booking.provider as any).name?.[0]}
                                                </div>
                                                <span className="text-sm font-light text-white text-opacity-60">{(booking.provider as any).name || 'Private Member'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full ${booking.status === 'confirmed'
                                                ? 'bg-green-500 bg-opacity-10 text-green-400 border border-green-500 border-opacity-20'
                                                : 'bg-gold-gradient text-black'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-display font-bold text-white">${booking.price.toLocaleString()}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default OrganizerDashboard;
