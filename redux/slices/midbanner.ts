import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';

export type IMidbanner = BaseModel & {
  image: string;
  title: string;
  description: string;
  link: string;
};

const initialState = {
  midbannerState: {
    data: {}, // Initial data as an empty object
    loading: false, // Represents whether the API call is in progress
    error: null // Stores any errors from API calls
  } as BaseState<IMidbanner>
};

export const fetchMidbanner = createAsyncThunk<any, void, { state: RootState }>(
  'midbanner/fetchData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSingleMidbannerStart());

      const response = await fetchApi('/midbanner/get', {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleMidbannerSuccess(response));
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to fetch description';
        dispatch(fetchSingleMidbannerFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleMidbannerFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditMidbanner = createAsyncThunk<
  any,
  {
    image: string;
    title: string;
    description: string;
    link: string;
  },
  { state: RootState }
>(
  'midbanner/addEditMidbanner',
  async (
    { image, description, title, link },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(addEditMidbannerStart());

      const formData = new FormData();
      formData.append('image', image);
      formData.append('description', description);
      formData.append('title', title);
      formData.append('link', link);

      const endpoint = '/midbanner/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditMidbannerSuccess());
        toast.success(
          response?.isNew
            ? 'Midbanner created successfully'
            : 'Midbanner updated successfully'
        );

        dispatch(fetchMidbanner()); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditMidbannerFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditMidbannerFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const midbannerSlice = createSlice({
  name: 'midbanner',
  initialState,
  reducers: {
    fetchMidbannerStart(state) {
      state.midbannerState.loading = true;
      state.midbannerState.error = null;
    },
    addEditMidbannerStart(state) {
      state.midbannerState.loading = true;
      state.midbannerState.error = null;
    },
    addEditMidbannerSuccess(state) {
      state.midbannerState.loading = false;
      state.midbannerState.error = null;
    },
    addEditMidbannerFailure(state, action) {
      state.midbannerState.loading = false;
      state.midbannerState.error = action.payload;
    },
    fetchSingleMidbannerStart(state) {
      state.midbannerState.loading = true;
      state.midbannerState.error = null;
    },
    fetchSingleMidbannerSuccess(state, action) {
      state.midbannerState.loading = false;
      state.midbannerState.data = action.payload;
      state.midbannerState.error = null;
    },
    fetchSingleMidbannerFailure(state, action) {
      state.midbannerState.loading = false;
      state.midbannerState.error = action.payload;
    }
  }
});

export const {
  addEditMidbannerStart,
  addEditMidbannerSuccess,
  addEditMidbannerFailure,
  fetchSingleMidbannerStart,
  fetchSingleMidbannerSuccess,
  fetchSingleMidbannerFailure
} = midbannerSlice.actions;

export default midbannerSlice.reducer;
