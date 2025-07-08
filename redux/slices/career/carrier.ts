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
export type ICarrier = BaseModel & {
  email?: string;
  name?: string;
  info?: string;
  resume?: string;
};

// Initial state
const initialState = {
  CarrierState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<ICarrier[]>
};

// Thunks
export const fetchCarrier = createAsyncThunk<
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
  'homeaboutlist/fetchCarrier',
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
      dispatch(fetchCarrierStart());
      const response = await fetchApi(
        `/carrier/get?page=${page}&pageSize=${pageSize}&text=${keyword}&field=${field}&active=${status}&export=${exportData}&limit=${limit}`,
        { method: 'GET' }
      );
      if (response?.success) {
        dispatch(
          fetchCarrierSuccess({
            data: response.carriers,
            totalCount: response.totalCount
          })
        );
        return response;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error: any) {
      dispatch(fetchCarrierFailure(error?.message || 'Something went wrong'));
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

// Slice
const carrierSlice = createSlice({
  name: 'carrier',
  initialState,
  reducers: {
    fetchCarrierStart(state) {
      state.CarrierState.loading = true;
      state.CarrierState.error = null;
    },
    fetchCarrierSuccess(state, action) {
      const { data, totalCount } = action.payload;
      state.CarrierState.data = data;
      state.CarrierState.pagination.totalCount = totalCount;
      state.CarrierState.loading = false;
    },
    fetchCarrierFailure(state, action) {
      state.CarrierState.loading = false;
      state.CarrierState.error = action.payload;
    }
  }
});

export const { fetchCarrierStart, fetchCarrierSuccess, fetchCarrierFailure } =
  carrierSlice.actions;

export default carrierSlice.reducer;
