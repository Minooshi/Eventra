import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import OrganizerDashboard from '../components/OrganizerDashboard';
import ProviderDashboard from '../components/ProviderDashboard';
import { User, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
    const auth = useContext(AuthContext);

    if (!auth?.user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-white text-opacity-40 italic font-serif">Please re-enter the orchestration.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background ambiance */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary opacity-[0.03] blur-[150px] rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#A67C00] opacity-[0.03] blur-[150px] rounded-full"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Welcome Banner */}
                <div className="glass-card mb-12 p-8 flex flex-col md:flex-row justify-between items-center border-opacity-5">
                    <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 rounded-full bg-gold-gradient p-[1px]">
                            <div className="w-full h-full rounded-full bg-luxury-black flex items-center justify-center">
                                <User className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-2xl font-serif">Welcome, {auth.user.name}</h1>
                                {auth.user.role === 'provider' && <ShieldCheck className="w-4 h-4 text-primary" />}
                            </div>
                            <p className="text-xs font-bold uppercase tracking-widest text-white text-opacity-30">
                                Status: {auth.user.role === 'organizer' ? 'Royal Planner' : 'Master Designer'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Router */}
                <div className="pb-20">
                    {auth.user.role === 'organizer' ? <OrganizerDashboard /> : <ProviderDashboard />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
