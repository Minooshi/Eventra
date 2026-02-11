import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await api.post('/auth/login', { email, password });
            auth?.login(data);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'The credentials provided do not match our records.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center -mt-16 relative">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary opacity-5 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md p-8 glass-card">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-gold-gradient rounded-xl mb-4 shadow-gold-glow">
                        <Sparkles className="w-6 h-6 text-black" />
                    </div>
                    <h2 className="text-3xl font-serif mb-2">Welcome Back</h2>
                    <p className="text-white text-opacity-40 text-sm font-light uppercase tracking-widest">Enter the world of Eventra</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-xl mb-6 text-red-400 text-xs text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-40 ml-1">Email Portfolio</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white text-opacity-20" />
                            <input
                                type="email"
                                name="email"
                                className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white placeholder-opacity-20 focus:outline-none focus:border-primary transition-all font-light"
                                placeholder="name@luxury.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="off"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-40 ml-1">Private Key</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white text-opacity-20" />
                            <input
                                type="password"
                                name="password"
                                className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white placeholder-opacity-20 focus:outline-none focus:border-primary transition-all font-light"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full button-primary flex justify-center items-center group"
                    >
                        UNVEIL DASHBOARD
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-white text-opacity-40 text-xs">
                        New to Eventra? {' '}
                        <Link to="/register" className="gold-text font-bold hover:underline">Begin Your Journey</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

