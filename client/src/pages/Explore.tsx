import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Star, MapPin, ArrowRight, Camera, Music, Utensils, Home } from 'lucide-react';

const Explore = () => {
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Photography', 'Music', 'Catering', 'Venues', 'Decor'];

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const { data } = await api.get('/providers');
                setProviders(data);
                setLoading(true);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProviders();
    }, []);

    const filteredProviders = providers.filter(p => {
        const matchSearch = p.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchSearch && matchCategory;
    });

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
            {/* Hero / Search */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-serif italic gold-text">A Curated Collection</h1>
                <p className="text-white text-opacity-40 text-sm font-light uppercase tracking-widest leading-loose">Discover the finest artisans for your orchestration</p>

                <div className="max-w-2xl mx-auto mt-10 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white text-opacity-20" />
                    <input
                        type="text"
                        placeholder="Search by designer or specialty..."
                        className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-full py-5 pl-16 pr-8 text-white focus:outline-none focus:border-primary transition-all font-light text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex justify-center space-x-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${selectedCategory === cat
                                ? 'bg-primary text-black border-primary shadow-gold-glow'
                                : 'bg-white bg-opacity-[0.02] border-white border-opacity-5 text-white text-opacity-40 hover:text-opacity-100 hover:border-opacity-20'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Providers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="glass-card h-[400px] animate-pulse opacity-20"></div>
                    ))
                ) : filteredProviders.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-white text-opacity-20 italic font-serif text-xl">No artisans matching your selection could be found.</p>
                    </div>
                ) : (
                    filteredProviders.map(p => (
                        <Link
                            key={p._id}
                            to={`/providers/${p._id}`}
                            className="group glass-card border-opacity-5 hover:border-primary hover:border-opacity-20 transition-all p-0 overflow-hidden"
                        >
                            {/* Card Image Placeholder */}
                            <div className="h-48 bg-premium-dark relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-gold-gradient opacity-[0.03]"></div>
                                {p.category === 'Photography' && <Camera className="w-16 h-16 text-white text-opacity-5" />}
                                {p.category === 'Music' && <Music className="w-16 h-16 text-white text-opacity-5" />}
                                {p.category === 'Catering' && <Utensils className="w-16 h-16 text-white text-opacity-5" />}
                                {p.category === 'Venues' && <Home className="w-16 h-16 text-white text-opacity-5" />}

                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-luxury-black to-transparent">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1">{p.category}</span>
                                            <h3 className="text-xl font-serif text-white">{p.user?.name}</h3>
                                        </div>
                                        <div className="flex items-center space-x-1 text-primary">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-xs font-bold">{p.rating || '5.0'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <p className="text-sm text-white text-opacity-40 italic line-clamp-2 font-light">
                                    {p.bio || "Exquisite craftsmanship and unparalleled attention to detail for the most discerning clients."}
                                </p>

                                <div className="flex items-center space-x-2 text-white text-opacity-20">
                                    <MapPin className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{p.location || "Global Presence"}</span>
                                </div>

                                <div className="pt-4 flex justify-between items-center border-t border-white border-opacity-5">
                                    <div className="text-xs">
                                        <span className="text-white text-opacity-20 block uppercase tracking-tighter text-[8px] font-black">Starting Investment</span>
                                        <span className="text-white font-medium">${p.pricingPackages?.[0]?.price || '2,500'}+</span>
                                    </div>
                                    <div className="p-2 rounded-full bg-white bg-opacity-[0.03] group-hover:bg-primary group-hover:text-black transition-all">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Explore;
