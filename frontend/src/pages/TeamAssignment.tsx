import { BackgroundScene } from '@/components/3d/background-scene';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { motion } from 'framer-motion';
import {
    Brain,
    Code,
    Database,
    Palette,
    Shuffle,
    Users,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Participant {
    id: number;
    name: string;
    skills: string[];
    experience: string;
    avatar: string;
    isCurrentUser?: boolean;
}

interface Team {
    id: number;
    name: string;
    members: Participant[];
}

const skills = [
    { id: 'frontend', name: 'Frontend', icon: Palette, color: 'text-cyan-400' },
    { id: 'backend', name: 'Backend', icon: Database, color: 'text-green-400' },
    {
        id: 'fullstack',
        name: 'Full Stack',
        icon: Code,
        color: 'text-purple-400',
    },
    { id: 'ai', name: 'AI/ML', icon: Brain, color: 'text-pink-400' },
];

const participants = [
    {
        id: 1,
        name: 'Alex Rodriguez',
        skills: ['frontend', 'fullstack'],
        experience: 'Senior',
        avatar: '👨‍💻',
        isCurrentUser: true,
    },
    {
        id: 2,
        name: 'Sarah Chen',
        skills: ['ai', 'backend'],
        experience: 'Mid-level',
        avatar: '👩‍💻',
    },
    {
        id: 3,
        name: 'Marcus Johnson',
        skills: ['backend', 'fullstack'],
        experience: 'Junior',
        avatar: '👨‍💼',
    },
    {
        id: 4,
        name: 'Emily Davis',
        skills: ['frontend', 'ai'],
        experience: 'Senior',
        avatar: '👩‍🔬',
    },
    {
        id: 5,
        name: 'David Kim',
        skills: ['backend', 'ai'],
        experience: 'Mid-level',
        avatar: '👨‍🎓',
    },
    {
        id: 6,
        name: 'Lisa Wang',
        skills: ['frontend', 'fullstack'],
        experience: 'Junior',
        avatar: '👩‍💼',
    },
];

export default function TeamAssignment() {
    const navigate = useNavigate();
    const [isAssigning, setIsAssigning] = useState(false);
    const [teams, setTeams] = useState<Team[]>([]);

    const assignTeams = () => {
        setIsAssigning(true);

        // Simulate team assignment algorithm
        setTimeout(() => {
            const shuffled = [...participants].sort(() => Math.random() - 0.5);
            const newTeams = [];

            for (let i = 0; i < shuffled.length; i += 3) {
                newTeams.push({
                    id: Math.floor(i / 3) + 1,
                    name: `Team ${Math.floor(i / 3) + 1}`,
                    members: shuffled.slice(i, i + 3),
                });
            }

            setTeams(newTeams);
            setIsAssigning(false);
        }, 2000);
    };

    const proceedToHackathon = () => {
        navigate('/hackathon');
    };

    return (
        <div className="min-h-screen animated-bg relative overflow-hidden pt-24">
            <BackgroundScene className="absolute inset-0 w-full h-full" />

            <div className="relative max-w-7xl mx-auto p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-orbitron font-bold text-foreground mb-4">
                        Team Assignment
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        AI-powered team formation for optimal collaboration
                    </p>
                </motion.div>

                {teams.length === 0 ? (
                    <>
                        {/* Participants Pool */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8"
                        >
                            <GlassCard variant="glow" className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <Users className="w-6 h-6 text-primary" />
                                    <h2 className="text-2xl font-semibold">
                                        Participants ({participants.length})
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {participants.map((participant) => (
                                        <motion.div
                                            key={participant.id}
                                            whileHover={{ scale: 1.02 }}
                                            className={`p-4 rounded-xl border ${
                                                participant.isCurrentUser
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-glass-border bg-background/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="text-2xl">
                                                    {participant.avatar}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground">
                                                        {participant.name}
                                                        {participant.isCurrentUser && (
                                                            <span className="text-primary ml-2">
                                                                (You)
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {participant.experience}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {participant.skills.map(
                                                    (skillId) => {
                                                        const skill =
                                                            skills.find(
                                                                (s) =>
                                                                    s.id ===
                                                                    skillId,
                                                            );
                                                        return skill ? (
                                                            <Badge
                                                                key={skillId}
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                {skill.name}
                                                            </Badge>
                                                        ) : null;
                                                    },
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>

                        {/* Assignment Button */}
                        <div className="text-center">
                            <Button
                                onClick={assignTeams}
                                disabled={isAssigning}
                                variant="hero"
                                size="lg"
                                className="px-8 py-4 text-lg"
                            >
                                {isAssigning ? (
                                    <>
                                        <Zap className="w-5 h-5 mr-2 animate-spin" />
                                        Analyzing Skills & Assigning Teams...
                                    </>
                                ) : (
                                    <>
                                        <Shuffle className="w-5 h-5 mr-2" />
                                        Generate Optimal Teams
                                    </>
                                )}
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Assigned Teams */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8"
                        >
                            <div className="text-center mb-6">
                                <h2 className="text-3xl font-semibold text-foreground mb-2">
                                    Teams Assigned!
                                </h2>
                                <p className="text-muted-foreground">
                                    Balanced teams created based on skills and
                                    experience
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {teams.map((team, index) => (
                                    <motion.div
                                        key={team.id}
                                        initial={{
                                            opacity: 0,
                                            x: index % 2 === 0 ? -50 : 50,
                                        }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                    >
                                        <GlassCard
                                            variant="glow"
                                            className="p-6"
                                        >
                                            <h3 className="text-xl font-semibold text-primary mb-4">
                                                {team.name}
                                            </h3>
                                            <div className="space-y-3">
                                                {team.members.map(
                                                    (member: Participant) => (
                                                        <div
                                                            key={member.id}
                                                            className={`flex items-center gap-3 p-3 rounded-lg ${
                                                                member.isCurrentUser
                                                                    ? 'bg-primary/20 border border-primary/30'
                                                                    : 'bg-background/30'
                                                            }`}
                                                        >
                                                            <div className="text-xl">
                                                                {member.avatar}
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-medium text-foreground">
                                                                    {
                                                                        member.name
                                                                    }
                                                                    {member.isCurrentUser && (
                                                                        <span className="text-primary ml-1">
                                                                            (You)
                                                                        </span>
                                                                    )}
                                                                </p>
                                                                <div className="flex gap-1 mt-1">
                                                                    {member.skills.map(
                                                                        (
                                                                            skillId: string,
                                                                        ) => {
                                                                            const skill =
                                                                                skills.find(
                                                                                    (
                                                                                        s,
                                                                                    ) =>
                                                                                        s.id ===
                                                                                        skillId,
                                                                                );
                                                                            return skill ? (
                                                                                <Badge
                                                                                    key={
                                                                                        skillId
                                                                                    }
                                                                                    variant="outline"
                                                                                    className="text-xs"
                                                                                >
                                                                                    {
                                                                                        skill.name
                                                                                    }
                                                                                </Badge>
                                                                            ) : null;
                                                                        },
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </GlassCard>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="text-center">
                                <Button
                                    onClick={proceedToHackathon}
                                    variant="hero"
                                    size="lg"
                                    className="px-8 py-4 text-lg"
                                >
                                    <Zap className="w-5 h-5 mr-2" />
                                    Start Hackathon!
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}
