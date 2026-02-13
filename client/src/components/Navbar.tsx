import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Calendar, LogOut, Menu, User, Settings, Trash2, X, Save, MessageSquare } from 'lucide-react';
import api from '../services/api';

const Navbar = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '', password: '' });
    const [isUpdating, setIsUpdating] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (auth?.user) {
            setEditData({ name: auth.user.name, email: auth.user.email, password: '' });
        }
    }, [auth?.user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        auth?.logout();
        navigate('/');
        setIsProfileOpen(false);
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you certain you wish to dissolve your legacy? This action is irreversible and all your data will be permanently erased.")) {
            try {
                await api.delete('/auth/profile');
                auth?.logout();
                navigate('/');
                setIsProfileOpen(false);
            } catch (error) {
                console.error("Error deleting account", error);
                alert("Failed to dissolve account.");
            }
        }
    };

    const handleUpdateAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const { data } = await api.put('/auth/profile', editData);
            auth?.login(data); // Update local storage and context
            setIsEditModalOpen(false);
            alert("Legacy protocol updated successfully.");
        } catch (error) {
            console.error("Error updating account", error);
            alert("Failed to update account.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-luxury-black bg-opacity-50 backdrop-blur-md border-b border-white border-opacity-10 px-6 py-4 animate-fade-in-down">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="p-1.5 bg-gold-gradient rounded-lg shadow-gold-glow">
                            <Sparkles className="text-black w-5 h-5" />
                        </div>
                        <span className="text-2xl font-display font-extrabold tracking-tighter gold-text uppercase">
                            Eventra
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {auth?.user ? (
                            <div className="flex items-center space-x-6">
                                {/* User Profile Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center space-x-3 border-r border-white border-opacity-20 pr-6 mr-2 group"
                                    >
                                        <div className="p-1.5 rounded-full bg-white bg-opacity-10 group-hover:bg-primary group-hover:bg-opacity-20 transition-all">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex flex-col items-start text-left">
                                            <span className="text-sm font-semibold text-white leading-none group-hover:text-primary transition-colors">{auth.user.name}</span>
                                            <span className="text-xs text-primary font-bold tracking-wider uppercase pt-0.5">{auth.user.role}</span>
                                        </div>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileOpen && (
                                        <div className="absolute right-6 mt-4 w-56 glass-card border-opacity-10 bg-luxury-black p-2 shadow-2xl animate-fade-in-up">
                                            <button
                                                onClick={() => { setIsEditModalOpen(true); setIsProfileOpen(false); }}
                                                className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-white text-opacity-70 hover:text-primary hover:bg-white hover:bg-opacity-[0.03] rounded-lg transition-all"
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span>Edit Profile</span>
                                            </button>
                                            <button
                                                onClick={() => { handleDeleteAccount(); setIsProfileOpen(false); }}
                                                className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-400 hover:text-white hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Delete Account</span>
                                            </button>
                                            <div className="h-[1px] bg-white bg-opacity-10 my-2 mx-2"></div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-white text-opacity-40 hover:text-white rounded-lg transition-all"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <Link to="/services" className="text-sm font-bold text-white hover:text-primary transition-colors">
                                    SERVICES
                                </Link>

                                <Link to="/inbox" className="flex items-center space-x-2 text-white hover:text-primary transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-sm font-semibold uppercase tracking-wider">Messages</span>
                                </Link>

                                <Link to="/dashboard" className="flex items-center space-x-2 text-white hover:text-primary transition-colors">
                                    {auth.user.role === 'provider' ? (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            <span className="text-sm font-semibold uppercase tracking-wider">My Studio</span>
                                        </>
                                    ) : (
                                        <>
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm font-semibold uppercase tracking-wider">My Events</span>
                                        </>
                                    )}
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-6">
                                <Link to="/services" className="text-sm font-bold text-white hover:text-primary transition-colors">
                                    SERVICES
                                </Link>
                                <Link to="/login" className="text-sm font-bold text-white hover:text-primary transition-colors">
                                    LOGIN
                                </Link>
                                <Link to="/register" className="button-primary scale-90">
                                    JOIN EVENTRA
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden">
                        <Menu className="text-white w-6 h-6" />
                    </div>
                </div>
            </nav>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
                    <div className="glass-card w-full max-w-md p-8 relative z-10 animate-scale-in">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-6 right-6 text-white text-opacity-40 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-2xl font-serif italic gold-text tracking-tight">Refine Your Legacy</h2>
                            <p className="text-[10px] text-white text-opacity-30 uppercase tracking-[0.2em] font-bold mt-1">Update your account credentials</p>
                        </div>

                        <form onSubmit={handleUpdateAccount} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Identity Name</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary">Email Address</label>
                                <input
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary">New Protocol (Password)</label>
                                <input
                                    type="password"
                                    placeholder="Leave empty to keep current"
                                    value={editData.password}
                                    onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                                    className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full button-primary flex items-center justify-center space-x-2 py-4 shadow-gold-glow"
                            >
                                {isUpdating ? (
                                    <Sparkles className="w-4 h-4 animate-spin text-black" />
                                ) : (
                                    <Save className="w-4 h-4 text-black" />
                                )}
                                <span className="font-bold tracking-[0.2em] text-[10px] uppercase">{isUpdating ? 'Synchronizing...' : 'Sovereign Update'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
