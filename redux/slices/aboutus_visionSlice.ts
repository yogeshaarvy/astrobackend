import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';

export type IAboutusVision = BaseModel & {
  image: string;

  description: string;
};

const initialState = {
  aboutusVisionState: {
    data: {}, // Initial data as an empty object
    loading: false, // Represents whether the API call is in progress
    error: null // Stores any errors from API calls
  } as BaseState<IAboutusVision>
};

export const fetchAboutusVision = createAsyncThunk<
  any,
  void,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleAboutusVisionStart());

    const response = await fetchApi('/aboutus_vision/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleAboutusVisionSuccess(response));
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleAboutusVisionFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleAboutusVisionFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditAboutusVision = createAsyncThunk<
  any,
  {
    image: any;

    description: string;
  },
  { state: RootState }
>(
  'midbanner/addEditAboutusVision',
  async (
    {
      image,

      description
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(addEditAboutusVisionStart());

      const formData = new FormData();
      formData.append('image', image);

      formData.append('description', description);

      const endpoint = '/aboutus_vision/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditAboutusVisionSuccess());
        toast.success(
          response?.isNew
            ? 'About Vision created successfully'
            : 'About Vision updated successfully'
        );

        dispatch(fetchAboutusVision()); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditAboutusVisionFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditAboutusVisionFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const aboutusvisionSlice = createSlice({
  name: 'aboutus_vision',
  initialState,
  reducers: {
    fetchAboutusVisionStart(state) {
      state.aboutusVisionState.loading = true;
      state.aboutusVisionState.error = null;
    },
    addEditAboutusVisionStart(state) {
      state.aboutusVisionState.loading = true;
      state.aboutusVisionState.error = null;
    },
    addEditAboutusVisionSuccess(state) {
      state.aboutusVisionState.loading = false;
      state.aboutusVisionState.error = null;
    },
    addEditAboutusVisionFailure(state, action) {
      state.aboutusVisionState.loading = false;
      state.aboutusVisionState.error = action.payload;
    },
    fetchSingleAboutusVisionStart(state) {
      state.aboutusVisionState.loading = true;
      state.aboutusVisionState.error = null;
    },
    fetchSingleAboutusVisionSuccess(state, action) {
      state.aboutusVisionState.loading = false;
      state.aboutusVisionState.data = action.payload;
      state.aboutusVisionState.error = null;
    },
    fetchSingleAboutusVisionFailure(state, action) {
      state.aboutusVisionState.loading = false;
      state.aboutusVisionState.error = action.payload;
    }
  }
});

export const {
  addEditAboutusVisionStart,
  addEditAboutusVisionSuccess,
  addEditAboutusVisionFailure,
  fetchSingleAboutusVisionStart,
  fetchSingleAboutusVisionSuccess,
  fetchSingleAboutusVisionFailure
} = aboutusvisionSlice.actions;

export default aboutusvisionSlice.reducer;
