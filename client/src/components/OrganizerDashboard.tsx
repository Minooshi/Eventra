import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import type { Event, Booking } from '../types';
import { Sparkles, Plus, Calendar, MapPin, ArrowRight, LayoutDashboard, Clock } from 'lucide-react';

const OrganizerDashboard = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
            {/* Header section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-4xl font-serif mb-2 gold-text italic tracking-tight">The Gallery</h1>
                    <p className="text-white text-opacity-40 text-sm font-light uppercase tracking-widest">Manage your curated events and bookings</p>
                </div>
                <Link
                    to="/services"
                    className="button-primary flex items-center group"
                >
                    <Plus className="w-5 h-5 mr-4" />
                    INITIALIZE NEW EVENT
                </Link>
            </header>

            {/* Events Grid */}


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
                                        <Link
                                            to={`/workspace/${event._id}`}
                                            className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Collaboration Workspace
                                            <ArrowRight className="w-3 h-3 ml-2" />
                                        </Link>
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
