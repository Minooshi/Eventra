import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
                Plan Your Perfect Event with <span className="text-primary">AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                EVENTRA is the all-in-one marketplace for event organizers and service providers.
                Get AI-powered recommendations, manage bookings, and create unforgettable experiences.
            </p>

            <div className="flex space-x-4">
                <Link
                    to="/register"
                    className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
                >
                    Get Started
                </Link>
                <Link
                    to="/login"
                    className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition"
                >
                    Login
                </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 bg-white rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-2">AI Planner</h3>
                    <p className="text-gray-500">Smart suggestions based on your event type and budget.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-2">Verified Providers</h3>
                    <p className="text-gray-500">Connect with top-rated photographers, caterers, and more.</p>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md">
                    <h3 className="text-xl font-bold mb-2">Seamless Booking</h3>
                    <p className="text-gray-500">Real-time chat and secure booking management.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
