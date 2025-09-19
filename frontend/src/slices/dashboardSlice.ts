// store/slices/dashboardSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserStats {
    name: string;
    rank: string;
    level: number;
    xp: number;
    hackathonsJoined: number;
    teamsFormed: number;
    projectsCompleted: number;
}

interface Lobby {
    id: number;
    title: string;
    participants: number;
    maxParticipants: number;
    timeLeft: string;
    difficulty: string;
    prize: string;
    tags: string[];
}

interface Achievement {
    title: string;
    description: string;
    icon: string;
}

interface Event {
    title: string;
    date: string;
    participants: number;
}

interface DashboardState {
    userStats: UserStats;
    activeLobbies: Lobby[];
    achievements: Achievement[];
    events: Event[];
}

const initialState: DashboardState = {
    userStats: {
        name: 'Alex Rodriguez',
        rank: 'Gold',
        level: 42,
        xp: 12450,
        hackathonsJoined: 28,
        teamsFormed: 15,
        projectsCompleted: 23,
    },
    activeLobbies: [
        {
            id: 1,
            title: 'AI Innovation Challenge',
            participants: 45,
            maxParticipants: 60,
            timeLeft: '2h 30m',
            difficulty: 'Advanced',
            prize: '$50,000',
            tags: ['AI', 'Healthcare', 'Python', 'Machine Learning'],
        },
        {
            id: 2,
            title: 'Web3 DeFi Revolution',
            participants: 32,
            maxParticipants: 50,
            timeLeft: '1d 4h',
            difficulty: 'Expert',
            prize: '$75,000',
            tags: ['Blockchain', 'DeFi', 'Solidity', 'React'],
        },
        {
            id: 3,
            title: 'Climate Tech Solutions',
            participants: 28,
            maxParticipants: 40,
            timeLeft: '6h 15m',
            difficulty: 'Intermediate',
            prize: '$30,000',
            tags: ['Climate', 'IoT', 'Data Science', 'Sustainability'],
        },
        {
            id: 4,
            title: 'Mobile App Innovation',
            participants: 38,
            maxParticipants: 60,
            timeLeft: '3d 2h',
            difficulty: 'Beginner',
            prize: '$25,000',
            tags: ['Mobile', 'React Native', 'Flutter', 'UX/UI'],
        },
        {
            id: 5,
            title: 'Cybersecurity Challenge',
            participants: 22,
            maxParticipants: 35,
            timeLeft: '12h 45m',
            difficulty: 'Advanced',
            prize: '$60,000',
            tags: ['Security', 'Penetration Testing', 'Cryptography'],
        },
        {
            id: 6,
            title: 'FinTech Disruption',
            participants: 41,
            maxParticipants: 55,
            timeLeft: '2d 8h',
            difficulty: 'Intermediate',
            prize: '$40,000',
            tags: ['FinTech', 'API', 'Banking', 'Payment Systems'],
        },
    ],
    achievements: [
        {
            title: 'Innovation Master',
            description: 'Won 5 hackathons in a single year',
            icon: 'Trophy',
        },
        {
            title: 'Team Builder',
            description: 'Successfully formed 10+ diverse teams',
            icon: 'Users',
        },
        {
            title: 'Code Ninja',
            description: 'Submitted 50+ high-quality projects',
            icon: 'Zap',
        },
    ],
    events: [
        {
            title: 'Global AI Summit 2025',
            date: '2025-09-15',
            participants: 1250,
        },
        {
            title: 'Web3 Developer Conference',
            date: '2025-09-22',
            participants: 890,
        },
        {
            title: 'Climate Tech Expo',
            date: '2025-10-05',
            participants: 750,
        },
        {
            title: 'Mobile Innovation Workshop',
            date: '2025-10-12',
            participants: 450,
        },
        {
            title: 'Cybersecurity Bootcamp',
            date: '2025-10-18',
            participants: 320,
        },
        {
            title: 'FinTech Meetup',
            date: '2025-10-25',
            participants: 280,
        },
    ],
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        updateUserStats: (state, action: PayloadAction<Partial<UserStats>>) => {
            state.userStats = { ...state.userStats, ...action.payload };
        },
        addActiveLobby: (state, action: PayloadAction<Lobby>) => {
            state.activeLobbies.push(action.payload);
        },
        // Add more reducers as needed
    },
});

export const { updateUserStats, addActiveLobby } = dashboardSlice.actions;
export default dashboardSlice.reducer;
