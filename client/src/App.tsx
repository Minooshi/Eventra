import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import ProviderDetail from './pages/ProviderDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-luxury-black text-white selection:bg-primary selection:text-black">
        <Navbar />
        <main className="pt-24 pb-20">
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/providers/:id" element={<ProviderDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;
