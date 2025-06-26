import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';

export type ICalendar = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  mainSection?: {
    bannerImage?: string;
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
  calendarState: {
    data: null,
    loading: false,
    error: null
  } as BaseState<ICalendar | null>
};

export const fetchCalendar = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('calendar/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleCalendarStart());
    const response = await fetchApi('/calendar/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleCalendarSuccess(response));
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch calendar data';
      dispatch(fetchSingleCalendarFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something went wrong';
    dispatch(fetchSingleCalendarFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditCalendar = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'calendar/addEditCalendar',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        calendarConfig: {
          calendarState: { data }
        }
      } = getState();

      dispatch(fetchSingleCalendarStart());

      if (!data) {
        return rejectWithValue('Please provide details');
      }

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        metaTitle: clonedData?.metaTitle ? clonedData.metaTitle : undefined,
        metaDescription: clonedData?.metaDescription
          ? clonedData.metaDescription
          : undefined,
        metaKeywords: clonedData?.metaKeywords
          ? clonedData.metaKeywords
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

      const response = await fetchApi('/calendar/save', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(fetchSingleCalendarSuccess(response));
        toast.success('Calendar updated successfully');
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save calendar';
        dispatch(fetchSingleCalendarFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something went wrong';
      dispatch(fetchSingleCalendarFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    fetchSingleCalendarStart: (state) => {
      state.calendarState.loading = true;
      state.calendarState.error = null;
    },
    fetchSingleCalendarSuccess: (state, action) => {
      state.calendarState.loading = false;
      state.calendarState.data = action.payload.data;
      state.calendarState.error = null;
    },
    fetchSingleCalendarFailure: (state, action) => {
      state.calendarState.loading = false;
      state.calendarState.error = action.payload;
    },
    updateCalendarData: (state, action) => {
      if (state.calendarState.data) {
        state.calendarState.data = {
          ...state.calendarState.data,
          ...action.payload
        };
      }
    },
    clearCalendarError: (state) => {
      state.calendarState.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendar.pending, (state) => {
        state.calendarState.loading = true;
        state.calendarState.error = null;
      })
      .addCase(fetchCalendar.fulfilled, (state, action) => {
        state.calendarState.loading = false;
        state.calendarState.data = action.payload.data;
        state.calendarState.error = null;
      })
      .addCase(fetchCalendar.rejected, (state, action) => {
        state.calendarState.loading = false;
        state.calendarState.error = action.payload as string;
      })
      .addCase(addEditCalendar.pending, (state) => {
        state.calendarState.loading = true;
        state.calendarState.error = null;
      })
      .addCase(addEditCalendar.fulfilled, (state, action) => {
        state.calendarState.loading = false;
        state.calendarState.data = action.payload.data;
        state.calendarState.error = null;
      })
      .addCase(addEditCalendar.rejected, (state, action) => {
        state.calendarState.loading = false;
        state.calendarState.error = action.payload as string;
      });
  }
});

export const {
  fetchSingleCalendarStart,
  fetchSingleCalendarSuccess,
  fetchSingleCalendarFailure,
  updateCalendarData,
  clearCalendarError
} = calendarSlice.actions;

export default calendarSlice.reducer;
