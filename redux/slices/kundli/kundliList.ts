import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// Define the KundliRootState type to include kundli
export interface KundliRootState {
  kundli: typeof initialState;
}
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, PaginationState } from '@/types/globals';

// Define the IKundli type
export type IKundli = BaseModel & {
  name?: string;
  dob?: string;
  tob?: string;
  lat?: string;
  lon?: string;
  tz?: string;
  gender?: string;
  lang?: string;
};

// Define the API response type to match the backend
export type IKundliApiResponse = {
  success: boolean;
  message: string;
  kundliRecords: IKundli[];
  currentPage: number;
  limit: number;
  skip: number;
  totalPage: number;
  totalKundliCount: number;
};

// Initial state
const initialState = {
  KundliState: {
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
  } as PaginationState<IKundli[]> & {
    pagination: {
      page: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
      skip: number;
    };
  }
};

// Thunk for fetching all kundli records
export const fetchAllKundli = createAsyncThunk<
  IKundliApiResponse,
  {
    page?: number;
    limit?: number;
    field?: string;
    text?: string;
    lang?: string;
    gender?: string;
    exportData?: boolean;
  },
  { state: RootState }
>('kundli/fetchAllKundli', async (input, { dispatch, rejectWithValue }) => {
  try {
    const {
      page = 1,
      limit = 10,
      field = '',
      text = '',
      lang = '',
      gender = '',
      exportData = false
    } = input || {};

    dispatch(fetchKundliStart());

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

    if (gender) {
      params.append('gender', gender);
    }

    if (exportData) {
      params.append('exportData', 'true');
    }

    const response = await fetchApi(`/kundli/get?${params.toString()}`, {
      method: 'GET'
    });

    if (response?.success) {
      dispatch(
        fetchKundliSuccess({
          data: response.kundliRecords,
          currentPage: response.currentPage,
          limit: response.limit,
          skip: response.skip,
          totalPages: response.totalPage,
          totalCount: response.totalKundliCount
        })
      );
      return response;
    } else {
      throw new Error(response?.message || 'Invalid API response');
    }
  } catch (error: any) {
    dispatch(fetchKundliFailure(error?.message || 'Something went wrong'));
    return rejectWithValue(error?.message || 'Something went wrong');
  }
});

// Slice
const kundliSlice = createSlice({
  name: 'kundli',
  initialState,
  reducers: {
    // Fetch kundli reducers
    fetchKundliStart(state) {
      state.KundliState.loading = true;
      state.KundliState.error = null;
    },
    fetchKundliSuccess(state, action) {
      const { data, currentPage, limit, skip, totalPages, totalCount } =
        action.payload;
      state.KundliState.data = data;
      state.KundliState.pagination.page = currentPage;
      state.KundliState.pagination.pageSize = limit;
      state.KundliState.pagination.skip = skip;
      state.KundliState.pagination.totalPages = totalPages;
      state.KundliState.pagination.totalCount = totalCount;
      state.KundliState.loading = false;
    },
    fetchKundliFailure(state, action) {
      state.KundliState.loading = false;
      state.KundliState.error = action.payload;
    },
    // Update pagination
    updateKundliPagination(state, action) {
      const { page, pageSize } = action.payload;
      state.KundliState.pagination.page = page;
      state.KundliState.pagination.pageSize = pageSize;
    },
    // Reset state
    resetKundliState(state) {
      state.KundliState = {
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
  fetchKundliStart,
  fetchKundliSuccess,
  fetchKundliFailure,
  updateKundliPagination,
  resetKundliState
} = kundliSlice.actions;

export default kundliSlice.reducer;
