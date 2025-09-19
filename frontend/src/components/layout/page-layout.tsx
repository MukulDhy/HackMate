import { BackgroundScene } from '@/components/3d/background-scene';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageLayoutProps {
    children: ReactNode;
    className?: string;
    showBackground?: boolean;
    contentClassName?: string;
    animated?: boolean;
}

export function PageLayout({
    children,
    className = '',
    showBackground = true,
    contentClassName = '',
    animated = true,
}: PageLayoutProps) {
    const content = animated ? (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={contentClassName}
        >
            {children}
        </motion.div>
    ) : (
        <div className={contentClassName}>{children}</div>
    );

    return (
        <div
            className={`min-h-screen animated-bg relative overflow-hidden ${className}`}
        >
            {showBackground && (
                <BackgroundScene className="absolute inset-0 w-full h-full" />
            )}
            <div className="relative z-10">{content}</div>
        </div>
    );
}
