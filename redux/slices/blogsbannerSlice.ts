import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';

export type IBlogsBanner = BaseModel & {
  background_image: string;
  image1: string;
  image2: string;
  heading: string;
  subheading: string;
};

const initialState = {
  blogsbannerState: {
    data: {}, // Initial data as an empty object
    loading: false, // Represents whether the API call is in progress
    error: null // Stores any errors from API calls
  } as BaseState<IBlogsBanner>
};

export const fetchBlogsBanner = createAsyncThunk<
  any,
  void,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleBlogsBannerStart());

    const response = await fetchApi('/blogsbanner/get', {
      method: 'GET'
    });

    if (response?.success) {
      dispatch(fetchSingleBlogsBannerSuccess(response));
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch banner';
      dispatch(fetchSingleBlogsBannerFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleBlogsBannerFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditBlogsBanner = createAsyncThunk<
  any,
  {
    background_image: any;
    image1: any;
    image2: any;
    heading: string;
    subheading: string;
  },
  { state: RootState }
>(
  'midbanner/addEditBlogsBanner',
  async (
    { background_image, image1, image2, heading, subheading },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(addEditBlogsBannerStart());

      const formData = new FormData();
      formData.append('background_image', background_image);
      formData.append('image1', image1);
      formData.append('image2', image2);
      formData.append('heading', heading);
      formData.append('subheading', subheading);

      const endpoint = '/blogsbanner/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditBlogsBannerSuccess());
        toast.success(
          response?.isNew
            ? 'HomeAbout created successfully'
            : 'HomeAbout updated successfully'
        );

        dispatch(fetchBlogsBanner()); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save banner';
        dispatch(addEditBlogsBannerFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditBlogsBannerFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const blogsbannerSlice = createSlice({
  name: 'blogsbanner',
  initialState,
  reducers: {
    fetchBlogsBannerStart(state) {
      state.blogsbannerState.loading = true;
      state.blogsbannerState.error = null;
    },
    addEditBlogsBannerStart(state) {
      state.blogsbannerState.loading = true;
      state.blogsbannerState.error = null;
    },
    addEditBlogsBannerSuccess(state) {
      state.blogsbannerState.loading = false;
      state.blogsbannerState.error = null;
    },
    addEditBlogsBannerFailure(state, action) {
      state.blogsbannerState.loading = false;
      state.blogsbannerState.error = action.payload;
    },
    fetchSingleBlogsBannerStart(state) {
      state.blogsbannerState.loading = true;
      state.blogsbannerState.error = null;
    },
    fetchSingleBlogsBannerSuccess(state, action) {
      state.blogsbannerState.loading = false;
      state.blogsbannerState.data = action.payload;
      state.blogsbannerState.error = null;
    },
    fetchSingleBlogsBannerFailure(state, action) {
      state.blogsbannerState.loading = false;
      state.blogsbannerState.error = action.payload;
    }
  }
});

export const {
  addEditBlogsBannerStart,
  addEditBlogsBannerSuccess,
  addEditBlogsBannerFailure,
  fetchSingleBlogsBannerStart,
  fetchSingleBlogsBannerSuccess,
  fetchSingleBlogsBannerFailure
} = blogsbannerSlice.actions;

export default blogsbannerSlice.reducer;
