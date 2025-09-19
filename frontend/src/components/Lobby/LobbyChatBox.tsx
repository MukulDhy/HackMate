// src/components/Lobby/LobbyChatBox.tsx
import { FormEvent, useEffect, useRef, useState } from 'react';

export interface LobbyChatMessage {
    user: string;
    text: string;
}

export interface LobbyChatBoxProps {
    messages: LobbyChatMessage[];
    onSend: (msg: string) => void;
}

export default function LobbyChatBox({ messages, onSend }: LobbyChatBoxProps) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll when new messages come in
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSend(input.trim());
        setInput('');
    };

    return (
        <div className="absolute bottom-8 right-8 w-80 z-20 glass-card neon-glow p-4 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 max-h-56 overflow-y-auto mb-3 custom-scrollbar pr-1">
                {messages.length === 0 ? (
                    <div className="text-muted-foreground text-sm text-center">
                        No messages yet. Be the first to say hi 👋
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`mb-2 px-3 py-2 rounded-xl border shadow-sm ${
                                msg.user === 'You'
                                    ? 'bg-gradient-to-r from-purple-500/70 to-pink-500/70 text-white self-end ml-8'
                                    : 'bg-glass border-glass-border text-foreground mr-8'
                            }`}
                        >
                            <b className="font-semibold">{msg.user}:</b>{' '}
                            <span>{msg.text}</span>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Box */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 rounded-lg px-3 py-2 bg-glass border border-glass-border text-foreground focus:ring-2 focus:ring-neon-cyan focus:outline-none"
                    placeholder="Type a message…"
                />
                <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-primary neon-glow text-white font-bold hover:scale-105 transition-transform"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
