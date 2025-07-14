import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
export interface MatchmakingRootState {
  matchmaking: typeof initialState;
}
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';

// Define the IMatchmaking type
export type IMatchmaking = BaseModel & {
  boy_dob?: string;
  boy_tob?: string;
  boy_tz?: string;
  boy_lat?: string;
  boy_lon?: string;
  girl_dob?: string;
  girl_tob?: string;
  girl_tz?: string;
  girl_lat?: string;
  girl_lon?: string;
  lang?: string;
  boyName?: string;
  girlName?: string;
};

// Define the matchmaking request type
export type IMatchmakingRequest = {
  boy_dob: string;
  boy_tob: string;
  boy_tz: string;
  boy_lat: string;
  boy_lon: string;
  girl_dob: string;
  girl_tob: string;
  girl_tz: string;
  girl_lat: string;
  girl_lon: string;
  lang?: string;
  boyName: string;
  girlName: string;
};

// Define the API response type to match the backend
export type IMatchmakingApiResponse = {
  success: boolean;
  message: string;
  matchMakingRecords: IMatchmaking[];
  currentPage: number;
  limit: number;
  skip: number;
  totalPage: number;
  totalMatchMakingCount: number;
};

// Initial state
const initialState = {
  MatchmakingState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      skip: 0
    }
  } as PaginationState<IMatchmaking[]> & {
    pagination: {
      page: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
      skip: number;
    };
  },
  CreateMatchmakingState: {
    data: null,
    loading: false,
    error: null
  } as BaseState<any>
};

// Thunk for fetching all matchmaking records
export const fetchAllMatchmaking = createAsyncThunk<
  IMatchmakingApiResponse,
  {
    page?: number;
    limit?: number;
    field?: string;
    text?: string;
    lang?: string;
    exportData?: boolean;
  },
  { state: RootState }
>(
  'matchmaking/fetchAllMatchmaking',
  async (input, { dispatch, rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 10,
        field = '',
        text = '',
        lang = '',
        exportData = false
      } = input || {};

      dispatch(fetchMatchmakingStart());

      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      if (field && text) {
        params.append('field', field);
        params.append('text', text);
      }

      if (lang) {
        params.append('lang', lang);
      }

      if (exportData) {
        params.append('exportData', 'true');
      }

      const response = await fetchApi(
        `/match-making/get?${params.toString()}`,
        { method: 'GET' }
      );

      if (response?.success) {
        dispatch(
          fetchMatchmakingSuccess({
            data: response.matchMakingRecords,
            currentPage: response.currentPage,
            limit: response.limit,
            skip: response.skip,
            totalPages: response.totalPage,
            totalCount: response.totalMatchMakingCount
          })
        );
        return response;
      } else {
        throw new Error(response?.message || 'Invalid API response');
      }
    } catch (error: any) {
      dispatch(
        fetchMatchmakingFailure(error?.message || 'Something went wrong')
      );
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

// Slice
const matchmakingSlice = createSlice({
  name: 'matchmaking',
  initialState,
  reducers: {
    // Create matchmaking reducers
    createMatchmakingStart(state) {
      state.CreateMatchmakingState.loading = true;
      state.CreateMatchmakingState.error = null;
    },
    createMatchmakingSuccess(state, action) {
      state.CreateMatchmakingState.data = action.payload;
      state.CreateMatchmakingState.loading = false;
    },
    createMatchmakingFailure(state, action) {
      state.CreateMatchmakingState.loading = false;
      state.CreateMatchmakingState.error = action.payload;
    },
    // Fetch matchmaking reducers
    fetchMatchmakingStart(state) {
      state.MatchmakingState.loading = true;
      state.MatchmakingState.error = null;
    },
    fetchMatchmakingSuccess(state, action) {
      const { data, currentPage, limit, skip, totalPages, totalCount } =
        action.payload;
      state.MatchmakingState.data = data;
      state.MatchmakingState.pagination.page = currentPage;
      state.MatchmakingState.pagination.pageSize = limit;
      state.MatchmakingState.pagination.skip = skip;
      state.MatchmakingState.pagination.totalPages = totalPages;
      state.MatchmakingState.pagination.totalCount = totalCount;
      state.MatchmakingState.loading = false;
    },
    fetchMatchmakingFailure(state, action) {
      state.MatchmakingState.loading = false;
      state.MatchmakingState.error = action.payload;
    },
    // Update pagination
    updateMatchmakingPagination(state, action) {
      const { page, pageSize } = action.payload;
      state.MatchmakingState.pagination.page = page;
      state.MatchmakingState.pagination.pageSize = pageSize;
    },
    // Reset states
    resetCreateMatchmakingState(state) {
      state.CreateMatchmakingState = {
        data: null,
        loading: false,
        error: null
      };
    },
    resetMatchmakingState(state) {
      state.MatchmakingState = {
        data: [],
        loading: false,
        error: null,
        pagination: {
          page: 1,
          pageSize: 10,
          totalCount: 0,
          totalPages: 0,
          skip: 0
        }
      };
    }
  }
});

export const {
  createMatchmakingStart,
  createMatchmakingSuccess,
  createMatchmakingFailure,
  fetchMatchmakingStart,
  fetchMatchmakingSuccess,
  fetchMatchmakingFailure,
  updateMatchmakingPagination,
  resetCreateMatchmakingState,
  resetMatchmakingState
} = matchmakingSlice.actions;

export default matchmakingSlice.reducer;
