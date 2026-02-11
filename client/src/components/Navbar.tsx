import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Calendar, LogOut, Menu } from 'lucide-react';


const Navbar = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        auth?.logout();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-luxury-black bg-opacity-50 backdrop-blur-md border-b border-white border-opacity-10 px-6 py-4">
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
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-1 text-white text-opacity-60 hover:text-red-400 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-tighter">Sign Out</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-6">
                            <Link to="/services" className="text-sm font-bold text-white hover:text-primary transition-colors">
                                SERVICES
                            </Link>
                            <Link to="/login" className="text-[10px] font-black tracking-widest text-white hover:text-primary transition-colors">
                                ORGANIZER LOGIN
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
    );
};

export default Navbar;
