import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { title } from 'process';
import { fetchApi } from '@/services/utlis/fetchApi';

export type IEvent = BaseModel & {
  _id?: string;
  title?: string;
  status?: string;
  shortdescription?: string;
  eventType?: string;
  start_Date?: string;
  end_Date?: string;
  createdAt?: string;
  isPaid?: string;
  image?: File[];
  eventSchedule?: string;
};

export type IEventUser = BaseModel & {
  _id?: string;
  name?: string;
  email?: string;
  address?: string;
  phoneNo?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  panNo?: string;
  amount?: Number;
  dob?: Date;
  gender?: string;
};

const initialState = {
  eventListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IEvent[]>,
  singleEventState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IEvent | null>,
  currentEventState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IEvent | null>
};

export const fetchEventList = createAsyncThunk<
  any,
  { page?: number; pageSize?: number; department?: string } | void,
  { state: RootState }
>(
  'event/fetchEventList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize } = input || {};
      dispatch(fetchEventStart());
      const response = await fetchApi(`/events/all`, { method: 'GET' });

      if (response?.success) {
        dispatch(
          fetchEventListSuccess({
            data: response.event,
            totalCount: response.totalCount
          })
        );
      } else {
        throw new Error('No status or invalid response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchEventFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditEvent = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('event/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      event: {
        singleEventState: { data }
      }
    } = getState();

    dispatch(addEditEventStart());


    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    const formData = new FormData();

    const reqData: any = {
      title: data.title,
      shortdescription: data.shortdescription,
      start_Date: data.start_Date,
      eventType: data.eventType,
      end_Date: data.end_Date,
      isPaid: data.isPaid,
      eventSchedule: data.eventSchedule,
      image: data.image
    };


    // Iterate through reqData and append each key-value pair to formData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && Array.isArray(value)) {
          // If the key is 'image' and the value is an array, append each file
          value.forEach((file: File) => {
            formData.append(`banner_image`, file); // Use indexed keys if multiple images
          });
        } else {
          // Append other values as strings
          formData.append(key, value as string | Blob);
        }
      }
    });

    let response;

    if (!entityId) {
      response = await fetchApi('/event/create', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/event/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }

    if (response?.success) {
      dispatch(addEditEventSuccess());
      dispatch(fetchEventList());
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something went worng!!';
      dispatch(addEditEventFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditEventFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    fetchEventStart(state) {
      state.eventListState.loading = true;
      state.eventListState.error = null;
    },
    fetchEventListSuccess(state, action) {
      state.eventListState.loading = false;
      const { data, totalCount } = action.payload;
      state.eventListState.data = data;
      state.eventListState.pagination.totalCount = totalCount;
      state.eventListState.error = null;
    },
    fetchEventFailure(state, action) {
      (state.eventListState.loading = false),
        (state.eventListState.error = action.payload);
    },
    setEventData(state, action) {
      state.singleEventState.data = action.payload;
    },
    updateEventData(state, action) {
      const oldData = state.singleEventState.data;
      state.singleEventState.data = { ...oldData, ...action.payload };
    },
    addEditEventStart(state) {
      state.singleEventState.loading = true;
      state.singleEventState.error = null;
    },
    addEditEventSuccess(state) {
      state.singleEventState.loading = false;
      state.singleEventState.error = null;
    },
    addEditEventFailure(state, action) {
      state.singleEventState.loading = false;
      state.singleEventState.error = action.payload;
    }
  }
});

export const {
  fetchEventStart,
  fetchEventListSuccess,
  fetchEventFailure,
  updateEventData,
  addEditEventFailure,
  addEditEventStart,
  addEditEventSuccess
} = eventSlice.actions;

export default eventSlice.reducer;
