import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';

export type IRegisterImage = BaseModel & {
  backgroundImage: string;
  title: string;
  description: string;
};

const initialState = {
  registerImageState: {
    data: {}, // Initial data as an empty object
    loading: false, // Represents whether the API call is in progress
    error: null // Stores any errors from API calls
  } as BaseState<RegisterImageState>
};

export const fetchRegisterImage = createAsyncThunk<
  any,
  void,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleRegisterImageStart());

    const response = await fetchApi('/registerimage/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleRegisterImageSuccess(response));
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleRegisterImageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleRegisterImageFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditRegisterImage = createAsyncThunk<
  any,
  {
    backgroundImage: string;
    title: string;
    description: string;
  },
  { state: RootState }
>(
  '/addEditRegisterImage',
  async (
    { backgroundImage, title, description },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(addEditRegisterImageStart());

      const formData = new FormData();
      formData.append('backgroundImage', backgroundImage);
      //   formData.append('description', description);
      formData.append('title', title);
      formData.append('description', description);
      //   formData.append('link', link);

      const endpoint = '/registerimage/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditRegisterImageSuccess());
        toast.success(
          response?.isNew
            ? 'Register Image created successfully'
            : 'Register Image updated successfully'
        );

        dispatch(fetchRegisterImage()); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditRegisterImageFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditRegisterImageFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const registerImageSlice = createSlice({
  name: 'registerImage',
  initialState,
  reducers: {
    fetchRegisterImageStart(state) {
      state.registerImageState.loading = true;
      state.registerImageState.error = null;
    },
    addEditRegisterImageStart(state) {
      state.registerImageState.loading = true;
      state.registerImageState.error = null;
    },
    addEditRegisterImageSuccess(state) {
      state.registerImageState.loading = false;
      state.registerImageState.error = null;
    },
    addEditRegisterImageFailure(state, action) {
      state.registerImageState.loading = false;
      state.registerImageState.error = action.payload;
    },
    fetchSingleRegisterImageStart(state) {
      state.registerImageState.loading = true;
      state.registerImageState.error = null;
    },
    fetchSingleRegisterImageSuccess(state, action) {
      state.registerImageState.loading = false;
      state.registerImageState.data = action.payload;
      state.registerImageState.error = null;
    },
    fetchSingleRegisterImageFailure(state, action) {
      state.registerImageState.loading = false;
      state.registerImageState.error = action.payload;
    }
  }
});

export const {
  addEditRegisterImageStart,
  addEditRegisterImageSuccess,
  addEditRegisterImageFailure,
  fetchSingleRegisterImageStart,
  fetchSingleRegisterImageSuccess,
  fetchSingleRegisterImageFailure
} = registerImageSlice.actions;

export default registerImageSlice.reducer;
