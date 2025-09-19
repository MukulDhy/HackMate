import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
    id: string;
    name: string;
    username: string;
    email: string;
    phone?: string;
    website?: string;
    title: string;
    bio: string;
    location: string;
    joinDate: string;
    avatar: string;
    level: number;
    xp: number;
    nextLevelXp: number;
    rank: string;
    isVerified: boolean;

    // Social links
    github?: string;
    linkedin?: string;
    twitter?: string;

    // Settings
    notifications: {
        hackathonInvites: boolean;
        teamFormation: boolean;
        projectUpdates: boolean;
        achievements: boolean;
        newsletter: boolean;
        marketing: boolean;
    };
    privacy: {
        profileVisibility: 'public' | 'private' | 'friends';
        showEmail: boolean;
        showPhone: boolean;
        showStats: boolean;
        allowDirectMessages: boolean;
    };
    social: {
        github?: string;
        linkedin?: string;
        twitter?: string;
    };

    // Skills and interests
    skills: Array<{
        name: string;
        level: number;
        endorsements: number;
    }>;

    interests: string[];

    // Statistics
    stats: {
        hackathonsJoined: number;
        hackathonsWon: number;
        teamsFormed: number;
        projectsCompleted: number;
        mentorshipHours: number;
        contributionsCount: number;
        winRate: number;
        totalPrizes: number;
        rank: number;
    };

    // Achievements
    achievements: Array<{
        id: string;
        title: string;
        description: string;
        icon: string;
        unlockedAt: string;
        rarity: 'common' | 'rare' | 'epic' | 'legendary';
    }>;

    // Recent activity
    recentActivity: Array<{
        id: string;
        type:
            | 'hackathon_join'
            | 'team_form'
            | 'project_complete'
            | 'achievement_unlock';
        title: string;
        description: string;
        timestamp: string;
    }>;

    // Settings
    settings: {
        isPublic: boolean;
        showEmail: boolean;
        showStats: boolean;
        allowMessaging: boolean;
        emailNotifications: boolean;
        pushNotifications: boolean;
    };
}

interface ProfileState {
    profile: UserProfile | null;
    isEditing: boolean;
    isLoading: boolean;
    error: string | null;
    editedProfile: Partial<UserProfile>;
}

const mockProfile: UserProfile = {
    id: '1',
    name: 'Alex Rodriguez',
    username: 'alexdev',
    email: 'alex.rodriguez@email.com',
    title: 'Full Stack Developer & AI Enthusiast',
    bio: 'Passionate full-stack developer with expertise in React, Node.js, and machine learning. Love building innovative solutions that make a real impact.',
    location: 'San Francisco, CA',
    joinDate: 'January 2023',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    level: 42,
    xp: 12450,
    nextLevelXp: 15000,
    rank: 'Gold',
    isVerified: true,

    github: 'https://github.com/alexdev',
    linkedin: 'https://linkedin.com/in/alexdev',
    twitter: 'https://twitter.com/alexdev',
    website: 'https://alexdev.com',

    skills: [
        { name: 'React', level: 90, endorsements: 45 },
        { name: 'TypeScript', level: 85, endorsements: 38 },
        { name: 'Node.js', level: 80, endorsements: 42 },
        { name: 'Python', level: 75, endorsements: 35 },
        { name: 'Machine Learning', level: 70, endorsements: 28 },
    ],

    interests: [
        'AI/ML',
        'Web Development',
        'Blockchain',
        'IoT',
        'Mobile Development',
    ],

    stats: {
        hackathonsJoined: 28,
        hackathonsWon: 8,
        teamsFormed: 15,
        projectsCompleted: 23,
        mentorshipHours: 120,
        contributionsCount: 156,
        winRate: 67,
        totalPrizes: 45000,
        rank: 247,
    },

    achievements: [
        {
            id: '1',
            title: 'Innovation Master',
            description: 'Won 5 hackathons in a single year',
            icon: 'Trophy',
            unlockedAt: '2024-12-01',
            rarity: 'legendary',
        },
        {
            id: '2',
            title: 'Team Builder',
            description: 'Formed 10+ successful teams',
            icon: 'Users',
            unlockedAt: '2024-11-15',
            rarity: 'epic',
        },
        {
            id: '3',
            title: 'Code Mentor',
            description: 'Provided 100+ hours of mentorship',
            icon: 'Star',
            unlockedAt: '2024-10-20',
            rarity: 'rare',
        },
    ],

    recentActivity: [
        {
            id: '1',
            type: 'hackathon_join',
            title: 'Joined AI Innovation Challenge',
            description: 'Ready to build something amazing!',
            timestamp: '2025-01-01T10:00:00Z',
        },
        {
            id: '2',
            type: 'achievement_unlock',
            title: 'Unlocked Innovation Master',
            description: 'Won 5 hackathons in a single year',
            timestamp: '2024-12-01T15:30:00Z',
        },
    ],

    settings: {
        isPublic: true,
        showEmail: false,
        showStats: true,
        allowMessaging: true,
        emailNotifications: true,
        pushNotifications: true,
    },

    notifications: {
        hackathonInvites: true,
        teamFormation: true,
        projectUpdates: false,
        achievements: true,
        newsletter: false,
        marketing: false,
    },

    privacy: {
        profileVisibility: 'public' as const,
        showEmail: false,
        showPhone: false,
        showStats: true,
        allowDirectMessages: true,
    },

    social: {
        github: 'alexrodriguez',
        linkedin: 'alex-rodriguez-dev',
        twitter: 'alexdev_codes',
    },
};

