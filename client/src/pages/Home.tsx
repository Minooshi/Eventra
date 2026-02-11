import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Play, Star, ShieldCheck, Heart } from 'lucide-react';

const Home = () => {
    return (
        <div className="relative -mt-8 overflow-hidden">
            {/* Cinematic Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20">
                {/* Visual Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-premium-dark opacity-90"></div>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary opacity-5 blur-[120px] rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#A67C00] opacity-5 blur-[150px] rounded-full"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-white border-opacity-10 bg-white bg-opacity-5 mb-8 animate-float">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-white text-opacity-80">
                            The World's Most Elite Event Platform
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-serif leading-tight mb-6">
                        Design your event. <br />
                        <span className="gold-text italic">We orchestrate the magic.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-white text-opacity-60 font-light mb-12 leading-relaxed">
                        Step into a world where event planning becomes an art form. From visual canvas design to elite service curation, Eventra is your private architect for unforgettable moments.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                        <Link to="/register" className="button-primary group flex items-center">
                            CREATE MY EVENT
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/explore" className="button-secondary group flex items-center">
                            EXPLORE EXPERIENCES
                            <Play className="ml-2 w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Bottom Gradient Fade */}
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-luxury-black to-transparent"></div>
            </section>

            {/* Experience Tiers / Categories Section */}
            <section className="py-24 px-6 relative z-10 bg-luxury-black">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                        <div className="max-w-xl">
                            <h2 className="text-4xl md:text-5xl mb-4">Masterpieces in <br /> <span className="gold-text italic">Every Detail</span></h2>
                            <p className="text-white text-opacity-50">Select your canvas and let our curated designers bring your vision to life.</p>
                        </div>
                        <Link to="/explore" className="text-primary font-bold tracking-widest text-sm hover:underline mt-4 md:mt-0 uppercase">View All Categories</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'The Royal Wedding', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', tag: 'Luxury' },
                            { title: 'Corporate Galas', img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800', tag: 'Elite' },
                            { title: 'Private Soirées', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800', tag: 'Intimate' },
                        ].map((exp, i) => (
                            <div key={i} className="group relative aspect-[4/5] overflow-hidden rounded-2xl glass-card border-0">
                                <img
                                    src={exp.img}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700"
                                    alt={exp.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                <div className="absolute bottom-0 left-0 p-8">
                                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary mb-2 block">{exp.tag}</span>
                                    <h3 className="text-2xl font-serif text-white group-hover:gold-text transition-colors">{exp.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Markers */}
            <section className="py-20 border-y border-white border-opacity-5 bg-white bg-opacity-[0.02]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <ShieldCheck className="w-10 h-10 text-primary mb-4" />
                        <h4 className="text-lg font-display uppercase tracking-wider mb-2">Verified Designers</h4>
                        <p className="text-sm text-white text-opacity-40">Only the top 1% of service providers are invited to join.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Sparkles className="w-10 h-10 text-primary mb-4" />
                        <h4 className="text-lg font-display uppercase tracking-wider mb-2">Artistic Direction</h4>
                        <p className="text-sm text-white text-opacity-40">Interactive tools to visualize your event before booking.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Heart className="w-10 h-10 text-primary mb-4" />
                        <h4 className="text-lg font-display uppercase tracking-wider mb-2">Emotion First</h4>
                        <p className="text-sm text-white text-opacity-40">Designs that resonate on a deep, cinematic level.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
