import { Link } from 'react-router-dom';
import {
    Camera,
    Sparkles,
    Palette,
    Scissors,
    Mail,
    GlassWater as Cake,
    Music,
    Utensils,
    ArrowRight
} from 'lucide-react';

const categories = [
    {
        name: 'Photography & Videography',
        icon: <Camera className="w-8 h-8" />,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
        description: 'Capture every cinematic moment of your celebration.'
    },
    {
        name: 'Decorations',
        icon: <Sparkles className="w-8 h-8" />,
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
        description: 'Transform spaces into breathtaking visual masterpieces.'
    },
    {
        name: 'Beauticians',
        icon: <Palette className="w-8 h-8" />,
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800',
        description: 'Elite artistry for your most radiant appearance.'
    },
    {
        name: 'Dressing & Styling',
        icon: <Scissors className="w-8 h-8" />,
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
        description: 'Couture elegance tailored to your unique aesthetic.'
    },
    {
        name: 'Invitation Designers',
        icon: <Mail className="w-8 h-8" />,
        image: 'https://images.unsplash.com/photo-1532417344469-368f9ae6d187?auto=format&fit=crop&q=80&w=800',
        description: 'The first whisper of your grand orchestration.'
    },
    {
        name: 'Cake Bakers',
        icon: <Cake className="w-8 h-8" />,
        image: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=800',
        description: 'Exquisite confections that taste as divine as they look.'
    },
    {
        name: 'Entertainment',
        icon: <Music className="w-8 h-8" />,
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800',
        description: 'Curated performances that resonate with the soul.'
    },
    {
        name: 'Catering Services',
        icon: <Utensils className="w-8 h-8" />,
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=800',
        description: 'A culinary journey through rare flavors and textures.'
    }
];

const Services = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
            <div className="text-center space-y-4">
                <h1 className="text-5xl md:text-6xl font-serif italic gold-text">Service Marketplace</h1>
                <p className="text-white text-opacity-40 text-sm font-light uppercase tracking-[0.3em] leading-loose max-w-2xl mx-auto">
                    A curated ecosystem of elite artisans, designers, and orchestrators dedicated to your vision.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {categories.map((category, index) => (
                    <Link
                        key={index}
                        to={`/explore?category=${encodeURIComponent(category.name)}`}
                        className="group relative h-96 rounded-2xl overflow-hidden glass-card p-0 border-opacity-5 hover:border-primary hover:border-opacity-30 transition-all duration-500"
                    >
                        {/* Image Background */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover opacity-100 group-hover:scale-110 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 h-full p-8 flex flex-col justify-end">
                            <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-500 origin-left">
                                {category.icon}
                            </div>
                            <h3 className="text-2xl font-serif text-white mb-2 group-hover:gold-text transition-colors">
                                {category.name}
                            </h3>
                            <p className="text-sm text-white text-opacity-50 font-light mb-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                {category.description}
                            </p>
                            <div className="flex items-center text-xs font-bold uppercase tracking-widest text-primary group-hover:gap-2 transition-all">
                                <span>Discover Artisans</span>
                                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Services;
