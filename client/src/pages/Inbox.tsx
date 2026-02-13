import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import {
    MessageSquare,
    Send,
    User,
    Clock,
    Sparkles,
    Search,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Inbox = () => {
    const auth = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const initialUserId = searchParams.get('userId');

    const [chats, setChats] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const { data } = await api.get('/chats');
                setChats(data);

                if (initialUserId) {
                    // Try to access or create chat with this user
                    const res = await api.post('/chats', { userId: initialUserId });
                    setSelectedChat(res.data);
                    setMessages(res.data.messages || []);

                    // If chat isn't in current list, add it
                    if (!data.find((c: any) => c._id === res.data._id)) {
                        setChats([res.data, ...data]);
                    }
                } else if (data.length > 0) {
                    setSelectedChat(data[0]);
                    setMessages(data[0].messages || []);
                }
            } catch (error) {
                console.error("Error fetching chats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [initialUserId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        setSending(true);
        try {
            const { data } = await api.post('/chats/message', {
                chatId: selectedChat._id,
                content: newMessage
            });
            setMessages(data.messages);
            setNewMessage('');

            // Update chat list summary
            setChats(chats.map(c => c._id === selectedChat._id ? data : c));
        } catch (error) {
            console.error("Error sending message", error);
        } finally {
            setSending(false);
        }
    };

    const selectChat = (chat: any) => {
        setSelectedChat(chat);
        setMessages(chat.messages || []);
    };

    const getOtherParticipant = (chat: any) => {
        return chat.participants.find((p: any) => p._id !== auth?.user?._id);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-primary animate-pulse" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 h-[calc(100vh-160px)] flex gap-6">
            {/* Sidebar: Chat List */}
            <div className={`w-full lg:w-96 flex flex-col glass-card border-opacity-5 overflow-hidden ${selectedChat ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-6 border-b border-white border-opacity-5">
                    <h1 className="text-2xl font-serif italic gold-text mb-4">Message Sync</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white text-opacity-30" />
                        <input
                            type="text"
                            placeholder="Find alliance..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-primary transition-all"
                        />
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-2 space-y-1">
                    {chats.filter(c => {
                        const other = getOtherParticipant(c);
                        return other?.name.toLowerCase().includes(searchTerm.toLowerCase());
                    }).map((chat) => {
                        const other = getOtherParticipant(chat);
                        const lastMsg = chat.messages[chat.messages.length - 1];
                        const isActive = selectedChat?._id === chat._id;

                        return (
                            <button
                                key={chat._id}
                                onClick={() => selectChat(chat)}
                                className={`w-full flex items-center p-4 rounded-xl transition-all ${isActive
                                        ? 'bg-primary bg-opacity-10 border border-primary border-opacity-20'
                                        : 'hover:bg-white hover:bg-opacity-[0.02] border border-transparent'
                                    }`}
                            >
                                <div className="w-12 h-12 rounded-full bg- Luxury-black border border-white border-opacity-10 flex items-center justify-center mr-4">
                                    <User className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-white text-opacity-20'}`} />
                                </div>
                                <div className="flex-grow text-left overflow-hidden">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-white text-opacity-70'}`}>
                                            {other?.name || 'Private Member'}
                                        </span>
                                        {lastMsg && (
                                            <span className="text-[10px] text-white text-opacity-20 flex items-center">
                                                <Clock className="w-2 h-2 mr-1" />
                                                {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-white text-opacity-30 truncate">
                                        {lastMsg?.content || 'No transmissions yet.'}
                                    </p>
                                </div>
                                <ChevronRight className={`w-4 h-4 ml-2 transition-opacity ${isActive ? 'opacity-100 text-primary' : 'opacity-0'}`} />
                            </button>
                        );
                    })}

                    {chats.length === 0 && (
                        <div className="p-12 text-center">
                            <MessageSquare className="w-8 h-8 text-white text-opacity-10 mx-auto mb-4" />
                            <p className="text-xs text-white text-opacity-20 italic">No existing alliances.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main: Chat View */}
            <div className={`flex-grow flex flex-col glass-card border-opacity-5 overflow-hidden ${!selectedChat ? 'hidden lg:flex' : 'flex'}`}>
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-6 border-b border-white border-opacity-5 flex items-center justify-between">
                            <div className="flex items-center">
                                <button
                                    onClick={() => setSelectedChat(null)}
                                    className="lg:hidden mr-4 p-2 rounded-full hover:bg-white hover:bg-opacity-5"
                                >
                                    <ArrowLeft className="w-5 h-5 text-primary" />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-4">
                                    <User className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">{getOtherParticipant(selectedChat)?.name}</h3>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[10px] text-white text-opacity-30 uppercase tracking-[0.2em] font-bold">Secure Protocol Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            {messages.map((msg, idx) => {
                                const isMe = msg.sender._id === auth?.user?._id || msg.sender === auth?.user?._id;

                                return (
                                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] group`}>
                                            <div className={`p-4 rounded-2xl text-sm ${isMe
                                                    ? 'bg-primary bg-opacity-10 border border-primary border-opacity-20 text-white rounded-tr-none'
                                                    : 'bg-white bg-opacity-[0.03] border border-white border-opacity-5 text-white text-opacity-80 rounded-tl-none'
                                                }`}>
                                                {msg.content}
                                            </div>
                                            <div className={`flex items-center mt-2 text-[8px] text-white text-opacity-20 uppercase tracking-widest ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-6 border-t border-white border-opacity-5">
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    placeholder="Execute transmission..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-grow bg-white bg-opacity-[0.03] border border-white border-opacity-10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-primary transition-all"
                                />
                                <button
                                    disabled={sending || !newMessage.trim()}
                                    type="submit"
                                    className="p-4 rounded-2xl bg-gold-gradient text-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                >
                                    {sending ? <Sparkles className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center p-12 text-center opacity-20">
                        <MessageSquare className="w-20 h-20 mb-6" />
                        <h2 className="text-xl font-serif italic mb-2">Select an Alliance</h2>
                        <p className="text-xs uppercase tracking-[0.3em]">Initialize synchronization to begin collaboration</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;
