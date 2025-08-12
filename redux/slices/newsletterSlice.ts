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
export type INewsletter = BaseModel & {
  email?: string;
};

// Initial state
const initialState = {
  NewsletterState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<INewsletter[]>
};

// Thunks
export const fetchNewsLetter = createAsyncThunk<
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
  'homeaboutlist/fetchNewsletter',
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
      dispatch(fetchNewsletterStart());
      const response = await fetchApi(
        `/newsletter/get?page=${page}&pageSize=${pageSize}&text=${keyword}&field=${field}&active=${status}&export=${exportData}&limit=${limit}`,
        { method: 'GET' }
      );
      if (response?.success) {
        dispatch(
          fetchNewsletterSuccess({
            data: response.Newsletter,
            totalCount: response.totalCount
          })
        );
        return response;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error: any) {
      dispatch(
        fetchNewsletterFailure(error?.message || 'Something went wrong')
      );
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

// Slice
const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState,
  reducers: {
    fetchNewsletterStart(state) {
      state.NewsletterState.loading = true;
      state.NewsletterState.error = null;
    },
    fetchNewsletterSuccess(state, action) {
      const { data, totalCount } = action.payload;
      state.NewsletterState.data = data;
      state.NewsletterState.pagination.totalCount = totalCount;
      state.NewsletterState.loading = false;
    },
    fetchNewsletterFailure(state, action) {
      state.NewsletterState.loading = false;
      state.NewsletterState.error = action.payload;
    }
  }
});

export const {
  fetchNewsletterStart,
  fetchNewsletterSuccess,
  fetchNewsletterFailure
} = newsletterSlice.actions;

export default newsletterSlice.reducer;
