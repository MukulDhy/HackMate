// store/slices/hackathonSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Hackathon, HackathonFilters } from '@/types/hackathon';
import { hackathonService } from '@/service/hackathonService';

interface HackathonState {
  hackathons: Hackathon[];
  loading: boolean;
  error: string | null;
  filters: HackathonFilters;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

const initialState: HackathonState = {
  hackathons: [],
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    sortBy: 'startDate',
    sortOrder: 'desc'
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  }
};

export const fetchHackathons = createAsyncThunk(
  'hackathons/fetchHackathons',
  async (filters: HackathonFilters, { rejectWithValue }) => {
    try {
      return await hackathonService.getHackathons(filters);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const hackathonSlice = createSlice({
  name: 'hackathons',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<HackathonFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
        sortBy: 'startDate',
        sortOrder: 'desc'
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHackathons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHackathons.fulfilled, (state, action) => {
        state.loading = false;
        
        // Ensure ended hackathons are marked as completed
        const now = new Date();
        state.hackathons = action.payload.data.map((hackathon: Hackathon) => {
          const endDate = new Date(hackathon.endDate);
          const isEnded = endDate < now;

          if (isEnded && hackathon.status !== 'completed' && hackathon.status !== 'cancelled') {
            return { ...hackathon, status: 'completed' };
          }
          return hackathon;
        });

        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.total,
          limit: state.filters.limit || 10
        };
      })
      .addCase(fetchHackathons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setFilters, setPage, clearFilters } = hackathonSlice.actions;
export default hackathonSlice.reducer;