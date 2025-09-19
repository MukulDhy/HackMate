// store/slices/analyticsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SkillProgress {
    skill: string;
    progress: number;
}

interface TeamPerformance {
    teamName: string;
    averageTeamSize: number;
    leadershipRate: number;
    mentorshipHours: number;
    projectsCompleted: number;
}

interface AnalyticsState {
    skillProgress: SkillProgress[];
    teamPerformance: TeamPerformance[];
}

const initialState: AnalyticsState = {
    skillProgress: [
        { skill: 'React', progress: 85 },
        { skill: 'TypeScript', progress: 90 },
        { skill: 'Node.js', progress: 75 },
        { skill: 'Python', progress: 80 },
        { skill: 'UI/UX', progress: 65 },
    ],
    teamPerformance: [
        {
            teamName: 'AI Innovators',
            averageTeamSize: 3.5,
            leadershipRate: 85,
            mentorshipHours: 12,
            projectsCompleted: 8,
        },
        {
            teamName: 'Web3 Warriors',
            averageTeamSize: 4,
            leadershipRate: 90,
            mentorshipHours: 15,
            projectsCompleted: 10,
        },
    ],
};

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        updateSkillProgress: (
            state,
            action: PayloadAction<{ skill: string; progress: number }>,
        ) => {
            const index = state.skillProgress.findIndex(
                (s) => s.skill === action.payload.skill,
            );
            if (index !== -1) {
                state.skillProgress[index].progress = action.payload.progress;
            }
        },
        // Add more reducers as needed
    },
});

export const { updateSkillProgress } = analyticsSlice.actions;
export default analyticsSlice.reducer;
