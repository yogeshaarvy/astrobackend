import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseState } from '@/types/globals';
import { toast } from 'sonner';

const initialState = {
  homecategoryState: {
    data: '', // Initial description as an empty string
    loading: false, // Represents whether the API call is in progress
    error: null // Stores any errors from API calls
  } as BaseState<string> // The state type is BaseState with a string as the data type
};

export const fetchHomeCategory = createAsyncThunk<
  any,
  void,
  { state: RootState }
>('HomeCategory/fetchDescription', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleHomeCategoryStart()); // Use a generic start action or create a new one

    const response = await fetchApi('/home_categories/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleHomeCategorySuccess(response?.homeCategories)); // Assuming response contains `descriptionData`
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleHomeCategoryFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleHomeCategoryFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});
export const addEditHomeCategory = createAsyncThunk<
  any,
  { title: string; description: string; active: boolean },
  { state: RootState }
>(
  'home_category',
  async ({ title, description, active }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(addEditHomeCategoryStart());

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('active', String(active));

      const endpoint = '/home_categories/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditHomeCategorySuccess(response?.homeCategory));
        toast.success(
          response?.isNew
            ? 'Home category created successfully'
            : 'Home category updated successfully'
        );

        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save home category';
        dispatch(addEditHomeCategoryFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditHomeCategoryFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const home_categorySlice = createSlice({
  name: 'home_category',
  initialState,
  reducers: {
    addEditHomeCategoryStart(state) {
      state.homecategoryState.loading = true;
      state.homecategoryState.error = null;
    },
    addEditHomeCategorySuccess(state, action) {
      state.homecategoryState.loading = false;
      state.homecategoryState.data = action.payload;
      state.homecategoryState.error = null;
    },
    addEditHomeCategoryFailure(state, action) {
      state.homecategoryState.loading = false;
      state.homecategoryState.error = action.payload;
    },
    fetchSingleHomeCategoryStart(state) {
      state.homecategoryState.loading = true;
      state.homecategoryState.error = null;
    },
    fetchSingleHomeCategorySuccess(state, action) {
      state.homecategoryState.loading = false;
      state.homecategoryState.data = action.payload;
      state.homecategoryState.error = null;
    },
    fetchSingleHomeCategoryFailure(state, action) {
      state.homecategoryState.loading = false;
      state.homecategoryState.error = action.payload;
    }
  }
});

export const {
  addEditHomeCategoryStart,
  addEditHomeCategorySuccess,
  addEditHomeCategoryFailure,

  fetchSingleHomeCategoryStart,
  fetchSingleHomeCategorySuccess,
  fetchSingleHomeCategoryFailure
} = home_categorySlice.actions;

export default home_categorySlice.reducer;
