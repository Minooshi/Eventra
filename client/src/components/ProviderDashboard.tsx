import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Booking } from '../types';

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
        <div>
            <h2 className="text-2xl font-bold mb-4">Booking Requests</h2>
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map(booking => (
                            <tr key={booking._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{(booking.event as any).title || 'Event'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{booking.serviceName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(booking.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {booking.status === 'pending' && (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProviderDashboard;
