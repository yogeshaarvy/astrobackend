import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';

export type IAboutus_BottomBanner = BaseModel & {
  banner_image: string;
  title: string;
  description: string;
};

const initialState = {
  aboutusBottomBannerState: {
    data: {}, // Initial data as an empty object
    loading: false, // Represents whether the API call is in progress
    error: null // Stores any errors from API calls
  } as BaseState<IAboutus_BottomBanner>
};

export const fetchAboutusBottomBanner = createAsyncThunk<
  any,
  void,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleAboutusBottomBannerStart());

    const response = await fetchApi('/aboutus_bottombanner/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleAboutusBottomBannerSuccess(response));
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleAboutusBottomBannerFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleAboutusBottomBannerFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditAboutusBottomBanner = createAsyncThunk<
  any,
  {
    banner_image: string;
    title: string;
    description: string;
  },
  { state: RootState }
>(
  '/addEditAboutusBottomBanner',
  async (
    { banner_image, title, description },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(addEditAboutusBottomBannerStart());

      const formData = new FormData();
      formData.append('banner_image', banner_image);
      //   formData.append('description', description);
      formData.append('title', title);
      formData.append('description', description);
      //   formData.append('link', link);

      const endpoint = '/aboutus_bottombanner/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditAboutusBottomBannerSuccess());
        toast.success(
          response?.isNew
            ? 'Bottom Banner created successfully'
            : 'Bottom Banner updated successfully'
        );

        dispatch(fetchAboutusBottomBanner()); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditAboutusBottomBannerFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditAboutusBottomBannerFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const aboutusBottomBannerSlice = createSlice({
  name: 'aboutus_bottombanner',
  initialState,
  reducers: {
    fetchAboutusBottomBannerStart(state) {
      state.aboutusBottomBannerState.loading = true;
      state.aboutusBottomBannerState.error = null;
    },
    addEditAboutusBottomBannerStart(state) {
      state.aboutusBottomBannerState.loading = true;
      state.aboutusBottomBannerState.error = null;
    },
    addEditAboutusBottomBannerSuccess(state) {
      state.aboutusBottomBannerState.loading = false;
      state.aboutusBottomBannerState.error = null;
    },
    addEditAboutusBottomBannerFailure(state, action) {
      state.aboutusBottomBannerState.loading = false;
      state.aboutusBottomBannerState.error = action.payload;
    },
    fetchSingleAboutusBottomBannerStart(state) {
      state.aboutusBottomBannerState.loading = true;
      state.aboutusBottomBannerState.error = null;
    },
    fetchSingleAboutusBottomBannerSuccess(state, action) {
      state.aboutusBottomBannerState.loading = false;
      state.aboutusBottomBannerState.data = action.payload;
      state.aboutusBottomBannerState.error = null;
    },
    fetchSingleAboutusBottomBannerFailure(state, action) {
      state.aboutusBottomBannerState.loading = false;
      state.aboutusBottomBannerState.error = action.payload;
    }
  }
});

export const {
  addEditAboutusBottomBannerStart,
  addEditAboutusBottomBannerSuccess,
  addEditAboutusBottomBannerFailure,
  fetchSingleAboutusBottomBannerStart,
  fetchSingleAboutusBottomBannerSuccess,
  fetchSingleAboutusBottomBannerFailure
} = aboutusBottomBannerSlice.actions;

export default aboutusBottomBannerSlice.reducer;
