import { getAllAvatars } from '@/utils/avatarUtils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LobbyProps {
    lobbyName?: string;
    members?: number;
    capacity?: number;
    countdown?: number;
    theme?: string;
}

export default function JoinLobbyPage({
    lobbyName = 'AI Innovation Challenge',
    members: initialMembers = 2,
    capacity = 4,
    countdown = 60,
    theme = 'AI for Social Good',
}: LobbyProps) {
    const [joined, setJoined] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [members, setMembers] = useState(initialMembers);
    const avatars = getAllAvatars();
    const navigate = useNavigate();

    // ✅ On join, immediately complete lobby and trigger redirect
    const handleJoin = () => {
        if (!joined && selectedAvatar) {
            setJoined(true);
            setMembers(capacity); // 🚀 instantly fill the lobby for testing
        }
    };

    const hackathonStarted = members >= capacity;

    // 🔥 Auto-redirect to hackathon chat page when full
    useEffect(() => {
        if (hackathonStarted && selectedAvatar) {
            const timer = setTimeout(() => {
                navigate('/hackathon/chat', {
                    state: {
                        lobbyName,
                        avatar: avatars.find((a) => a.id === selectedAvatar),
                    },
                });
            }, 2000); // 2s delay so user sees "Hackathon Started!" message
            return () => clearTimeout(timer);
        }
    }, [hackathonStarted, navigate, lobbyName, selectedAvatar, avatars]);

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-6 
                    bg-gradient-to-b from-gray-50 to-gray-200 text-gray-900 
                    dark:from-black dark:via-gray-900 dark:to-black dark:text-white"
        >
            <motion.div
                className="p-8 rounded-2xl shadow-2xl border max-w-md w-full 
                   bg-white/80 border-gray-300 
                   dark:bg-gray-900/70 dark:border-cyan-500/30"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {!hackathonStarted ? (
                    <>
                        {/* Lobby Title */}
                        <h1 className="text-3xl font-bold text-cyan-600 dark:text-neon-cyan neon-glow mb-4">
                            {lobbyName}
                        </h1>

                        {/* Stats */}
                        <p className="mb-2">
                            <span className="font-semibold">Members:</span>{' '}
                            {members}/{capacity}
                        </p>
                        <p className="mb-2">
                            <span className="font-semibold">Countdown:</span>{' '}
                            {countdown}s
                        </p>
                        <p className="mb-6">
                            <span className="font-semibold">Theme:</span>{' '}
                            <span className="text-green-600 dark:text-neon-green">
                                {theme}
                            </span>
                        </p>

                        {/* Avatar Selection */}
                        <h2 className="font-semibold mb-3">
                            Choose your avatar:
                        </h2>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {avatars.map((avatar) => (
                                <motion.div
                                    key={avatar.id}
                                    whileHover={{ scale: 1.05 }}
                                    className={`cursor-pointer rounded-xl border p-3 flex flex-col items-center 
                              transition ${
                                  selectedAvatar === avatar.id
                                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/40'
                                      : 'border-gray-300 dark:border-gray-700'
                              }`}
                                    onClick={() => setSelectedAvatar(avatar.id)}
                                >
                                    <img
                                        src={avatar.url}
                                        alt={avatar.name}
                                        className="w-16 h-16 mb-2 rounded-full border"
                                    />
                                    <span className="text-sm text-center">
                                        {avatar.name}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Join Button */}
                        <motion.button
                            onClick={handleJoin}
                            disabled={!selectedAvatar || joined}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 w-full rounded-xl font-bold text-lg shadow-lg 
                         bg-gradient-to-r from-cyan-500 to-purple-500 text-white
                         disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {joined
                                ? `Joined as ${
                                      avatars.find(
                                          (a) => a.id === selectedAvatar,
                                      )?.name
                                  }!`
                                : 'Join Lobby'}
                        </motion.button>
                    </>
                ) : (
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                            🚀 Hackathon Started!
                        </h1>
                        <p className="mb-2">
                            Redirecting you to {lobbyName}...
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
