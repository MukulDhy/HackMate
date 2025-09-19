// utils/avatarUtils.ts

export interface Avatar {
    id: string;
    name: string;
    url: string;
}

export function getAllAvatars(): Avatar[] {
    return [
        {
            id: 'cyber-ninja',
            name: 'Cyber Ninja',
            url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberNinja',
        },
        {
            id: 'neon-samurai',
            name: 'Neon Samurai',
            url: 'https://api.dicebear.com/7.x/bottts/svg?seed=NeonSamurai',
        },
        {
            id: 'glitch-hacker',
            name: 'Glitch Hacker',
            url: 'https://api.dicebear.com/7.x/bottts/svg?seed=GlitchHacker',
        },
        {
            id: 'ai-overlord',
            name: 'AI Overlord',
            url: 'https://api.dicebear.com/7.x/bottts/svg?seed=AIOverlord',
        },
    ];
}
