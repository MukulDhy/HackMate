import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ContentSectionProps {
    children: ReactNode;
    className?: string;
    containerClassName?: string;
    delay?: number;
    spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ContentSection({
    children,
    className = '',
    containerClassName = '',
    delay = 0,
    spacing = 'lg',
}: ContentSectionProps) {
    const spacingValues = {
        sm: 'py-4 xs:py-5 sm:py-6 md:py-8',
        md: 'py-6 xs:py-7 sm:py-8 md:py-10 lg:py-12',
        lg: 'py-8 xs:py-10 sm:py-12 md:py-14 lg:py-16',
        xl: 'py-10 xs:py-12 sm:py-14 md:py-16 lg:py-18 xl:py-20',
    };

    return (
        <section
            className={`${spacingValues[spacing]} px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 ${className}`}
        >
            <div className={`max-w-7xl mx-auto ${containerClassName}`}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6, delay }}
                >
                    {children}
                </motion.div>
            </div>
        </section>
    );
}
