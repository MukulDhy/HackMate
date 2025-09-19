import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Lobby {
    id: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    type: 'Virtual' | 'In-Person' | 'Hybrid';
    skills: string[];
    participants: number;
    maxParticipants: number;
    prize: string;
    duration: string;
    startDate: string;
    endDate: string;
    status: 'upcoming' | 'active' | 'completed';
    tags: string[];
    organizer: string;
    host: string;
    location?: string;
    requirements: string[];
    timeline: string;
    timeLeft: string;
    featured: boolean;
}

interface LobbyFilters {
    searchTerm: string;
    selectedCategory: string;
    selectedDifficulties: string[];
    selectedTypes: string[];
    selectedSkills: string[];
}

interface LobbiesState {
    lobbies: Lobby[];
    filters: LobbyFilters;
    isLoading: boolean;
    error: string | null;
    userLobbies: Lobby[];
}

const mockLobbies: Lobby[] = [
    {
        id: '1',
        title: 'AI Innovation Challenge',
        description:
            'Build an AI solution that addresses real-world problems in healthcare, education, or climate change.',
        category: 'AI/ML',
        difficulty: 'Advanced',
        type: 'Virtual',
        skills: ['Python', 'TensorFlow', 'Machine Learning'],
        participants: 45,
        maxParticipants: 60,
        prize: '$50,000',
        duration: '48 hours',
        startDate: '2025-01-15',
        endDate: '2025-01-17',
        status: 'upcoming',
        tags: ['AI', 'Healthcare', 'Climate'],
        organizer: 'TechCorp',
        host: 'Dr. Sarah Chen',
        requirements: ['Experience with ML frameworks', 'Team of 2-4 members'],
        timeline: 'Jan 15-17, 2025',
        timeLeft: '2h 30m',
        featured: true,
    },
    {
        id: '2',
        title: 'Web3 DeFi Protocol',
        description:
            'Create innovative DeFi protocols using blockchain technology.',
        category: 'Web3',
        difficulty: 'Expert',
        type: 'Hybrid',
        skills: ['Solidity', 'React', 'Web3.js'],
        participants: 28,
        maxParticipants: 40,
        prize: '$75,000',
        duration: '72 hours',
        startDate: '2025-01-20',
        endDate: '2025-01-23',
        status: 'upcoming',
        tags: ['DeFi', 'Blockchain', 'Smart Contracts'],
        organizer: 'CryptoVentures',
        host: 'Alex Rivera',
        location: 'San Francisco, CA',
        requirements: ['Blockchain experience', 'Solidity knowledge'],
        timeline: 'Jan 20-23, 2025',
        timeLeft: '5 days',
        featured: false,
    },
];

const initialState: LobbiesState = {
    lobbies: mockLobbies,
    filters: {
        searchTerm: '',
        selectedCategory: 'All',
        selectedDifficulties: [],
        selectedTypes: [],
        selectedSkills: [],
    },
    isLoading: false,
    error: null,
    userLobbies: [],
};

const lobbiesSlice = createSlice({
    name: 'lobbies',
    initialState,
    reducers: {
        setLobbies: (state, action: PayloadAction<Lobby[]>) => {
            state.lobbies = action.payload;
        },
        addLobby: (state, action: PayloadAction<Lobby>) => {
            state.lobbies.push(action.payload);
        },
        updateLobby: (state, action: PayloadAction<Lobby>) => {
            const index = state.lobbies.findIndex(
                (l) => l.id === action.payload.id,
            );
            if (index !== -1) {
                state.lobbies[index] = action.payload;
            }
        },
        removeLobby: (state, action: PayloadAction<string>) => {
            state.lobbies = state.lobbies.filter(
                (l) => l.id !== action.payload,
            );
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.filters.searchTerm = action.payload;
        },
        setSelectedCategory: (state, action: PayloadAction<string>) => {
            state.filters.selectedCategory = action.payload;
        },
        setSelectedDifficulties: (state, action: PayloadAction<string[]>) => {
            state.filters.selectedDifficulties = action.payload;
        },
        setSelectedTypes: (state, action: PayloadAction<string[]>) => {
            state.filters.selectedTypes = action.payload;
        },
        setSelectedSkills: (state, action: PayloadAction<string[]>) => {
            state.filters.selectedSkills = action.payload;
        },
        clearFilters: (state) => {
            state.filters = {
                searchTerm: '',
                selectedCategory: 'All',
                selectedDifficulties: [],
                selectedTypes: [],
                selectedSkills: [],
            };
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        joinLobby: (state, action: PayloadAction<string>) => {
            const lobby = state.lobbies.find((l) => l.id === action.payload);
            if (lobby && lobby.participants < lobby.maxParticipants) {
                lobby.participants += 1;
                if (!state.userLobbies.find((l) => l.id === action.payload)) {
                    state.userLobbies.push(lobby);
                }
            }
        },
        leaveLobby: (state, action: PayloadAction<string>) => {
            const lobby = state.lobbies.find((l) => l.id === action.payload);
            if (lobby && lobby.participants > 0) {
                lobby.participants -= 1;
                state.userLobbies = state.userLobbies.filter(
                    (l) => l.id !== action.payload,
                );
            }
        },
    },
});

export const {
    setLobbies,
    addLobby,
    updateLobby,
    removeLobby,
    setSearchTerm,
    setSelectedCategory,
    setSelectedDifficulties,
    setSelectedTypes,
    setSelectedSkills,
    clearFilters,
    setLoading,
    setError,
    joinLobby,
    leaveLobby,
} = lobbiesSlice.actions;

export default lobbiesSlice.reducer;
export type { Lobby, LobbyFilters };
