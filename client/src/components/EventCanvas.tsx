import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import api from '../services/api';

interface EventCanvasProps {
    onSuccess: (event: any) => void;
    onClose?: () => void;
    initialType?: string;
    initialDate?: Date | null;
    initialBudget?: number;
}

const EventCanvas: React.FC<EventCanvasProps> = ({ onSuccess, onClose, initialType, initialDate, initialBudget }) => {
    const [newEvent, setNewEvent] = useState({
        title: '',
        type: initialType || '',
        date: initialDate ? initialDate.toISOString() : new Date().toISOString(),
        location: '',
        guestCount: '',
        budget: initialBudget !== undefined ? String(initialBudget) : '',
        description: ''
    });
    const [error, setError] = useState('');

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

        try {
            const eventData = {
                title: newEvent.title || `${newEvent.type} Vision`,
                type: newEvent.type,
                date: newEvent.date,
                location: 'Flexible',
                guestCount: Number(newEvent.guestCount),
                budget: Number(newEvent.budget),
                description: ''
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
        }
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

            <form onSubmit={handleCreateEvent} className="space-y-6 relative z-10 w-full max-w-md mx-auto">
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
                        <option value="Wedding" className="bg-luxury-black font-serif italic text-primary">Wedding</option>
                        <option value="Birthday" className="bg-luxury-black font-serif italic text-primary">Birthday</option>
                        <option value="Corporate" className="bg-luxury-black font-serif italic text-primary">Corporate</option>
                        <option value="Custom" className="bg-luxury-black font-serif italic text-primary">Custom</option>
                    </select>
                </div>

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

                <div className="pt-4 border-t border-white border-opacity-5">
                    <button
                        type="submit"
                        className="w-full button-primary flex justify-center items-center group"
                    >
                        BEGIN ORCHESTRATION
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>


            </form>
        </div>
    );
};

export default EventCanvas;
