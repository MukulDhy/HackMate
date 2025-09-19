import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    // Navbar state
    isNavbarOpen: boolean;

    // Profile dropdown state
    isProfileDropdownOpen: boolean;

    // Theme state
    theme: 'light' | 'dark' | 'system';

    // Loading states
    isLoading: boolean;
    loadingMessage: string;

    // Modals and dialogs
    activeModal: string | null;

    // Sidebar state
    isSidebarOpen: boolean;

    // Search states
    searchTerm: string;
    searchResults: unknown[];

    // Notifications
    notifications: Array<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        title: string;
        message: string;
        timestamp: number;
    }>;
}

const initialState: UIState = {
    isNavbarOpen: false,
    isProfileDropdownOpen: false,
    theme: 'dark',
    isLoading: false,
    loadingMessage: '',
    activeModal: null,
    isSidebarOpen: true,
    searchTerm: '',
    searchResults: [],
    notifications: [],
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleNavbar: (state) => {
            state.isNavbarOpen = !state.isNavbarOpen;
        },
        setNavbarOpen: (state, action: PayloadAction<boolean>) => {
            state.isNavbarOpen = action.payload;
        },
        toggleProfileDropdown: (state) => {
            state.isProfileDropdownOpen = !state.isProfileDropdownOpen;
        },
        setProfileDropdownOpen: (state, action: PayloadAction<boolean>) => {
            state.isProfileDropdownOpen = action.payload;
        },
        setTheme: (
            state,
            action: PayloadAction<'light' | 'dark' | 'system'>,
        ) => {
            state.theme = action.payload;
        },
        setLoading: (
            state,
            action: PayloadAction<{ isLoading: boolean; message?: string }>,
        ) => {
            state.isLoading = action.payload.isLoading;
            state.loadingMessage = action.payload.message || '';
        },
        openModal: (state, action: PayloadAction<string>) => {
            state.activeModal = action.payload;
        },
        closeModal: (state) => {
            state.activeModal = null;
        },
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.isSidebarOpen = action.payload;
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
        setSearchResults: (state, action: PayloadAction<unknown[]>) => {
            state.searchResults = action.payload;
        },
        addNotification: (
            state,
            action: PayloadAction<
                Omit<UIState['notifications'][0], 'id' | 'timestamp'>
            >,
        ) => {
            const notification = {
                ...action.payload,
                id: Date.now().toString(),
                timestamp: Date.now(),
            };
            state.notifications.push(notification);
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(
                (n) => n.id !== action.payload,
            );
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const {
    toggleNavbar,
    setNavbarOpen,
    toggleProfileDropdown,
    setProfileDropdownOpen,
    setTheme,
    setLoading,
    openModal,
    closeModal,
    toggleSidebar,
    setSidebarOpen,
    setSearchTerm,
    setSearchResults,
    addNotification,
    removeNotification,
    clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
