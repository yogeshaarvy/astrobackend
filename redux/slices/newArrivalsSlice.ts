import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseState } from '@/types/globals';
import { toast } from 'sonner';

const initialState = {
  newarrivalsState: {
    data: '', // Initial description as an empty string
    loading: false, // Represents whether the API call is in progress
    error: null // Stores any errors from API calls
  } as BaseState<string> // The state type is BaseState with a string as the data type
};

export const fetchNewArrivals = createAsyncThunk<
  any,
  void,
  { state: RootState }
>('newArrivals/fetch', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleNewArrivalsStart()); // Use a generic start action or create a new one

    const response = await fetchApi('/new_arrival/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleNewArrivalsSuccess(response?.newArrivals)); // Assuming response contains `descriptionData`
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleNewArrivalsFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleNewArrivalsFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});
export const addEditNewArrivals = createAsyncThunk<
  any,
  { title: string; description: string; active: boolean },
  { state: RootState }
>(
  'new_arrival',
  async ({ title, description, active }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(addEditNewArrivalsStart()); // Use a generic start action or create a new one

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('active', String(active));
      // Single endpoint, but the backend will decide whether to create or update
      const endpoint = '/new_arrival/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditNewArrivalsSuccess(response?.newarrivals));
        toast.success(
          response?.isNew
            ? 'New Arrivals created successfully'
            : 'New Arrivals updated successfully'
        );

        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save New Arrivals';
        dispatch(addEditNewArrivalsFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditNewArrivalsFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const new_arrivalSlice = createSlice({
  name: 'new_arrival',
  initialState,
  reducers: {
    addEditNewArrivalsStart(state) {
      state.newarrivalsState.loading = true;
      state.newarrivalsState.error = null;
    },
    addEditNewArrivalsSuccess(state, action) {
      state.newarrivalsState.loading = false;
      state.newarrivalsState.data = action.payload;
      state.newarrivalsState.error = null;
    },
    addEditNewArrivalsFailure(state, action) {
      state.newarrivalsState.loading = false;
      state.newarrivalsState.error = action.payload;
    },
    fetchSingleNewArrivalsStart(state) {
      state.newarrivalsState.loading = true;
      state.newarrivalsState.error = null;
    },
    fetchSingleNewArrivalsSuccess(state, action) {
      state.newarrivalsState.loading = false;
      state.newarrivalsState.data = action.payload;
      state.newarrivalsState.error = null;
    },
    fetchSingleNewArrivalsFailure(state, action) {
      state.newarrivalsState.loading = false;
      state.newarrivalsState.error = action.payload;
    }
  }
});

export const {
  addEditNewArrivalsStart,
  addEditNewArrivalsSuccess,
  addEditNewArrivalsFailure,
  fetchSingleNewArrivalsStart,
  fetchSingleNewArrivalsSuccess,
  fetchSingleNewArrivalsFailure
} = new_arrivalSlice.actions;

export default new_arrivalSlice.reducer;
