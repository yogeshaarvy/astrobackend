import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

export interface FollowersRootState {
  followers: typeof initialState;
}

// Define the IFollower type - matches API response
export type IFollower = {
  _id: string;
  name?: string;
  email?: string;
  profilePic?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Initial state
const initialState = {
  data: [] as IFollower[],
  loading: false,
  error: null as string | null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalFollowers: 0
  }
};

export const fetchFollowersList = createAsyncThunk<
  {
    followers: IFollower[];
    totalFollowers: number;
    currentPage: number;
    totalPages: number;
  },
  {
    astrologerId: string;
    page?: number;
    limit?: number;
  },
  { state: RootState }
>('followers/fetchList', async (input, { rejectWithValue }) => {
  try {
    const { astrologerId, page = 1, limit = 10 } = input;

    const response = await fetchApi(
      `/astrodetails/follow/get/${astrologerId}?page=${page}&limit=${limit}`,
      {
        method: 'GET'
      }
    );

    console.log('Followers API response:', response);

    if (response?.success) {
      return {
        followers: response.followers,
        totalFollowers: response.totalFollowers,
        currentPage: response.currentPage,
        totalPages: response.totalPages
      };
    } else {
      throw new Error(response?.message || 'Failed to fetch followers');
    }
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Something went wrong');
  }
});

// Slice
const followersSlice = createSlice({
  name: 'followers',
  initialState,
  reducers: {
    clearFollowersState(state) {
      state.data = [];
      state.loading = false;
      state.error = null;
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalFollowers: 0
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowersList.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.followers;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalFollowers: action.payload.totalFollowers
        };
      })
      .addCase(fetchFollowersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearFollowersState } = followersSlice.actions;

export default followersSlice.reducer;
