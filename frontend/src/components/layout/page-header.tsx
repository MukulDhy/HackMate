import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
    centered?: boolean;
    className?: string;
    variant?: 'default' | 'hero' | 'minimal';
}

export function PageHeader({
    title,
    subtitle,
    children,
    centered = true,
    className = '',
    variant = 'default',
}: PageHeaderProps) {
    const variants = {
        default: 'pt-24 pb-8',
        hero: 'pb-20',
        minimal: 'pt-20 pb-6',
    };

    const titleSizes = {
        default: 'text-3xl md:text-4xl',
        hero: 'text-4xl md:text-5xl lg:text-6xl',
        minimal: 'text-2xl md:text-3xl',
    };

    return (
        <section className={`${variants[variant]} px-4 ${className}`}>
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={centered ? 'text-center' : ''}
                >
                    {variant === 'hero' ? (
                        <GlassCard className="mx-auto max-w-4xl p-12">
                            <h1
                                className={`font-orbitron font-bold ${titleSizes[variant]} text-foreground mb-6`}
                            >
                                {title}
                            </h1>
                            {subtitle && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
                                >
                                    {subtitle}
                                </motion.p>
                            )}
                            {children && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {children}
                                </motion.div>
                            )}
                        </GlassCard>
                    ) : (
                        <>
                            <h1
                                className={`font-orbitron font-bold ${titleSizes[variant]} text-foreground mb-4`}
                            >
                                {title}
                            </h1>
                            {subtitle && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto"
                                >
                                    {subtitle}
                                </motion.p>
                            )}
                            {children && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {children}
                                </motion.div>
                            )}
                        </>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
