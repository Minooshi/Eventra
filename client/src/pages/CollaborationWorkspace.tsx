import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import {
    Send,
    Users,
    Paperclip,
    Image as ImageIcon,
    MoreVertical,
    ArrowLeft,
    Sparkles,
    Calendar,
    MapPin
} from 'lucide-react';

const CollaborationWorkspace = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const [event, setEvent] = useState<any>(null);
    const [chat, setChat] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventRes, chatRes] = await Promise.all([
                    api.get(`/events/${eventId}`),
                    api.post('/chats', { eventId })
                ]);
                setEvent(eventRes.data);
                setChat(chatRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [eventId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat?.messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            const { data } = await api.post('/chats/message', {
                chatId: chat._id,
                content: message
            });
            setChat(data);
            setMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-primary animate-pulse" />
    </div>;

    return (
        <div className="max-w-7xl mx-auto px-6 h-[calc(100vh-120px)] flex flex-col space-y-6">
            <header className="flex items-center justify-between pb-6 border-b border-white border-opacity-5">
                <div className="flex items-center space-x-6">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-all">
                        <ArrowLeft className="w-5 h-5 text-white/40" />
                    </button>
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <h1 className="text-2xl font-serif italic text-white">{event?.title}</h1>
                            <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[10px] font-black uppercase tracking-widest text-primary">Collaboration Hub</span>
                        </div>
                        <div className="flex items-center space-x-4 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-primary" />
                                <span>{new Date(event?.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3 text-primary" />
                                <span>{event?.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex -space-x-2 mr-4">
                        {chat?.participants.map((p: any) => (
                            <div key={p._id} className="w-8 h-8 rounded-full border-2 border-luxury-black bg-gold-gradient p-[1px] relative group" title={p.name}>
                                <div className="w-full h-full rounded-full bg-luxury-black flex items-center justify-center text-[10px] font-bold">
                                    {p.name[0]}
                                </div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {p.name}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-full text-white/40"><Users className="w-5 h-5" /></button>
                    <button className="p-2 hover:bg-white/5 rounded-full text-white/40"><MoreVertical className="w-5 h-5" /></button>
                </div>
            </header>

            <div className="flex-1 flex space-x-8 overflow-hidden">
                {/* Chat Area */}
                <div className="flex-1 glass-card flex flex-col p-0 overflow-hidden border-opacity-5">
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                        {chat?.messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <Sparkles className="w-12 h-12 text-primary opacity-20" />
                                <p className="text-white/20 italic font-serif text-xl">The sequence begins here...</p>
                            </div>
                        ) : (
                            chat?.messages.map((msg: any, i: number) => {
                                const isMe = msg.sender._id === auth?.user?._id;
                                return (
                                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] space-y-2`}>
                                            <div className={`flex items-center space-x-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">{msg.sender.name}</span>
                                                <span className="text-[8px] text-white/10">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className={`px-6 py-4 rounded-3xl ${isMe
                                                ? 'bg-primary/10 border border-primary/20 text-white rounded-tr-none shadow-gold-glow/5'
                                                : 'bg-white/5 border border-white/10 text-white rounded-tl-none'
                                                }`}>
                                                <p className="text-sm font-light leading-relaxed">{msg.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={scrollRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-6 bg-white/[0.02] border-t border-white/5">
                        <div className="relative flex items-center">
                            <button type="button" className="absolute left-4 p-2 text-white/20 hover:text-primary transition-colors">
                                <Paperclip className="w-4 h-4" />
                            </button>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Whisper your next creative direction..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-32 text-sm text-white focus:outline-none focus:border-primary transition-all font-light"
                            />
                            <div className="absolute right-4 flex items-center space-x-2">
                                <button type="button" className="p-2 text-white/20 hover:text-primary transition-colors">
                                    <ImageIcon className="w-4 h-4" />
                                </button>
                                <button
                                    type="submit"
                                    className="p-2.5 bg-primary text-black rounded-xl hover:scale-105 transition-all shadow-gold-glow"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sidebar Protocol */}
                <div className="w-80 space-y-6 hidden lg:block overflow-y-auto scrollbar-hide">
                    <div className="glass-card p-6 border-opacity-5">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center">
                            <Sparkles className="w-3 h-3 mr-2" />
                            Confirmed Artisans
                        </h3>
                        <div className="space-y-4">
                            {/* In a real app, we'd fetch actual booked providers for this event */}
                            {chat?.participants.filter((p: any) => p._id !== auth?.user?._id).map((p: any) => (
                                <div key={p._id} className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full bg-gold-gradient p-[1px]">
                                        <div className="w-full h-full rounded-full bg-luxury-black flex items-center justify-center text-xs font-bold">
                                            {p.name[0]}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-white truncate group-hover:gold-text transition-colors">{p.name}</p>
                                        <p className="text-[10px] text-white/30 truncate">Master Designer</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-6 border-opacity-5 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-5">
                            <ImageIcon className="w-24 h-24 text-primary" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-6 font-display">Reference Gallery</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-square rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group overflow-hidden cursor-pointer">
                                    <div className="text-[10px] text-white/10 group-hover:text-primary transition-colors">REF-0{i}</div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 border border-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/20 hover:bg-white/5 transition-all">
                            Add References
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollaborationWorkspace;
