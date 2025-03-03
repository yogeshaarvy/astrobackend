import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';

const initialState = {
  descriptionState: {
    data: '', // Initial description as an empty string
    loading: false, // Represents whether the API call is in progress
    error: null // Stores any errors from API calls
  } as BaseState<string> // The state type is BaseState with a string as the data type
};

export const fetchTermsConditions = createAsyncThunk<
  any,
  void,
  { state: RootState }
>(
  'termsConditions/fetchDescription',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSingleTermsConditionsStart()); // Use a generic start action or create a new one

      const response = await fetchApi('/terms_conditions/get', {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleTermsConditionsSuccess(response?.description)); // Assuming response contains `descriptionData`
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to fetch description';
        dispatch(fetchSingleTermsConditionsFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleTermsConditionsFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditTermsConditions = createAsyncThunk<
  any,
  { description: string; active: boolean },
  { state: RootState }
>(
  'termsConditions/addEditDescription',
  async ({ description, active }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(addEditTermsConditionsStart()); // Use a generic start action or create a new one

      const formData = new FormData();
      formData.append('description', description);
      formData.append('active', String(active));
      // Single endpoint, but the backend will decide whether to create or update
      const endpoint = '/terms_conditions/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditTermsConditionsSuccess());
        toast.success(
          response?.isNew
            ? 'Description created successfully'
            : 'Description updated successfully'
        );

        dispatch(fetchTermsConditions()); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditTermsConditionsFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditTermsConditionsFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const terms_conditionsSlice = createSlice({
  name: 'terms_conditions',
  initialState,
  reducers: {
    fetchTermsConditionsStart(state) {
      state.descriptionState.loading = true;
      state.descriptionState.error = null;
    },

    addEditTermsConditionsStart(state) {
      state.descriptionState.loading = true;
      state.descriptionState.error = null;
    },
    addEditTermsConditionsSuccess(state) {
      state.descriptionState.loading = false;
      state.descriptionState.error = null;
    },
    addEditTermsConditionsFailure(state, action) {
      state.descriptionState.loading = false;
      state.descriptionState.error = action.payload;
    },
    fetchSingleTermsConditionsStart(state) {
      state.descriptionState.loading = true;
      state.descriptionState.error = null;
    },
    fetchSingleTermsConditionsSuccess(state, action) {
      state.descriptionState.loading = false;
      state.descriptionState.data = action.payload;
      state.descriptionState.error = null;
    },
    fetchSingleTermsConditionsFailure(state, action) {
      state.descriptionState.loading = false;
      state.descriptionState.error = action.payload;
    }
  }
});

export const {
  addEditTermsConditionsStart,
  addEditTermsConditionsSuccess,
  addEditTermsConditionsFailure,

  fetchSingleTermsConditionsStart,
  fetchSingleTermsConditionsSuccess,
  fetchSingleTermsConditionsFailure
} = terms_conditionsSlice.actions;

export default terms_conditionsSlice.reducer;
