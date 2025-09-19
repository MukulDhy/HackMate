import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    avatar: string;
    role: string;
    isVerified: boolean;
    joinedAt: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Form states for login/signup
    loginForm: {
        email: string;
        password: string;
        showPassword: boolean;
        rememberMe: boolean;
    };

    signupForm: {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        showPassword: boolean;
        showConfirmPassword: boolean;
        agreeToTerms: boolean;
    };
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    loginForm: {
        email: '',
        password: '',
        showPassword: false,
        rememberMe: false,
    },

    signupForm: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
        agreeToTerms: false,
    },
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (
            state,
            action: PayloadAction<{ user: User; token: string }>,
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;

            // Clear form
            state.loginForm = {
                email: '',
                password: '',
                showPassword: false,
                rememberMe: false,
            };
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        signupStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        signupSuccess: (
            state,
            action: PayloadAction<{ user: User; token: string }>,
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;

            // Clear form
            state.signupForm = {
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                showPassword: false,
                showConfirmPassword: false,
                agreeToTerms: false,
            };
        },
        signupFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },

        // Login form actions
        updateLoginForm: (
            state,
            action: PayloadAction<Partial<AuthState['loginForm']>>,
        ) => {
            state.loginForm = { ...state.loginForm, ...action.payload };
        },
        toggleLoginPasswordVisibility: (state) => {
            state.loginForm.showPassword = !state.loginForm.showPassword;
        },
        clearLoginForm: (state) => {
            state.loginForm = {
                email: '',
                password: '',
                showPassword: false,
                rememberMe: false,
            };
        },

        // Signup form actions
        updateSignupForm: (
            state,
            action: PayloadAction<Partial<AuthState['signupForm']>>,
        ) => {
            state.signupForm = { ...state.signupForm, ...action.payload };
        },
        toggleSignupPasswordVisibility: (state) => {
            state.signupForm.showPassword = !state.signupForm.showPassword;
        },
        toggleSignupConfirmPasswordVisibility: (state) => {
            state.signupForm.showConfirmPassword =
                !state.signupForm.showConfirmPassword;
        },
        clearSignupForm: (state) => {
            state.signupForm = {
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                showPassword: false,
                showConfirmPassword: false,
                agreeToTerms: false,
            };
        },

        // User update
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    signupStart,
    signupSuccess,
    signupFailure,
    logout,
    clearError,
    updateLoginForm,
    toggleLoginPasswordVisibility,
    clearLoginForm,
    updateSignupForm,
    toggleSignupPasswordVisibility,
    toggleSignupConfirmPasswordVisibility,
    clearSignupForm,
    updateUser,
} = authSlice.actions;

export default authSlice.reducer;
export type { User };
