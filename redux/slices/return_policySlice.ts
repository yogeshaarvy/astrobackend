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

export const fetchReturnPolicy = createAsyncThunk<
  any,
  void,
  { state: RootState }
>('returnPolicy/fetchDescription', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleReturnPolicyStart()); // Use a generic start action or create a new one

    const response = await fetchApi('/return_policy/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleReturnPolicySuccess(response?.description)); // Assuming response contains `descriptionData`
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleReturnPolicyFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleReturnPolicyFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditReturnPolicy = createAsyncThunk<
  any,
  { description: string; active: boolean },
  { state: RootState }
>(
  'returnPolicy/addEditDescription',
  async ({ description, active }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(addEditReturnPolicyStart()); // Use a generic start action or create a new one

      const formData = new FormData();
      formData.append('description', description);
      formData.append('active', String(active));
      // Single endpoint, but the backend will decide whether to create or update
      const endpoint = '/return_policy/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditReturnPolicySuccess());
        toast.success(
          response?.isNew
            ? 'Description created successfully'
            : 'Description updated successfully'
        );

        dispatch(fetchReturnPolicy()); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditReturnPolicyFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditReturnPolicyFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const return_policySlice = createSlice({
  name: 'return_poilcy',
  initialState,
  reducers: {
    addEditReturnPolicyStart(state) {
      state.descriptionState.loading = true;
      state.descriptionState.error = null;
    },
    addEditReturnPolicySuccess(state) {
      state.descriptionState.loading = false;
      state.descriptionState.error = null;
    },
    addEditReturnPolicyFailure(state, action) {
      state.descriptionState.loading = false;
      state.descriptionState.error = action.payload;
    },
    fetchSingleReturnPolicyStart(state) {
      state.descriptionState.loading = true;
      state.descriptionState.error = null;
    },
    fetchSingleReturnPolicySuccess(state, action) {
      state.descriptionState.loading = false;
      state.descriptionState.data = action.payload;
      state.descriptionState.error = null;
    },
    fetchSingleReturnPolicyFailure(state, action) {
      state.descriptionState.loading = false;
      state.descriptionState.error = action.payload;
    }
  }
});

export const {
  addEditReturnPolicyStart,
  addEditReturnPolicySuccess,
  addEditReturnPolicyFailure,

  fetchSingleReturnPolicyStart,
  fetchSingleReturnPolicySuccess,
  fetchSingleReturnPolicyFailure
} = return_policySlice.actions;

export default return_policySlice.reducer;
