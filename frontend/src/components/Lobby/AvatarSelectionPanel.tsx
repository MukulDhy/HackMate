import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const avatars = [
    { id: 'default1', label: 'Futuristic Male' },
    { id: 'default2', label: 'Futuristic Female' },
    { id: 'default3', label: 'Robot' },
    { id: 'default4', label: 'Hacker' },
];

export default function AvatarSelectionPanel({
    open,
    onClose,
    onSave,
}: {
    open: boolean;
    onClose: () => void;
    onSave: (avatar: string) => void;
}) {
    const [selected, setSelected] = useState('default1');

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed top-0 right-0 w-full max-w-md h-full z-50 bg-glass backdrop-blur-2xl border-l border-glass-border shadow-xl neon-glow flex flex-col"
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
            >
                <div className="p-8 flex-1 flex flex-col">
                    <h2 className="font-orbitron text-2xl mb-6 text-neon-cyan">
                        Select Your Avatar
                    </h2>
                    <div className="flex gap-4 mb-8 justify-center">
                        {avatars.map((a) => (
                            <button
                                key={a.id}
                                className={`rounded-xl p-4 border-2 transition-all ${
                                    selected === a.id
                                        ? 'border-neon-cyan bg-gradient-card neon-glow'
                                        : 'border-glass-border bg-glass'
                                }`}
                                onClick={() => setSelected(a.id)}
                            >
                                <div className="w-20 h-20 bg-gradient-primary rounded-full mb-2 flex items-center justify-center text-xl font-bold">
                                    {a.label[0]}
                                </div>
                                <div className="text-sm">{a.label}</div>
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-4 mt-auto">
                        <button
                            className="flex-1 py-3 rounded-xl bg-gradient-primary neon-glow text-white font-bold text-lg"
                            onClick={() => onSave(selected)}
                        >
                            Save & Confirm
                        </button>
                        <button
                            className="flex-1 py-3 rounded-xl bg-glass border border-glass-border text-foreground font-bold text-lg"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
