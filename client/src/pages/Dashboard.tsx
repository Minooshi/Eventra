import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import OrganizerDashboard from '../components/OrganizerDashboard';
import ProviderDashboard from '../components/ProviderDashboard';
import bg1 from '../assets/bg1.png';

const Dashboard = () => {
    const auth = useContext(AuthContext);

    if (!auth?.user) {
        return <p>Please login</p>;
    }

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed relative"
            style={{ backgroundImage: `url(${bg1})` }}
        >
            {/* Semi-transparent overlay for better readability */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            {/* Content container */}
            <div className="container mx-auto relative z-10 py-8 px-4">
                <div className="bg-white bg-opacity-95 rounded-lg shadow-xl p-8 backdrop-blur-sm">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800">Dashboard</h1>
                    <p className="mb-8 text-gray-600">Welcome, {auth.user.name}</p>

                    {auth.user.role === 'organizer' ? <OrganizerDashboard /> : <ProviderDashboard />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
