import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Event, Booking } from '../types';

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

        try {
            const eventData = {
                ...newEvent,
                guestCount: Number(newEvent.guestCount),
                budget: Number(newEvent.budget)
            };

            const res = await api.post('/events', eventData);
            setEvents(prev => [...prev, res.data]);
            setSuccess('Event created successfully!');
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
            setError(err.response?.data?.message || 'Failed to create event');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Organizer Dashboard</h1>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                    {showCreateForm ? 'Cancel' : 'Create New Event'}
                </button>
            </div>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">{success}</div>}

            {showCreateForm && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Event Title</label>
                            <input
                                type="text"
                                name="title"
                                value={newEvent.title}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Event Type</label>
                            <select
                                name="type"
                                value={newEvent.type}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Birthday">Birthday</option>
                                <option value="Conference">Conference</option>
                                <option value="Party">Party</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={newEvent.date}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={newEvent.location}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Guest Count</label>
                            <input
                                type="number"
                                name="guestCount"
                                value={newEvent.guestCount}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                                min="1"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Budget ($)</label>
                            <input
                                type="number"
                                name="budget"
                                value={newEvent.budget}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                                min="0"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                            <textarea
                                name="description"
                                value={newEvent.description}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                            />
                        </div>
                        <div className="col-span-2 flex justify-end">
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Create Event
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div>
                <h2 className="text-2xl font-bold mb-4">My Events</h2>
                {events.length === 0 ? (
                    <p className="text-gray-500">No events created yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <div key={event._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-xl text-gray-900">{event.title}</h3>
                                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-semibold">{event.type}</span>
                                </div>
                                <p className="text-gray-600 mb-2 flex items-center">
                                    <span className="mr-2">📅</span>
                                    {new Date(event.date).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600 mb-2 flex items-center">
                                    <span className="mr-2">📍</span>
                                    {event.location}
                                </p>
                                <div className="mt-4 flex justify-between text-sm text-gray-500 border-t pt-4">
                                    <span>👥 {event.guestCount} Guests</span>
                                    <span>💰 ${event.budget.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Bookings</h2>
                {bookings.length === 0 ? (
                    <p className="text-gray-500">No bookings yet.</p>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.map(booking => (
                                    <tr key={booking._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.serviceName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(booking.provider as any).name || 'Unknown'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrganizerDashboard;
