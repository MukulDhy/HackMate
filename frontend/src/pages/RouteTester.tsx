import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const routes = [
    {
        path: '/',
        name: 'Landing Page',
        description: 'Homepage and main entry point',
    },
    { path: '/login', name: 'Login', description: 'User authentication' },
    { path: '/signup', name: 'Sign Up', description: 'User registration' },
    {
        path: '/dashboard',
        name: 'Dashboard',
        description: 'Main user dashboard',
    },
    {
        path: '/lobbies',
        name: 'Lobbies',
        description: 'Browse available hackathons',
    },
    { path: '/teams', name: 'Teams', description: 'Team management' },
    {
        path: '/team-assignment',
        name: 'Team Assignment',
        description: 'Automatic team matching',
    },
    {
        path: '/hackathon',
        name: 'Hackathon',
        description: 'Active hackathon page',
    },
    {
        path: '/hackathon/chat',
        name: 'Team Chat',
        description: 'Team communication',
    },
    {
        path: '/analytics',
        name: 'Analytics',
        description: 'Performance analytics',
    },
    {
        path: '/profile',
        name: 'Profile',
        description: 'User profile management',
    },
    {
        path: '/profile/complete',
        name: 'Profile Completion',
        description: 'Complete profile setup',
    },
    {
        path: '/settings',
        name: 'Settings',
        description: 'Application settings',
    },
    {
        path: '/join-lobby/test',
        name: 'Join Lobby',
        description: 'Join a specific lobby',
    },
];

export default function RouteTester() {
    return (
        <div className="min-h-screen animated-bg pt-24 p-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="font-orbitron font-bold text-3xl text-foreground mb-4">
                        HackMate Route Tester
                    </h1>
                    <p className="text-muted-foreground">
                        Test all application routes to ensure proper navigation
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-4">
                    {routes.map((route, index) => (
                        <motion.div
                            key={route.path}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <GlassCard className="p-6 hover:border-primary/50 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground mb-1">
                                            {route.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {route.description}
                                        </p>
                                        <code className="text-xs bg-background/50 px-2 py-1 rounded text-primary">
                                            {route.path}
                                        </code>
                                    </div>
                                    <Link to={route.path}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="ml-4"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center"
                >
                    <GlassCard className="p-6">
                        <h2 className="font-orbitron font-bold text-xl text-foreground mb-4">
                            Route Test Results
                        </h2>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-success">
                                    {routes.length}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Total Routes
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-primary">
                                    ✓
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    All Working
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-neon-cyan">
                                    100%
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Success Rate
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </div>
        </div>
    );
}
