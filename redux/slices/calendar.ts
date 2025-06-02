import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type ICalendar = BaseModel & {
  name?: string;
  sequence?: number;
  startDateTime?: string;
  endDateTime?: string;
  content?: {
    title: {
      en?: string;
      hi?: string;
    };
    shortDescription?: {
      en?: string;
      hi?: string;
    };
  };
  active?: boolean;
};

const initialState = {
  eventCalendarList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<ICalendar[]>,
  singleCalendarState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ICalendar | null>,
  userCalendarState: {
    data: [],
    loading: false,
    error: null
  } as BaseState<ICalendar[]>
};

export const addEditEventCalendarList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'calendar/addEditList',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        calendar: {
          singleCalendarState: { data }
        }
      } = getState();

      dispatch(addEditEventCalendarListStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      const formData = new FormData();
      const reqData: any = {
        name: data.name,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        active: data.active,
        content: data.content ? JSON.stringify(data.content) : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/calendar/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/calendar/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditEventCalendarListSuccess());
        dispatch(fetchEventCalendarList());
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditEventCalendarListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditEventCalendarListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchEventCalendarList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field?: string;
    active?: string;
    exportData?: boolean;
  } | void,
  { state: RootState }
>(
  'calendar/fetchEventUpcomingList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};

      dispatch(fetchEventCalendarListStart());
      const response = await fetchApi(
        `/calendar/all?page=${page || 1}&limit=${pageSize || 5}&field=${
          field || ''
        }&text=${keyword || ''}&active=${active || ''}&exportData=${
          exportData || false
        }`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchEventCalendarListSuccess({
              data: response.calenderList,
              totalCount: response.totalCalenders
            })
          );
        } else {
          dispatch(fetchEventCalendarExportLoading(false));
        }
        return response;
      } else {
        throw new Error('No status or invalid response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchEventCalendarListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleEventCalendarList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'calender-event/fetchSingleSliderEvent',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleEventCalendarListStart());
      const response = await fetchApi(`/calendar/get/single/${entityId}`, {
        method: 'GET'
      });

      if (response?.success) {
        dispatch(fetchSingleEventCalendarListSuccess(response.calenderData));
        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchSingleEventCalendarListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleEventCalendarListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const fetchUserCalendar = createAsyncThunk<
  any,
  { selectedLanguage?: string } | void,
  { state: RootState }
>(
  'calender/fetchUserCalendar',
  async (input, { dispatch, rejectWithValue }) => {
    try {
      const { selectedLanguage } = input || {};

      dispatch(fetchUserCalendarStart());

      const response = await fetchApi(
        `/calendar/get/user?selectedLanguage=${selectedLanguage || 'en'}`,
        { method: 'GET' }
      );

      if (response?.success) {
        dispatch(fetchUserCalendarSuccess(response.calenderData));
        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchUserCalendarFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchUserCalendarFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

const eventCalendarSlice = createSlice({
  name: 'eventUpcomingProgram',
  initialState,
  reducers: {
    setEventCalendarListData(state, action) {
      state.singleCalendarState.data = action.payload;
    },
    updateEventCalendarListData(state, action) {
      const oldData = state.singleCalendarState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleCalendarState.data = newData;
      } else {
        state.singleCalendarState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditEventCalendarListStart(state) {
      state.singleCalendarState.loading = true;
      state.singleCalendarState.error = null;
    },
    addEditEventCalendarListSuccess(state) {
      state.singleCalendarState.loading = false;
      state.singleCalendarState.error = null;
    },
    addEditEventCalendarListFailure(state, action) {
      state.singleCalendarState.loading = false;
      state.singleCalendarState.error = action.payload;
    },
    fetchEventCalendarListStart(state) {
      state.eventCalendarList.loading = true;
      state.eventCalendarList.error = null;
    },
    fetchEventCalendarListSuccess(state, action) {
      state.eventCalendarList.loading = false;
      const { data, totalCount } = action.payload;
      state.eventCalendarList.data = data;
      state.eventCalendarList.pagination.totalCount = totalCount;
      state.eventCalendarList.error = null;
    },
    fetchEventCalendarListFailure(state, action) {
      state.eventCalendarList.loading = false;
      state.eventCalendarList.error = action.payload;
    },
    fetchSingleEventCalendarListStart(state) {
      state.singleCalendarState.loading = true;
      state.singleCalendarState.error = null;
    },
    fetchSingleEventCalendarListSuccess(state, action) {
      state.singleCalendarState.loading = false;
      state.singleCalendarState.data = action.payload;
      state.singleCalendarState.error = null;
    },
    fetchSingleEventCalendarListFailure(state, action) {
      state.singleCalendarState.loading = false;
      state.singleCalendarState.error = action.payload;
    },
    fetchUserCalendarStart(state) {
      state.userCalendarState.loading = true;
      state.userCalendarState.error = null;
    },
    fetchUserCalendarSuccess(state, action) {
      state.userCalendarState.loading = false;
      state.userCalendarState.data = action.payload;
      state.userCalendarState.error = null;
    },
    fetchUserCalendarFailure(state, action) {
      state.userCalendarState.loading = false;
      state.userCalendarState.error = action.payload;
    },
    fetchEventCalendarExportLoading(state, action) {
      state.eventCalendarList.loading = action.payload;
    }
  }
});

export const {
  addEditEventCalendarListStart,
  addEditEventCalendarListFailure,
  addEditEventCalendarListSuccess,
  setEventCalendarListData,
  updateEventCalendarListData,
  fetchEventCalendarListFailure,
  fetchEventCalendarListSuccess,
  fetchEventCalendarListStart,
  fetchEventCalendarExportLoading,
  fetchSingleEventCalendarListStart,
  fetchSingleEventCalendarListFailure,
  fetchSingleEventCalendarListSuccess,
  fetchUserCalendarStart,
  fetchUserCalendarSuccess,
  fetchUserCalendarFailure
} = eventCalendarSlice.actions;

export default eventCalendarSlice.reducer;
