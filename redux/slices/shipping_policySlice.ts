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

export const fetchShippingPolicy = createAsyncThunk<
  any,
  void,
  { state: RootState }
>(
  'shippingPolicy/fetchDescription',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSingleShippingPolicyStart()); // Use a generic start action or create a new one

      const response = await fetchApi('/shipping_policy/get', {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleShippingPolicySuccess(response?.description)); // Assuming response contains `descriptionData`
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to fetch description';
        dispatch(fetchSingleShippingPolicyFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleShippingPolicyFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditShippingPolicy = createAsyncThunk<
  any,
  { description: string; active: boolean },
  { state: RootState }
>(
  'shippingPolicy/addEditDescription',
  async ({ description, active }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(addEditShippingPolicyStart()); // Use a generic start action or create a new one

      const formData = new FormData();
      formData.append('description', description);
      formData.append('active', String(active));
      // Single endpoint, but the backend will decide whether to create or update
      const endpoint = '/shipping_policy/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditShippingPolicySuccess());
        toast.success(
          response?.isNew
            ? 'Description created successfully'
            : 'Description updated successfully'
        );

        dispatch(fetchShippingPolicy()); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditShippingPolicyFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditShippingPolicyFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const shipping_policySlice = createSlice({
  name: 'shipping policy',
  initialState,
  reducers: {
    fetchShippingPolicyStart(state) {
      state.descriptionState.loading = true;
      state.descriptionState.error = null;
    },

    addEditShippingPolicyStart(state) {
      state.descriptionState.loading = true;
      state.descriptionState.error = null;
    },
    addEditShippingPolicySuccess(state) {
      state.descriptionState.loading = false;
      state.descriptionState.error = null;
    },
    addEditShippingPolicyFailure(state, action) {
      state.descriptionState.loading = false;
      state.descriptionState.error = action.payload;
    },
    fetchSingleShippingPolicyStart(state) {
      state.descriptionState.loading = true;
      state.descriptionState.error = null;
    },
    fetchSingleShippingPolicySuccess(state, action) {
      state.descriptionState.loading = false;
      state.descriptionState.data = action.payload;
      state.descriptionState.error = null;
    },
    fetchSingleShippingPolicyFailure(state, action) {
      state.descriptionState.loading = false;
      state.descriptionState.error = action.payload;
    }
  }
});

export const {
  addEditShippingPolicyStart,
  addEditShippingPolicySuccess,
  addEditShippingPolicyFailure,

  fetchSingleShippingPolicyStart,
  fetchSingleShippingPolicySuccess,
  fetchSingleShippingPolicyFailure
} = shipping_policySlice.actions;

export default shipping_policySlice.reducer;
