import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

interface EventCanvasProps {
    onSuccess: (event: any) => void;
    onClose?: () => void;
}

const EventCanvas: React.FC<EventCanvasProps> = ({ onSuccess, onClose }) => {
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

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
        setIsSubmitting(true);

        if (!newEvent.date) {
            setError('Please select a Grand Premiere Date in the orchestration calendar.');
            setIsSubmitting(false);
            return;
        }

        try {
            const eventData = {
                ...newEvent,
                guestCount: Number(newEvent.guestCount),
                budget: Number(newEvent.budget)
            };

            const res = await api.post('/events', eventData);
            onSuccess(res.data);
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
        } finally {
            setIsSubmitting(false);
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
        <div className="glass-card p-8 border-primary border-opacity-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles className="w-24 h-24" />
            </div>

            <div className="flex justify-between items-start mb-8">
                <h2 className="text-2xl font-serif italic">Define Your Vision</h2>
                {onClose && (
                    <button onClick={onClose} className="text-white text-opacity-40 hover:text-white text-xs uppercase tracking-widest">
                        Cancel
                    </button>
                )}
            </div>

            {error && (
                <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-xl mb-6 text-red-400 text-xs text-center">
                    {error}
                </div>
            )}

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
                        disabled={isSubmitting}
                        className="button-primary px-12 group flex items-center disabled:opacity-50"
                    >
                        {isSubmitting ? 'INITIATING...' : 'BEGIN ORCHESTRATION'}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EventCanvas;
