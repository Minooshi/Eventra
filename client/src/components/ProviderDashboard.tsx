import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Booking } from '../types';
import { Briefcase, Calendar, CheckCircle2, XCircle, Clock, ExternalLink, MessageSquare, Sparkles } from 'lucide-react';

const ProviderDashboard = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings');
                setBookings(res.data);
            } catch (error) {
                console.error("Error fetching bookings", error);
            }
        };
        fetchBookings();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await api.put(`/bookings/${id}/status`, { status });
            setBookings(bookings.map(b => b._id === id ? { ...b, status: status as any } : b));
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-4xl font-serif mb-2 gold-text italic tracking-tight">Studio Suite</h1>
                    <p className="text-white text-opacity-40 text-sm font-light uppercase tracking-widest leading-loose">Manage your collaborations and portfolio requests</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="button-secondary flex items-center scale-90">
                        <Calendar className="w-4 h-4 mr-2" />
                        CALENDAR
                    </button>
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
                    { label: 'Estimated Revenue', val: '$' + (bookings.filter(b => b.status === 'confirmed').reduce((acc, b) => acc + b.price, 0)).toLocaleString(), color: 'gold-text' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 flex justify-between items-end">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white text-opacity-30">{stat.label}</span>
                        <span className={`text-4xl font-serif italic ${stat.color}`}>{stat.val}</span>
                    </div>
                ))}
            </div>

            {/* Requests Section */}
            <section className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-display uppercase tracking-[0.3em] font-bold">Collaborations</h2>
                </div>

                {bookings.length === 0 ? (
                    <div className="glass-card p-20 text-center border-dashed border-2 border-white border-opacity-5">
                        <Sparkles className="w-12 h-12 text-white text-opacity-10 mx-auto mb-4" />
                        <p className="text-white text-opacity-20 italic font-serif text-lg">Your portfolio is awaiting requests.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {bookings.map(booking => (
                            <div key={booking._id} className="glass-card hover:border-white hover:border-opacity-10 transition-all p-0 overflow-hidden flex flex-col md:flex-row">
                                <div className="md:w-64 bg-premium-dark p-8 flex flex-col justify-center border-r border-white border-opacity-5">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Protocol</span>
                                    <span className={`text-xs font-bold uppercase tracking-widest ${booking.status === 'confirmed' ? 'text-green-400' : 'text-primary'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="flex-grow p-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-serif italic text-white leading-none">{(booking.event as any).title || 'Untitled Masterpiece'}</h3>
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
                                        <span className="text-2xl font-display font-medium text-white px-8">${booking.price.toLocaleString()}</span>
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
