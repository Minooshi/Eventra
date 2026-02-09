import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'organizer' | 'provider'>('organizer');
    const [error, setError] = useState('');
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', {
                name,
                email,
                password,
                role
            });
            auth?.login(data);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">I am a:</label>
                    <select
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={role}
                        onChange={(e) => setRole(e.target.value as 'organizer' | 'provider')}
                    >
                        <option value="organizer">Event Organizer</option>
                        <option value="provider">Service Provider</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 rounded-md hover:bg-indigo-700 transition"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
