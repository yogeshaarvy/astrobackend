import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// Define the SlidersRootState type to include sliders
export interface SlidersRootState {
  sliders: typeof initialState;
}
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { title } from 'process';

// Define the IHomeAboutList type
export type IContactUs = BaseModel & {
  email?: string;
  name?: string;
  message?: string;
};

// Initial state
const initialState = {
  ContactState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IContactUs[]>
};

// Thunks
export const fetchContactUs = createAsyncThunk<
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
  'homeaboutlist/fetchContact',
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
      dispatch(fetchContactStart());
      const response = await fetchApi(
        `/contact/get?page=${page}&pageSize=${pageSize}&text=${keyword}&field=${field}&active=${status}&export=${exportData}&limit=${limit}`,
        { method: 'GET' }
      );
      console.log('this is the contact data:', response);
      if (response?.success) {
        dispatch(
          fetchContactSuccess({
            data: response.contactUs,
            totalCount: response.totalCount
          })
        );
        return response;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error: any) {
      dispatch(fetchContactFailure(error?.message || 'Something went wrong'));
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

// Slice
const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    fetchContactStart(state) {
      state.ContactState.loading = true;
      state.ContactState.error = null;
    },
    fetchContactSuccess(state, action) {
      const { data, totalCount } = action.payload;
      state.ContactState.data = data;
      state.ContactState.pagination.totalCount = totalCount;
      state.ContactState.loading = false;
    },
    fetchContactFailure(state, action) {
      state.ContactState.loading = false;
      state.ContactState.error = action.payload;
    }
  }
});

export const { fetchContactStart, fetchContactSuccess, fetchContactFailure } =
  contactSlice.actions;

export default contactSlice.reducer;
