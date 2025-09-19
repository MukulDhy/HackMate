import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Loader2, Zap } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'neon' | 'minimal';
    text?: string;
    className?: string;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
};

export function LoadingSpinner({
    size = 'md',
    variant = 'default',
    text,
    className,
}: LoadingSpinnerProps) {
    const Spinner = variant === 'neon' ? Zap : Loader2;

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-3',
                className,
            )}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: variant === 'neon' ? 0.8 : 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className={cn(
                    'flex items-center justify-center',
                    variant === 'neon' && 'text-primary drop-shadow-glow',
                    variant === 'minimal' && 'text-muted-foreground',
                )}
            >
                <Spinner className={cn(sizeClasses[size])} />
            </motion.div>

            {text && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                        'text-sm text-muted-foreground',
                        variant === 'neon' && 'text-primary',
                    )}
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
}

export function PageLoader({ text = 'Loading...' }: { text?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <LoadingSpinner size="xl" variant="neon" text={text} />
        </div>
    );
}
