import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="text-center mt-20">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Page not found</p>
            <Link to="/" className="text-primary hover:underline">
                Go back home
            </Link>
        </div>
    );
};

export default NotFound;
