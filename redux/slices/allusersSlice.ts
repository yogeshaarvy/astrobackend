import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the SlidersRootState type to include sliders
export interface SlidersRootState {
  sliders: typeof initialState;
}
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { title } from 'process';

// Define the IHomeAboutList type
export type IAllUsers = BaseModel & {
  name?: string;
  email?: string;
  phone?: string;
};

// Initial state
const initialState = {
  AllUsersState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IAllUsers[]>
};

// Thunks
export const fetchAllUsers = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field?: string;
    status?: string;
    exportData?: boolean;
  },
  { state: RootState }
>(
  'homeaboutlist/fetchAllUsers',
  async (input, { dispatch, rejectWithValue }) => {
    try {
      const {
        page = 1,
        pageSize = 10,
        keyword = '',
        field = '',
        status = '',
        exportData = false
      } = input || {};
      dispatch(fetchAllUsersStart());
      const response = await fetchApi(
        `/users/all?page=${page}&pageSize=${pageSize}&text=${keyword}&field=${field}&active=${status}&export=${exportData}`,
        { method: 'GET' }
      );
      if (response?.success) {
        dispatch(
          fetchAllUsersSuccess({
            data: response.users,
            totalCount: response.totalCount
          })
        );
        return response;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error: any) {
      dispatch(fetchAllUsersFailure(error?.message || 'Something went wrong'));
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

// Slice
const allusersSlice = createSlice({
  name: 'allusers',
  initialState,
  reducers: {
    fetchAllUsersStart(state) {
      state.AllUsersState.loading = true;
      state.AllUsersState.error = null;
    },
    fetchAllUsersSuccess(state, action) {
      const { data, totalCount } = action.payload;
      state.AllUsersState.data = data;
      state.AllUsersState.pagination.totalCount = totalCount;
      state.AllUsersState.loading = false;
    },
    fetchAllUsersFailure(state, action) {
      state.AllUsersState.loading = false;
      state.AllUsersState.error = action.payload;
    }
  }
});

export const {
  fetchAllUsersStart,
  fetchAllUsersSuccess,
  fetchAllUsersFailure
} = allusersSlice.actions;

export default allusersSlice.reducer;
