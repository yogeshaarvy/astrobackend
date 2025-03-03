import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';

export type ISettings = BaseModel & {
  logo: string;
  favicon: string;
  meta_title: string;
  meta_tag: string;
  meta_description: string;
  copyright: string;
};

const initialState = {
  settingsState: {
    data: {}, // Initial description as an empty string
    loading: false, // Represents whether the API call is in progress
    error: null // Stores any errors from API calls
  } as BaseState<ISettings> // The state type is BaseState with a string as the data type
};

export const fetchSettings = createAsyncThunk<any, void, { state: RootState }>(
  'settings/fetchData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSingleSettingsStart()); // Use a generic start action or create a new one

      const response = await fetchApi('/settings/get', {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleSettingsSuccess(response)); // Assuming response contains `descriptionData`
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to fetch description';
        dispatch(fetchSingleSettingsFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleSettingsFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditSettings = createAsyncThunk<
  any,
  {
    logo: string;
    favicon: string;
    meta_title: string;
    meta_tag: string;
    meta_description: string;
    copyright: string;
  },
  { state: RootState }
>(
  'settings/addEditDescription',
  async (
    { logo, favicon, meta_title, meta_tag, meta_description, copyright },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(addEditSettingsStart()); // Use a generic start action or create a new one
      const formData = new FormData();
      formData.append('logo', logo);
      formData.append('favicon', favicon);
      formData.append('meta_title', meta_title);
      formData.append('meta_tag', meta_tag);
      formData.append('meta_description', meta_description);
      formData.append('copyright', copyright);
      // Single endpoint, but the backend will decide whether to create or update
      const endpoint = '/settings/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditSettingsSuccess());
        toast.success(
          response?.isNew
            ? 'Settings created successfully'
            : 'Settings updated successfully'
        );

        dispatch(fetchSettings()); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditSettingsFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditSettingsFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    fetchTermsConditionsStart(state) {
      state.settingsState.loading = true;
      state.settingsState.error = null;
    },

    addEditSettingsStart(state) {
      state.settingsState.loading = true;
      state.settingsState.error = null;
    },
    addEditSettingsSuccess(state) {
      state.settingsState.loading = false;
      state.settingsState.error = null;
    },
    addEditSettingsFailure(state, action) {
      state.settingsState.loading = false;
      state.settingsState.error = action.payload;
    },
    fetchSingleSettingsStart(state) {
      state.settingsState.loading = true;
      state.settingsState.error = null;
    },
    fetchSingleSettingsSuccess(state, action) {
      state.settingsState.loading = false;
      state.settingsState.data = action.payload;
      state.settingsState.error = null;
    },
    fetchSingleSettingsFailure(state, action) {
      state.settingsState.loading = false;
      state.settingsState.error = action.payload;
    }
  }
});

export const {
  addEditSettingsStart,
  addEditSettingsSuccess,
  addEditSettingsFailure,

  fetchSingleSettingsStart,
  fetchSingleSettingsSuccess,
  fetchSingleSettingsFailure
} = settingsSlice.actions;

export default settingsSlice.reducer;
