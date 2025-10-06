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
  active?: boolean;
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
  } as PaginationState<IAllUsers[]>,
  updateUserActiveState: {
    loading: false,
    error: null
  } as BaseState
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
    role?: string;
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
        role = 'user',
        exportData = false
      } = input || {};
      dispatch(fetchAllUsersStart());
      const response = await fetchApi(
        `/users/get/allForPannel?page=${page}&pageSize=${pageSize}&text=${keyword}&field=${field}&active=${status}&export=${exportData}&role=${role}`,
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

// Update user active status
export const updateUserActiveStatus = createAsyncThunk<
  any,
  {
    userId: string;
    active: boolean;
  },
  { state: RootState }
>(
  'allusers/updateUserActiveStatus',
  async (input, { dispatch, rejectWithValue }) => {
    try {
      const { userId, active } = input;
      dispatch(updateUserActiveStart());

      const reqBody: any = {
        active: active
      };

      const response = await fetchApi(`/users/update/active/${userId}`, {
        method: 'PUT',
        body: reqBody
      });

      if (response?.success) {
        dispatch(updateUserActiveSuccess({ userId, active }));
        toast.success(response.message || 'User status updated successfully');
        return response;
      } else {
        throw new Error(response?.message || 'Failed to update user status');
      }
    } catch (error: any) {
      dispatch(
        updateUserActiveFailure(error?.message || 'Something went wrong')
      );
      toast.error(error?.message || 'Failed to update user status');
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
    },
    updateUserActiveStart(state) {
      state.updateUserActiveState.loading = true;
      state.updateUserActiveState.error = null;
    },
    updateUserActiveSuccess(state, action) {
      const { userId, active } = action.payload;
      // Update the user in the data array
      const userIndex = state.AllUsersState.data.findIndex(
        (user: any) => user._id === userId
      );
      if (userIndex !== -1) {
        state.AllUsersState.data[userIndex] = {
          ...state.AllUsersState.data[userIndex],
          active
        };
      }
      state.updateUserActiveState.loading = false;
    },
    updateUserActiveFailure(state, action) {
      state.updateUserActiveState.loading = false;
      state.updateUserActiveState.error = action.payload;
    }
  }
});

export const {
  fetchAllUsersStart,
  fetchAllUsersSuccess,
  fetchAllUsersFailure,
  updateUserActiveStart,
  updateUserActiveSuccess,
  updateUserActiveFailure
} = allusersSlice.actions;

export default allusersSlice.reducer;
