import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IFeedbackConfig = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  mainSection?: {
    bannerImage?: {
      en?: string;
      hi?: string;
    };
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    textAlignment?: string;
    textColor?: string;
  };
};

const initialState = {
  feedbackConfigState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IFeedbackConfig | null>
};

export const fetchFeedbackConfig = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleFeedbackConfigStart());

    const response = await fetchApi('/feedback/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleFeedbackConfigSuccess(response?.feedbackConfig));

      console.log('fecthaboutFeedbackConfig', response);
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleFeedbackConfigFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleFeedbackConfigFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditFeedbackConfig = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditFeedbackConfig',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        feedbackConfig: {
          feedbackConfigState: { data }
        }
      } = getState();

      dispatch(addEditFeedbackConfigStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      console.log('The data value in the slice is:', data);

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        metaTitle: clonedData.metaTitle ? clonedData.metaTitle : undefined,
        metaDescription: clonedData.metaDescription
          ? clonedData.metaDescription
          : undefined,
        metaKeyword: clonedData.metaKeyword
          ? clonedData.metaKeyword
          : undefined,
        mainSection: clonedData.mainSection
          ? JSON.stringify(clonedData.mainSection)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/feedback/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditFeedbackConfigSuccess());
        dispatch(setFeedbackConfig(null));
        dispatch(fetchFeedbackConfig(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditFeedbackConfigFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditFeedbackConfigFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const feedbackConfigSlice = createSlice({
  name: 'feedbackConfig',
  initialState,
  reducers: {
    fetchFeedbackConfigStart(state) {
      state.feedbackConfigState.loading = true;
      state.feedbackConfigState.error = null;
    },
    addEditFeedbackConfigStart(state) {
      state.feedbackConfigState.loading = true;
      state.feedbackConfigState.error = null;
    },
    addEditFeedbackConfigSuccess(state) {
      state.feedbackConfigState.loading = false;
      state.feedbackConfigState.error = null;
    },
    setFeedbackConfig(state, action) {
      state.feedbackConfigState.data = action.payload;
    },
    addEditFeedbackConfigFailure(state, action) {
      state.feedbackConfigState.loading = false;
      state.feedbackConfigState.error = action.payload;
    },
    fetchSingleFeedbackConfigStart(state) {
      state.feedbackConfigState.loading = true;
      state.feedbackConfigState.error = null;
    },
    fetchSingleFeedbackConfigSuccess(state, action) {
      state.feedbackConfigState.loading = false;
      state.feedbackConfigState.data = action.payload;
      state.feedbackConfigState.error = null;
    },
    fetchSingleFeedbackConfigFailure(state, action) {
      state.feedbackConfigState.loading = false;
      state.feedbackConfigState.error = action.payload;
    },
    updateFeedbackConfig(state, action) {
      const oldData = state.feedbackConfigState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.feedbackConfigState.data = newData;
      } else {
        state.feedbackConfigState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditFeedbackConfigStart,
  addEditFeedbackConfigSuccess,
  addEditFeedbackConfigFailure,
  setFeedbackConfig,
  updateFeedbackConfig,
  fetchSingleFeedbackConfigStart,
  fetchSingleFeedbackConfigSuccess,
  fetchSingleFeedbackConfigFailure
} = feedbackConfigSlice.actions;

export default feedbackConfigSlice.reducer;
