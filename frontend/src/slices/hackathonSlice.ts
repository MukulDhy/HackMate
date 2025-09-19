// store/slices/hackathonSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TeamMember {
    id: string;
    name: string;
    status: 'active' | 'away' | 'offline';
}

interface Message {
    id: string;
    user: string;
    text: string;
    ts: number;
}

interface HackathonState {
    secondsLeft: number;
    micOn: boolean;
    camOn: boolean;
    messages: Message[];
    draft: string;
    submitOpen: boolean;
    submitting: boolean;
    formMembers: string;
    formGit: string;
    formZip: File | null;
    team: TeamMember[];
}

const initialState: HackathonState = {
    secondsLeft: 86400, // 24 hours in seconds
    micOn: false,
    camOn: false,
    messages: [],
    draft: '',
    submitOpen: false,
    submitting: false,
    formMembers: '',
    formGit: '',
    formZip: null,
    team: [
        {
            id: '1',
            name: 'Alex Johnson',
            status: 'active',
        },
        // Add more team members
    ],
};

const hackathonSlice = createSlice({
    name: 'hackathon',
    initialState,
    reducers: {
        tick: (state) => {
            state.secondsLeft -= 1;
        },
        toggleMic: (state) => {
            state.micOn = !state.micOn;
        },
        toggleCam: (state) => {
            state.camOn = !state.camOn;
        },
        sendMessage: (state) => {
            if (state.draft.trim()) {
                state.messages.push({
                    id: Date.now().toString(),
                    user: 'You',
                    text: state.draft,
                    ts: Date.now(),
                });
                state.draft = '';
            }
        },
        setDraft: (state, action: PayloadAction<string>) => {
            state.draft = action.payload;
        },
        openSubmit: (state) => {
            state.submitOpen = true;
        },
        closeSubmit: (state) => {
            state.submitOpen = false;
        },
        setSubmitting: (state, action: PayloadAction<boolean>) => {
            state.submitting = action.payload;
        },
        setFormMembers: (state, action: PayloadAction<string>) => {
            state.formMembers = action.payload;
        },
        setFormGit: (state, action: PayloadAction<string>) => {
            state.formGit = action.payload;
        },
        setFormZip: (state, action: PayloadAction<File | null>) => {
            state.formZip = action.payload;
        },
    },
});

export const {
    tick,
    toggleMic,
    toggleCam,
    sendMessage,
    setDraft,
    openSubmit,
    closeSubmit,
    setSubmitting,
    setFormMembers,
    setFormGit,
    setFormZip,
} = hackathonSlice.actions;

export default hackathonSlice.reducer;
