import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Search, Star, MapPin, ArrowRight, Camera, Music, Utensils, Sparkles, Palette, Scissors, Mail, GlassWater as Cake } from 'lucide-react';
import portfoliobg from '../assets/portfoliobg.jpg';

const Explore = () => {
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        return `http://localhost:5001${url}`;
    };
    const categories = [
        'All',
        'Photography & Videography',
        'Decorations',
        'Beauticians',
        'Dressing & Styling',
        'Invitation Designers',
        'Cake Bakers',
        'Entertainment',
        'Catering Services'
    ];

    const selectedCategory = searchParams.get('category') || 'All';

    const setSelectedCategory = (cat: string) => {
        if (cat === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', cat);
        }
        setSearchParams(searchParams);
    };

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
        const matchSearch = p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchTerm.toLowerCase());
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="glass-card h-[450px] animate-pulse opacity-20"></div>
                    ))
                ) : filteredProviders.length === 0 ? (
                    <div className="col-span-full py-32 text-center bg-white bg-opacity-[0.02] rounded-3xl border border-white border-opacity-5">
                        <Sparkles className="w-12 h-12 text-primary mx-auto mb-6 opacity-20" />
                        <p className="text-white text-opacity-20 italic font-serif text-2xl">No artisans matching your selection could be found.</p>
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className="mt-6 text-primary text-xs font-bold uppercase tracking-widest hover:underline"
                        >
                            View All Artisans
                        </button>
                    </div>
                ) : (
                    filteredProviders.map(p => (
                        <Link
                            key={p._id}
                            to={`/providers/${p._id}`}
                            className="group relative flex flex-col h-[500px] rounded-3xl overflow-hidden glass-card p-0 border-opacity-5 hover:border-primary hover:border-opacity-30 transition-all duration-700 hover:-translate-y-2 shadow-2xl hover:shadow-gold-glow/20"
                        >
                            {/* Cinematic Background Image */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={getImageUrl(p.portfolio?.[0]?.url) || portfoliobg}
                                    alt={p.user?.name}
                                    className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-1000"
                                />
                                {!p.portfolio?.[0]?.url && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-gold-gradient opacity-10"></div>
                                        {p.category === 'Photography & Videography' && <Camera className="w-20 h-20 text-white text-opacity-5" />}
                                        {p.category === 'Decorations' && <Sparkles className="w-20 h-20 text-white text-opacity-5" />}
                                        {p.category === 'Beauticians' && <Palette className="w-20 h-20 text-white text-opacity-5" />}
                                        {p.category === 'Dressing & Styling' && <Scissors className="w-20 h-20 text-white text-opacity-5" />}
                                        {p.category === 'Invitation Designers' && <Mail className="w-20 h-20 text-white text-opacity-5" />}
                                        {p.category === 'Cake Bakers' && <Cake className="w-20 h-20 text-white text-opacity-5" />}
                                        {p.category === 'Entertainment' && <Music className="w-20 h-20 text-white text-opacity-5" />}
                                        {p.category === 'Catering Services' && <Utensils className="w-20 h-20 text-white text-opacity-5" />}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/60 to-transparent"></div>
                            </div>

                            {/* Content Overlay */}
                            <div className="relative z-10 h-full p-8 flex flex-col justify-end">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="px-3 py-1 bg-primary bg-opacity-10 border border-primary border-opacity-20 rounded-full backdrop-blur-md">
                                        <span className="text-[9px] font-black tracking-[0.2em] uppercase text-primary">{p.category}</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5 px-3 py-1 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-full backdrop-blur-md">
                                        <Star className="w-3 h-3 text-primary fill-primary" />
                                        <span className="text-[10px] font-bold text-white">{p.rating || '5.0'}</span>
                                    </div>
                                </div>

                                <h3 className="text-3xl font-serif text-white mb-2 group-hover:gold-text transition-colors duration-500">
                                    {p.user?.name}
                                </h3>

                                <div className="flex items-center space-x-2 text-white text-opacity-40 mb-6">
                                    <MapPin className="w-3 h-3 text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{p.location || "Global Presence"}</span>
                                </div>

                                <p className="text-sm text-white text-opacity-60 font-light line-clamp-2 mb-8 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                                    {p.bio || "Exquisite craftsmanship and unparalleled attention to detail for the most discerning clients."}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-white border-opacity-10 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                                    <div>
                                        <span className="text-[8px] font-black uppercase tracking-tighter text-white text-opacity-20 block mb-1">Starting Investment</span>
                                        <span className="text-lg font-medium gold-text">RS. {((p.pricingPackages?.[0]?.price || 2500) * 10).toLocaleString()}+</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">View Portfolio</span>
                                        <div className="w-12 h-12 rounded-full bg-white bg-opacity-5 border border-white border-opacity-10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-black transition-all duration-500 shadow-gold-glow/0 group-hover:shadow-gold-glow/50">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
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
