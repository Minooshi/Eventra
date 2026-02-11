import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Lock, Briefcase, Sparkles, ArrowRight } from 'lucide-react';

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
        setError('');
        try {
            const { data } = await api.post('/auth/register', { name, email, password, role });
            auth?.login(data);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center -mt-16 mb-20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary opacity-5 blur-[150px] rounded-full"></div>

            <div className="w-full max-w-xl p-8 glass-card">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-gold-gradient rounded-xl mb-4 shadow-gold-glow">
                        <Sparkles className="w-6 h-6 text-black" />
                    </div>
                    <h2 className="text-3xl font-serif mb-2 text-glow">Start Your Legacy</h2>
                    <p className="text-white text-opacity-40 text-sm font-light uppercase tracking-widest leading-loose">Choose your role in the orchestration</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-xl mb-6 text-red-400 text-xs text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setRole('organizer')}
                            className={"p-4 rounded-xl border transition-all flex flex-col items-center justify-center space-y-2 " + (role === 'organizer' ? "bg-primary bg-opacity-10 border-primary shadow-gold-glow" : "bg-white bg-opacity-[0.02] border-white border-opacity-5 grayscale hover:grayscale-0")}
                        >
                            <User className={"w-6 h-6 " + (role === 'organizer' ? "text-primary" : "text-white text-opacity-20")} />
                            <span className="text-[10px] font-bold tracking-widest uppercase">Organizer</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('provider')}
                            className={"p-4 rounded-xl border transition-all flex flex-col items-center justify-center space-y-2 " + (role === 'provider' ? "bg-primary bg-opacity-10 border-primary shadow-gold-glow" : "bg-white bg-opacity-[0.02] border-white border-opacity-5 grayscale hover:grayscale-0")}
                        >
                            <Briefcase className={"w-6 h-6 " + (role === 'provider' ? "text-primary" : "text-white text-opacity-20")} />
                            <span className="text-[10px] font-bold tracking-widest uppercase">Provider</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-40 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white text-opacity-20" />
                                <input
                                    type="text"
                                    className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white placeholder-opacity-20 focus:outline-none focus:border-primary transition-all font-light"
                                    placeholder="Alexander Wright"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-40 ml-1">Email Portfolio</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white text-opacity-20" />
                                <input
                                    type="email"
                                    className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white placeholder-opacity-20 focus:outline-none focus:border-primary transition-all font-light"
                                    placeholder="name@luxury.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white text-opacity-40 ml-1">Private Key</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white text-opacity-20" />
                            <input
                                type="password"
                                className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white placeholder-opacity-20 focus:outline-none focus:border-primary transition-all font-light"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full button-primary flex justify-center items-center group py-4"
                    >
                        CREATE ACCOUNT
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-white text-opacity-40 text-xs">
                        Already have an account? {' '}
                        <Link to="/login" className="gold-text font-bold hover:underline">Re-enter Eventra</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
