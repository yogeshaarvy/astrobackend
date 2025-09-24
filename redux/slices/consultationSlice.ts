import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IConsultationConfig = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  mainSection?: {
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    short_description?: {
      en?: string;
      hi?: string;
    };
    bannerImage?: {
      en?: string;
      hi?: string;
    };
  };
};

const initialState = {
  consultationConfigState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IConsultationConfig | null>
};

export const fetchConsultationConfig = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleConsultationConfigStart());

    const response = await fetchApi('/consultation/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(
        fetchSingleConsultationConfigSuccess(response?.consultationConfig)
      );

      console.log('fecthaboutConsultationConfig', response);
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleConsultationConfigFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleConsultationConfigFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditConsultationConfig = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditConsultationConfig',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        consultationConfig: {
          consultationConfigState: { data }
        }
      } = getState();

      dispatch(addEditConsultationConfigStart());

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

      const response = await fetchApi('/consultation/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditConsultationConfigSuccess());
        dispatch(setConsultationConfig(null));
        dispatch(fetchConsultationConfig(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditConsultationConfigFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditConsultationConfigFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const consultationConfigSlice = createSlice({
  name: 'consultationConfig',
  initialState,
  reducers: {
    fetchConsultationConfigStart(state) {
      state.consultationConfigState.loading = true;
      state.consultationConfigState.error = null;
    },
    addEditConsultationConfigStart(state) {
      state.consultationConfigState.loading = true;
      state.consultationConfigState.error = null;
    },
    addEditConsultationConfigSuccess(state) {
      state.consultationConfigState.loading = false;
      state.consultationConfigState.error = null;
    },
    setConsultationConfig(state, action) {
      state.consultationConfigState.data = action.payload;
    },
    addEditConsultationConfigFailure(state, action) {
      state.consultationConfigState.loading = false;
      state.consultationConfigState.error = action.payload;
    },
    fetchSingleConsultationConfigStart(state) {
      state.consultationConfigState.loading = true;
      state.consultationConfigState.error = null;
    },
    fetchSingleConsultationConfigSuccess(state, action) {
      state.consultationConfigState.loading = false;
      state.consultationConfigState.data = action.payload;
      state.consultationConfigState.error = null;
    },
    fetchSingleConsultationConfigFailure(state, action) {
      state.consultationConfigState.loading = false;
      state.consultationConfigState.error = action.payload;
    },
    updateConsultationConfig(state, action) {
      const oldData = state.consultationConfigState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.consultationConfigState.data = newData;
      } else {
        state.consultationConfigState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditConsultationConfigStart,
  addEditConsultationConfigSuccess,
  addEditConsultationConfigFailure,
  setConsultationConfig,
  updateConsultationConfig,
  fetchSingleConsultationConfigStart,
  fetchSingleConsultationConfigSuccess,
  fetchSingleConsultationConfigFailure
} = consultationConfigSlice.actions;

export default consultationConfigSlice.reducer;
