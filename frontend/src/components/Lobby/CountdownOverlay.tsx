import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CountdownOverlayProps {
    duration?: number; // how many seconds to count down from
    onComplete?: () => void; // callback when countdown hits 0
}

export default function CountdownOverlay({
    duration = 3,
    onComplete,
}: CountdownOverlayProps) {
    const [count, setCount] = useState(duration);

    useEffect(() => {
        if (count <= 0) {
            onComplete?.();
            return;
        }

        const timer = setTimeout(() => {
            setCount((c) => c - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [count, onComplete]);

    return (
        <AnimatePresence>
            {count > 0 && (
                <motion.div
                    key={count}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="fixed inset-0 flex items-center justify-center bg-black/70 z-50"
                >
                    <span className="font-orbitron text-[8rem] text-neon-cyan neon-glow">
                        {count}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
