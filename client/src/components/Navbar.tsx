import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User as UserIcon, Calendar } from 'lucide-react';
const Navbar = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        auth?.logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold text-primary">
                        EVENTRA
                    </Link>

                    <div className="flex items-center space-x-4">
                        {auth?.user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-600 hover:text-primary flex items-center">
                                    <Calendar className="w-5 h-5 mr-1" />
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <UserIcon className="w-5 h-5" />
                                    <span>{auth.user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition flex items-center"
                                >
                                    <LogOut className="w-4 h-4 mr-1" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-primary">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
