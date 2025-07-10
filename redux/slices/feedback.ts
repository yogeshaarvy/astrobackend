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
export type IFeedback = BaseModel & {
  email?: string;
  name?: string;
  message?: string;
  phone?: number;
};

// Initial state
const initialState = {
  FeedbackState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IFeedback[]>
};

// Thunks
export const fetchFeedback = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field?: string;
    status?: string;
    limit: number;
    exportData?: boolean;
  },
  { state: RootState }
>(
  'homeaboutlist/fetchFeedback',
  async (input, { dispatch, rejectWithValue }) => {
    try {
      const {
        page = 1,
        pageSize = 10,
        keyword = '',
        field = '',
        status = '',
        limit = 10,
        exportData = false
      } = input || {};
      dispatch(fetchFeedbackStart());
      const response = await fetchApi(
        `/feedback/get?page=${page}&pageSize=${pageSize}&text=${keyword}&field=${field}&active=${status}&export=${exportData}&limit=${limit}`,
        { method: 'GET' }
      );
      console.log('this is the Feedback data:', response);
      if (response?.success) {
        dispatch(
          fetchFeedbackSuccess({
            data: response.feedback,
            totalCount: response.totalCount
          })
        );
        return response;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error: any) {
      dispatch(fetchFeedbackFailure(error?.message || 'Something went wrong'));
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

// Slice
const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    fetchFeedbackStart(state) {
      state.FeedbackState.loading = true;
      state.FeedbackState.error = null;
    },
    fetchFeedbackSuccess(state, action) {
      const { data, totalCount } = action.payload;
      state.FeedbackState.data = data;
      state.FeedbackState.pagination.totalCount = totalCount;
      state.FeedbackState.loading = false;
    },
    fetchFeedbackFailure(state, action) {
      state.FeedbackState.loading = false;
      state.FeedbackState.error = action.payload;
    }
  }
});

export const {
  fetchFeedbackStart,
  fetchFeedbackSuccess,
  fetchFeedbackFailure
} = feedbackSlice.actions;

export default feedbackSlice.reducer;
