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
export type IBlogsPost = BaseModel & {
  sequence?: number;
  thumbnail_image?: string;
  main_image?: string;
  heading?: string;
  slug?: string;
  short_description?: string;
  long_description?: string;
  status?: boolean;
};

// Initial state
const initialState = {
  BlogsPostState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IBlogsPost[]>,
  singleBlogsPostState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IBlogsPost | null>,
  currentBlogsPostState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IBlogsPost | null>
};

// Thunks
export const fetchBlogsPost = createAsyncThunk<
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
  'homeaboutlist/fetchBlogsPost',
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
      dispatch(fetchBlogsPostStart());
      const response = await fetchApi(
        `/blogspost/all?page=${page}&pageSize=${pageSize}&text=${keyword}&field=${field}&active=${status}&export=${exportData}`,
        { method: 'GET' }
      );

      if (response?.success) {
        dispatch(
          fetchBlogsPostSuccess({
            data: response.blogspostData,
            totalCount: response.totalCount
          })
        );
        return response;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error: any) {
      dispatch(fetchBlogsPostFailure(error?.message || 'Something went wrong'));
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

export const addEditBlogsPost = createAsyncThunk<
  any,
  { formData: FormData; entityId?: string | null },
  { state: RootState }
>(
  'homeaboutlist/add',
  async ({ formData, entityId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(addEditBlogsPostStart());

      let response;
      if (!entityId) {
        // Create new entry
        response = await fetchApi('/blogspost/new', {
          method: 'POST',
          body: formData
        });
      } else {
        // Update existing entry
        response = await fetchApi(`/blogspost/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }
      if (response?.success) {
        dispatch(addEditBlogsPostSuccess());
        dispatch(fetchBlogsPost()); // Refresh list after adding/editing
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something went wrong!';
        dispatch(addEditBlogsPostFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something went wrong!';
      dispatch(addEditBlogsPostFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

// export const fetchSingleHomeAboutList = createAsyncThunk<
//   any,
//   string | null,
//   { state: RootState }
// >(
//   'types/getsingletypes',
//   async (entityId, { dispatch, rejectWithValue, getState }) => {
//     try {
//       dispatch(fetchSingleHomeAboutListStart());
//       const response = await fetchApi(`/homeaboutlist/single/${entityId}`, {
//         method: 'GET'
//       });
//       if (response?.success) {
//         dispatch(fetchSingleHomeAboutListSuccess(response?.slider));
//         return response;
//       } else {
//         let errorMsg = response?.data?.message || 'Something Went Wrong';
//         dispatch(fetchSingleHomeAboutListFailure(errorMsg));
//         return rejectWithValue(errorMsg);
//       }
//     } catch (error: any) {
//       let errorMsg = error?.message || 'Something Went Wrong';
//       dispatch(fetchSingleHomeAboutListFailure(errorMsg));
//       return rejectWithValue(errorMsg);
//     }
//   }
// );

export const deleteBlogsPost = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('brand/delete', async (id, { dispatch }) => {
  dispatch(deleteBlogsPostStart());
  try {
    const response = await fetchApi(`/blogspost/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteBlogsPostSuccess(id));
      dispatch(fetchBlogsPost());
      toast.success('Post deleted successfuly');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteBlogsPostFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(deleteBlogsPostFailure(error.message || 'Failed to delete Post'));
    toast.error(error.message);
  }
});

// Slice
const blogspostSlice = createSlice({
  name: 'blogpost',
  initialState,
  reducers: {
    fetchBlogsPostStart(state) {
      state.BlogsPostState.loading = true;
      state.BlogsPostState.error = null;
    },
    fetchBlogsPostSuccess(state, action) {
      const { data, totalCount } = action.payload;
      state.BlogsPostState.data = data;
      state.BlogsPostState.pagination.totalCount = totalCount;
      state.BlogsPostState.loading = false;
    },
    fetchBlogsPostFailure(state, action) {
      state.BlogsPostState.loading = false;
      state.BlogsPostState.error = action.payload;
    },
    addEditBlogsPostStart(state) {
      state.singleBlogsPostState.loading = true;
      state.singleBlogsPostState.error = null;
    },
    addEditBlogsPostSuccess(state) {
      state.singleBlogsPostState.loading = false;
    },
    addEditBlogsPostFailure(state, action) {
      state.singleBlogsPostState.loading = false;
      state.singleBlogsPostState.error = action.payload;
    },
    updateHomeAboutListData(state, action) {
      const oldData = state.singleBlogsPostState.data;
      state.singleBlogsPostState.data = { ...oldData, ...action.payload };
    },
    fetchSingleHomeAboutListStart(state) {
      state.singleBlogsPostState.loading = true;
      state.singleBlogsPostState.error = null;
    },
    fetchSingleHomeAboutListSuccess(state, action) {
      state.singleBlogsPostState.loading = false;
      state.singleBlogsPostState.data = action.payload;
      state.singleBlogsPostState.error = null;
    },
    fetchSingleHomeAboutListFailure(state, action) {
      state.singleBlogsPostState.loading = false;
      state.singleBlogsPostState.error = action.payload;
    },
    deleteBlogsPostStart(state) {
      state.singleBlogsPostState.loading = true;
      state.singleBlogsPostState.error = null;
    },
    deleteBlogsPostSuccess(state, action) {
      state.singleBlogsPostState.loading = false;
    },
    deleteBlogsPostFailure(state, action) {
      state.singleBlogsPostState.loading = false;
      state.singleBlogsPostState.error = action.payload;
    }
  }
});

export const {
  fetchBlogsPostStart,
  fetchBlogsPostSuccess,
  fetchBlogsPostFailure,
  addEditBlogsPostStart,
  addEditBlogsPostSuccess,
  addEditBlogsPostFailure,
  updateHomeAboutListData,
  fetchSingleHomeAboutListStart,
  fetchSingleHomeAboutListSuccess,
  fetchSingleHomeAboutListFailure,
  deleteBlogsPostStart,
  deleteBlogsPostSuccess,
  deleteBlogsPostFailure
} = blogspostSlice.actions;

export default blogspostSlice.reducer;
