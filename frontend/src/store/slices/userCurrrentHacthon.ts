import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Hackathon } from '@/types/hackathon';
import { hackathonService } from '@/service/hackathonService';
import { updateUser } from '@/slices/authSlice';
import { AppDispatch } from '@/store'; // Import AppDispatch type from your store

interface HackathonState {
  hackathon: Hackathon | null;
  joined: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: HackathonState = {
  hackathon: null,
  joined: false,
  loading: false,
  error: null,
};

// Fixed: Added proper typing for thunkAPI
export const userFetchHackathon = createAsyncThunk(
  'hackathon/userFetchHackathon',
  async (id: string, { rejectWithValue }) => {
    try {
      return await hackathonService.getById(id);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fixed: Added proper return type
export const userDefetchHackathon = createAsyncThunk(
  'hackathon/userDefetchHackathon',
  async (id: string, { rejectWithValue }) => {
    try {
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fixed: Properly handle dispatch with thunkAPI
export const joinHackathon = createAsyncThunk(
  'hackathon/userJoinHackathon',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await hackathonService.joinHackathon(id);
      dispatch(updateUser({ currentHackathonId: response._id }));
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Fixed: Added missing return and proper dispatch handling
export const leaveHackathon = createAsyncThunk(
  'hackathon/userLeaveHackathon',
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await hackathonService.leaveHackathon(id); // Fixed: Should be leaveHackathon, not joinHackathon
      dispatch(updateUser({ currentHackathonId: null })); // Fixed: Set to null when leaving
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userHackathonSlice = createSlice({
  name: 'userHackathons',
  initialState,
  reducers: {
    // Removed unused reducers since they reference non-existent filters property
    clearHackathon: (state) => {
      state.hackathon = null;
      state.joined = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userFetchHackathon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userFetchHackathon.fulfilled, (state, action) => {
        state.loading = false;
        state.hackathon = action.payload;
        state.joined = true; // Assuming if we fetch it, user is joined
      })
      .addCase(userFetchHackathon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(userDefetchHackathon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userDefetchHackathon.fulfilled, (state) => {
        state.loading = false;
        state.hackathon = null;
        state.joined = false;
      })
      .addCase(userDefetchHackathon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(joinHackathon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinHackathon.fulfilled, (state, action) => {
        state.loading = false;
        state.joined = true;
        state.hackathon = action.payload;
      })
      .addCase(joinHackathon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(leaveHackathon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveHackathon.fulfilled, (state) => {
        state.loading = false;
        state.joined = false;
        state.hackathon = null;
      })
      .addCase(leaveHackathon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearHackathon } = userHackathonSlice.actions;
export default userHackathonSlice.reducer;