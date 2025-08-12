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
export type IHomeAboutList = BaseModel & {
  sequence?: number;
  icon?: string;
  title?: string;
  status?: boolean;
};

// Initial state
const initialState = {
  HomeAboutListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IHomeAboutList[]>,
  singleHomeAboutListState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IHomeAboutList | null>,
  currentHomeAboutListState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IHomeAboutList | null>
};

// Thunks
export const fetchHomeAboutList = createAsyncThunk<
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
  'homeaboutlist/fetchHomeAboutList',
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
      dispatch(fetchHomeAboutListStart());
      const response = await fetchApi(
        `/homeaboutlist/all?page=${page}&pageSize=${pageSize}&text=${keyword}&field=${field}&active=${status}&export=${exportData}`,
        { method: 'GET' }
      );
      if (response?.success) {
        dispatch(
          fetchHomeAboutListSuccess({
            data: response.homeaboutListData,
            totalCount: response.totalCount
          })
        );
        return response;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error: any) {
      dispatch(
        fetchHomeAboutListFailure(error?.message || 'Something went wrong')
      );
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

export const addEditHomeAboutList = createAsyncThunk<
  any,
  { formData: FormData; entityId?: string | null },
  { state: RootState }
>(
  'homeaboutlist/add',
  async ({ formData, entityId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(addEditHomeAboutListStart());
     
      let response;
      if (!entityId) {
        // Create new entry
        response = await fetchApi('/homeaboutlist/new', {
          method: 'POST',
          body: formData
        });
      } else {
        // Update existing entry
        response = await fetchApi(`/homeaboutlist/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }
      if (response?.success) {
        dispatch(addEditHomeAboutListSuccess());
        dispatch(fetchHomeAboutList()); // Refresh list after adding/editing
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something went wrong!';
        dispatch(addEditHomeAboutListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something went wrong!';
      dispatch(addEditHomeAboutListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleHomeAboutList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'types/getsingletypes',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleHomeAboutListStart());
      const response = await fetchApi(`/homeaboutlist/single/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleHomeAboutListSuccess(response?.slider));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleHomeAboutListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleHomeAboutListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteHomeAboutList = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('brand/delete', async (id, { dispatch }) => {
  dispatch(deleteHomeAboutListStart());
  try {
    const response = await fetchApi(`/homeaboutlist/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteHomeAboutListSuccess(id));
      dispatch(fetchHomeAboutList());
      toast.success('Home List deleted successfuly');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteHomeAboutListFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteHomeAboutListFailure(error.message || 'Failed to delete slider')
    );
    toast.error(error.message);
  }
});

// Slice
const homeaboutlistSlice = createSlice({
  name: 'sliders',
  initialState,
  reducers: {
    fetchHomeAboutListStart(state) {
      state.HomeAboutListState.loading = true;
      state.HomeAboutListState.error = null;
    },
    fetchHomeAboutListSuccess(state, action) {
      const { data, totalCount } = action.payload;
      state.HomeAboutListState.data = data;
      state.HomeAboutListState.pagination.totalCount = totalCount;
      state.HomeAboutListState.loading = false;
    },
    fetchHomeAboutListFailure(state, action) {
      state.HomeAboutListState.loading = false;
      state.HomeAboutListState.error = action.payload;
    },
    addEditHomeAboutListStart(state) {
      state.singleHomeAboutListState.loading = true;
      state.singleHomeAboutListState.error = null;
    },
    addEditHomeAboutListSuccess(state) {
      state.singleHomeAboutListState.loading = false;
    },
    addEditHomeAboutListFailure(state, action) {
      state.singleHomeAboutListState.loading = false;
      state.singleHomeAboutListState.error = action.payload;
    },
    updateHomeAboutListData(state, action) {
      const oldData = state.singleHomeAboutListState.data;
      state.singleHomeAboutListState.data = { ...oldData, ...action.payload };
    },
    fetchSingleHomeAboutListStart(state) {
      state.singleHomeAboutListState.loading = true;
      state.singleHomeAboutListState.error = null;
    },
    fetchSingleHomeAboutListSuccess(state, action) {
      state.singleHomeAboutListState.loading = false;
      state.singleHomeAboutListState.data = action.payload;
      state.singleHomeAboutListState.error = null;
    },
    fetchSingleHomeAboutListFailure(state, action) {
      state.singleHomeAboutListState.loading = false;
      state.singleHomeAboutListState.error = action.payload;
    },
    deleteHomeAboutListStart(state) {
      state.singleHomeAboutListState.loading = true;
      state.singleHomeAboutListState.error = null;
    },
    deleteHomeAboutListSuccess(state, action) {
      state.singleHomeAboutListState.loading = false;
    },
    deleteHomeAboutListFailure(state, action) {
      state.singleHomeAboutListState.loading = false;
      state.singleHomeAboutListState.error = action.payload;
    }
  }
});

export const {
  fetchHomeAboutListStart,
  fetchHomeAboutListSuccess,
  fetchHomeAboutListFailure,
  addEditHomeAboutListStart,
  addEditHomeAboutListSuccess,
  addEditHomeAboutListFailure,
  updateHomeAboutListData,
  fetchSingleHomeAboutListStart,
  fetchSingleHomeAboutListSuccess,
  fetchSingleHomeAboutListFailure,
  deleteHomeAboutListStart,
  deleteHomeAboutListSuccess,
  deleteHomeAboutListFailure
} = homeaboutlistSlice.actions;

export default homeaboutlistSlice.reducer;