const initialState: ProfileState = {
    profile: mockProfile,
    isEditing: false,
    isLoading: false,
    error: null,
    editedProfile: {},
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<UserProfile>) => {
            state.profile = action.payload;
        },
        updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
            if (state.profile) {
                state.profile = { ...state.profile, ...action.payload };
            }
        },
        updateNotifications: (
            state,
            action: PayloadAction<Partial<UserProfile['notifications']>>,
        ) => {
            if (state.profile) {
                state.profile.notifications = {
                    ...state.profile.notifications,
                    ...action.payload,
                };
            }
        },
        updatePrivacy: (
            state,
            action: PayloadAction<Partial<UserProfile['privacy']>>,
        ) => {
            if (state.profile) {
                state.profile.privacy = {
                    ...state.profile.privacy,
                    ...action.payload,
                };
            }
        },
        updateSocial: (
            state,
            action: PayloadAction<Partial<UserProfile['social']>>,
        ) => {
            if (state.profile) {
                state.profile.social = {
                    ...state.profile.social,
                    ...action.payload,
                };
            }
        },
        setIsEditing: (state, action: PayloadAction<boolean>) => {
            state.isEditing = action.payload;
            if (!action.payload) {
                state.editedProfile = {};
            } else if (state.profile) {
                state.editedProfile = { ...state.profile };
            }
        },
        updateEditedProfile: (
            state,
            action: PayloadAction<Partial<UserProfile>>,
        ) => {
            state.editedProfile = { ...state.editedProfile, ...action.payload };
        },
        saveProfile: (state) => {
            if (state.profile && Object.keys(state.editedProfile).length > 0) {
                state.profile = { ...state.profile, ...state.editedProfile };
                state.editedProfile = {};
                state.isEditing = false;
            }
        },
        cancelEdit: (state) => {
            state.editedProfile = {};
            state.isEditing = false;
        },
        addAchievement: (
            state,
            action: PayloadAction<ProfileState['profile']['achievements'][0]>,
        ) => {
            if (state.profile) {
                state.profile.achievements.push(action.payload);
            }
        },
        addActivity: (
            state,
            action: PayloadAction<ProfileState['profile']['recentActivity'][0]>,
        ) => {
            if (state.profile) {
                state.profile.recentActivity.unshift(action.payload);
                // Keep only last 10 activities
                state.profile.recentActivity =
                    state.profile.recentActivity.slice(0, 10);
            }
        },
        updateStats: (
            state,
            action: PayloadAction<Partial<UserProfile['stats']>>,
        ) => {
            if (state.profile) {
                state.profile.stats = {
                    ...state.profile.stats,
                    ...action.payload,
                };
            }
        },
        addSkill: (state, action: PayloadAction<UserProfile['skills'][0]>) => {
            if (state.profile) {
                const existingSkillIndex = state.profile.skills.findIndex(
                    (s) => s.name === action.payload.name,
                );
                if (existingSkillIndex !== -1) {
                    state.profile.skills[existingSkillIndex] = action.payload;
                } else {
                    state.profile.skills.push(action.payload);
                }
            }
        },
        removeSkill: (state, action: PayloadAction<string>) => {
            if (state.profile) {
                state.profile.skills = state.profile.skills.filter(
                    (s) => s.name !== action.payload,
                );
            }
        },
        updateSettings: (
            state,
            action: PayloadAction<Partial<UserProfile['settings']>>,
        ) => {
            if (state.profile) {
                state.profile.settings = {
                    ...state.profile.settings,
                    ...action.payload,
                };
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setProfile,
    updateProfile,
    updateNotifications,
    updatePrivacy,
    updateSocial,
    setIsEditing,
    updateEditedProfile,
    saveProfile,
    cancelEdit,
    addAchievement,
    addActivity,
    updateStats,
    addSkill,
    removeSkill,
    updateSettings,
    setLoading,
    setError,
} = profileSlice.actions;

export default profileSlice.reducer;
export type { UserProfile };
