import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BackgroundVideo from './components/BackgroundVideo';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import Services from './pages/Services';
import CollaborationWorkspace from './pages/CollaborationWorkspace';
import ProviderDetail from './pages/ProviderDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen text-white selection:bg-primary selection:text-black overflow-x-hidden">
        <BackgroundVideo />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-24 pb-20 animate-fade-in">
            <Routes>

              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/services" element={<Services />} />
              <Route path="/workspace/:eventId" element={<CollaborationWorkspace />} />
              <Route path="/providers/:id" element={<ProviderDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>

          </main>
          {/* <Footer /> */}
        </div>
      </div>
    </Router>
  );
}

export default App;
