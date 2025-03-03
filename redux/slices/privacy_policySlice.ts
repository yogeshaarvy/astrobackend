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

export const fetchPrivacyPolicy = createAsyncThunk<
  any,
  void,
  { state: RootState }
>(
  'privacyPolicy/fetchDescription',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSinglePrivacyPolicyStart()); // Use a generic start action or create a new one

      const response = await fetchApi('/privacy_policy/get', {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSinglePrivacyPolicySuccess(response?.description)); // Assuming response contains `descriptionData`
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to fetch description';
        dispatch(fetchSinglePrivacyPolicyFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSinglePrivacyPolicyFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditPrivacyPolicy = createAsyncThunk<
  any,
  { description: string; active: boolean },
  { state: RootState }
>(
  'privacyPolicy/addEditDescription',
  async ({ description, active }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(addEditPrivacyPolicyStart()); // Use a generic start action or create a new one

      const formData = new FormData();
      formData.append('description', description);
      formData.append('active', String(active));
      // Single endpoint, but the backend will decide whether to create or update
      const endpoint = '/privacy_policy/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditPrivacyPolicySuccess());
        toast.success(
          response?.isNew
            ? 'Description created successfully'
            : 'Description updated successfully'
        );

        dispatch(fetchPrivacyPolicy()); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditPrivacyPolicyFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditPrivacyPolicyFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const privacy_policySlice = createSlice({
  name: 'privacy_policy',
  initialState,
  reducers: {
    addEditPrivacyPolicyStart(state) {
      state.descriptionState.loading = true;
      state.descriptionState.error = null;
    },
    addEditPrivacyPolicySuccess(state) {
      state.descriptionState.loading = false;
      state.descriptionState.error = null;
    },
    addEditPrivacyPolicyFailure(state, action) {
      state.descriptionState.loading = false;
      state.descriptionState.error = action.payload;
    },
    fetchSinglePrivacyPolicyStart(state) {
      state.descriptionState.loading = true;
      state.descriptionState.error = null;
    },
    fetchSinglePrivacyPolicySuccess(state, action) {
      state.descriptionState.loading = false;
      state.descriptionState.data = action.payload;
      state.descriptionState.error = null;
    },
    fetchSinglePrivacyPolicyFailure(state, action) {
      state.descriptionState.loading = false;
      state.descriptionState.error = action.payload;
    }
  }
});

export const {
  addEditPrivacyPolicyStart,
  addEditPrivacyPolicySuccess,
  addEditPrivacyPolicyFailure,

  fetchSinglePrivacyPolicyStart,
  fetchSinglePrivacyPolicySuccess,
  fetchSinglePrivacyPolicyFailure
} = privacy_policySlice.actions;

export default privacy_policySlice.reducer;
