import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type ICalendarConfig = BaseModel & {
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
  calendarConfigState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ICalendarConfig | null>
};

export const fetchCalendarConfig = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleCalendarConfigStart());

    const response = await fetchApi('/calendar/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleCalendarConfigSuccess(response?.calendarConfig));

      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleCalendarConfigFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleCalendarConfigFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditCalendarConfig = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditCalendarConfig',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        calendarConfig: {
          calendarConfigState: { data }
        }
      } = getState();

      dispatch(addEditCalendarConfigStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

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

      const response = await fetchApi('/calendar/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditCalendarConfigSuccess());
        dispatch(setCalendarConfig(null));
        dispatch(fetchCalendarConfig(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditCalendarConfigFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditCalendarConfigFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const calendarConfigSlice = createSlice({
  name: 'calendarConfig',
  initialState,
  reducers: {
    fetchCalendarConfigStart(state) {
      state.calendarConfigState.loading = true;
      state.calendarConfigState.error = null;
    },
    addEditCalendarConfigStart(state) {
      state.calendarConfigState.loading = true;
      state.calendarConfigState.error = null;
    },
    addEditCalendarConfigSuccess(state) {
      state.calendarConfigState.loading = false;
      state.calendarConfigState.error = null;
    },
    setCalendarConfig(state, action) {
      state.calendarConfigState.data = action.payload;
    },
    addEditCalendarConfigFailure(state, action) {
      state.calendarConfigState.loading = false;
      state.calendarConfigState.error = action.payload;
    },
    fetchSingleCalendarConfigStart(state) {
      state.calendarConfigState.loading = true;
      state.calendarConfigState.error = null;
    },
    fetchSingleCalendarConfigSuccess(state, action) {
      state.calendarConfigState.loading = false;
      state.calendarConfigState.data = action.payload;
      state.calendarConfigState.error = null;
    },
    fetchSingleCalendarConfigFailure(state, action) {
      state.calendarConfigState.loading = false;
      state.calendarConfigState.error = action.payload;
    },
    updateCalendarConfig(state, action) {
      const oldData = state.calendarConfigState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.calendarConfigState.data = newData;
      } else {
        state.calendarConfigState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditCalendarConfigStart,
  addEditCalendarConfigSuccess,
  addEditCalendarConfigFailure,
  setCalendarConfig,
  updateCalendarConfig,
  fetchSingleCalendarConfigStart,
  fetchSingleCalendarConfigSuccess,
  fetchSingleCalendarConfigFailure
} = calendarConfigSlice.actions;

export default calendarConfigSlice.reducer;
