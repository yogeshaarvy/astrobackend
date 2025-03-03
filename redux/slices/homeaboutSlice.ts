import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';

export type IHomeAbout = BaseModel & {
  background_image: string;
  main_image: string;
  icon1: string;
  icon2: string;
  icon3: string;
  title1: string;
  title2: string;
  title3: string;
  heading: string;
};

const initialState = {
  homeaboutState: {
    data: {}, // Initial data as an empty object
    loading: false, // Represents whether the API call is in progress
    error: null // Stores any errors from API calls
  } as BaseState<IHomeAbout>
};

export const fetchHomeAbout = createAsyncThunk<any, void, { state: RootState }>(
  'midbanner/fetchData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSingleHomeAboutStart());

      const response = await fetchApi('/homeabout/get', {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleHomeAboutSuccess(response));
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to fetch description';
        dispatch(fetchSingleHomeAboutFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleHomeAboutFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditHomeAbout = createAsyncThunk<
  any,
  {
    background_image: any;
    main_image: any;
    icon1: any;
    icon2: any;
    icon3: any;
    title1: string;
    title2: string;
    title3: string;
    heading: string;
  },
  { state: RootState }
>(
  'midbanner/addEditHomeAbout',
  async (
    {
      background_image,
      main_image,
      icon1,
      icon2,
      icon3,
      title1,
      title2,
      title3,
      heading
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(addEditHomeAboutStart());

      const formData = new FormData();
      formData.append('background_image', background_image);
      formData.append('main_image', main_image);
      formData.append('icon1', icon1);
      formData.append('icon2', icon2);
      formData.append('icon3', icon3);
      formData.append('title1', title1);
      formData.append('title2', title2);
      formData.append('title3', title3);
      formData.append('heading', heading);

      const endpoint = '/homeabout/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditHomeAboutSuccess());
        toast.success(
          response?.isNew
            ? 'HomeAbout created successfully'
            : 'HomeAbout updated successfully'
        );

        dispatch(fetchHomeAbout()); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditHomeAboutFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditHomeAboutFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const homeaboutSlice = createSlice({
  name: 'midbanner',
  initialState,
  reducers: {
    fetchMidbannerStart(state) {
      state.homeaboutState.loading = true;
      state.homeaboutState.error = null;
    },
    addEditHomeAboutStart(state) {
      state.homeaboutState.loading = true;
      state.homeaboutState.error = null;
    },
    addEditHomeAboutSuccess(state) {
      state.homeaboutState.loading = false;
      state.homeaboutState.error = null;
    },
    addEditHomeAboutFailure(state, action) {
      state.homeaboutState.loading = false;
      state.homeaboutState.error = action.payload;
    },
    fetchSingleHomeAboutStart(state) {
      state.homeaboutState.loading = true;
      state.homeaboutState.error = null;
    },
    fetchSingleHomeAboutSuccess(state, action) {
      state.homeaboutState.loading = false;
      state.homeaboutState.data = action.payload;
      state.homeaboutState.error = null;
    },
    fetchSingleHomeAboutFailure(state, action) {
      state.homeaboutState.loading = false;
      state.homeaboutState.error = action.payload;
    }
  }
});

export const {
  addEditHomeAboutStart,
  addEditHomeAboutSuccess,
  addEditHomeAboutFailure,
  fetchSingleHomeAboutStart,
  fetchSingleHomeAboutSuccess,
  fetchSingleHomeAboutFailure
} = homeaboutSlice.actions;

export default homeaboutSlice.reducer;
