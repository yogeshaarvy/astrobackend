import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';

export type IAboutus_TopBanner = BaseModel & {
  banner_image: string;
  title: string;
};

const initialState = {
  aboutusTopBannerState: {
    data: {}, // Initial data as an empty object
    loading: false, // Represents whether the API call is in progress
    error: null // Stores any errors from API calls
  } as BaseState<IAboutus_TopBanner>
};

export const fetchAboutusTopBanner = createAsyncThunk<
  any,
  void,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleAboutusTopBannerStart());

    const response = await fetchApi('/aboutus_topbanner/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleAboutusTopBannerSuccess(response));
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleAboutusTopBannerFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleAboutusTopBannerFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditAboutusTopBanner = createAsyncThunk<
  any,
  {
    banner_image: string;
    title: string;
  },
  { state: RootState }
>(
  '/addEditAboutusTopBanner',
  async ({ banner_image, title }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(addEditAboutusTopBannerStart());

      const formData = new FormData();
      formData.append('banner_image', banner_image);
      //   formData.append('description', description);
      formData.append('title', title);
      //   formData.append('link', link);

      const endpoint = '/aboutus_topbanner/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditAboutusTopBannerSuccess());
        toast.success(
          response?.isNew
            ? 'Top Banner created successfully'
            : 'Top Banner updated successfully'
        );

        dispatch(fetchAboutusTopBanner()); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditAboutusTopBannerFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditAboutusTopBannerFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const aboutusTopBannerSlice = createSlice({
  name: 'aboutus_topbanner',
  initialState,
  reducers: {
    fetchAboutusTopBannerStart(state) {
      state.aboutusTopBannerState.loading = true;
      state.aboutusTopBannerState.error = null;
    },
    addEditAboutusTopBannerStart(state) {
      state.aboutusTopBannerState.loading = true;
      state.aboutusTopBannerState.error = null;
    },
    addEditAboutusTopBannerSuccess(state) {
      state.aboutusTopBannerState.loading = false;
      state.aboutusTopBannerState.error = null;
    },
    addEditAboutusTopBannerFailure(state, action) {
      state.aboutusTopBannerState.loading = false;
      state.aboutusTopBannerState.error = action.payload;
    },
    fetchSingleAboutusTopBannerStart(state) {
      state.aboutusTopBannerState.loading = true;
      state.aboutusTopBannerState.error = null;
    },
    fetchSingleAboutusTopBannerSuccess(state, action) {
      state.aboutusTopBannerState.loading = false;
      state.aboutusTopBannerState.data = action.payload;
      state.aboutusTopBannerState.error = null;
    },
    fetchSingleAboutusTopBannerFailure(state, action) {
      state.aboutusTopBannerState.loading = false;
      state.aboutusTopBannerState.error = action.payload;
    }
  }
});

export const {
  addEditAboutusTopBannerStart,
  addEditAboutusTopBannerSuccess,
  addEditAboutusTopBannerFailure,
  fetchSingleAboutusTopBannerStart,
  fetchSingleAboutusTopBannerSuccess,
  fetchSingleAboutusTopBannerFailure
} = aboutusTopBannerSlice.actions;

export default aboutusTopBannerSlice.reducer;
