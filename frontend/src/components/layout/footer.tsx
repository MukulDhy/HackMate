import HackMateLogo from '@/assets/HackMate-logo.png';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Github, Linkedin, Mail, Twitter, Zap } from 'lucide-react';

const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
];

const footerSections = [
    {
        title: 'Platform',
        links: ['Dashboard', 'Lobbies', 'Teams', 'Leaderboard'],
    },
    {
        title: 'Community',
        links: ['Discord', 'Forums', 'Events', 'Blog'],
    },
    {
        title: 'Resources',
        links: ['Documentation', 'API', 'Tutorials', 'Support'],
    },
    {
        title: 'Company',
        links: ['About', 'Careers', 'Privacy', 'Terms'],
    },
];

export function Footer() {
    return (
        <footer className="mt-20 border-t border-glass-border">
            <div className="">
                <GlassCard className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                        {/* Logo and Description */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src={HackMateLogo}
                                    alt="HackMate"
                                    className="w-8 h-8"
                                />
                                <span className="font-orbitron font-bold text-xl text-foreground">
                                    HackMate
                                </span>
                                <Zap className="w-4 h-4 text-neon-cyan animate-pulse" />
                            </div>
                            <p className="text-muted-foreground mb-6 max-w-sm">
                                Where skills meet challenges. Join the ultimate
                                platform for hackathons, team formation, and
                                competitive coding.
                            </p>
                            <div className="flex gap-3">
                                {socialLinks.map((social) => (
                                    <Button
                                        key={social.label}
                                        variant="ghost"
                                        size="icon"
                                        className="hover:text-primary hover:bg-primary/10"
                                        asChild
                                    >
                                        <a
                                            href={social.href}
                                            aria-label={social.label}
                                        >
                                            <social.icon className="h-4 w-4" />
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Footer Sections */}
                        {footerSections.map((section) => (
                            <div key={section.title}>
                                <h3 className="font-orbitron font-semibold text-foreground mb-4">
                                    {section.title}
                                </h3>
                                <ul className="space-y-2">
                                    {section.links.map((link) => (
                                        <li key={link}>
                                            <a
                                                href="#"
                                                className="text-muted-foreground hover:text-primary transition-colors duration-300"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-8 pt-8 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-muted-foreground text-sm">
                            © 2024 HackMate. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <a
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                Cookies
                            </a>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </footer>
    );
}
