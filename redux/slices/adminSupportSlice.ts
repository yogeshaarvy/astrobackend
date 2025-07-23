import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the SlidersRootState type to include sliders
export interface SlidersRootState {
  sliders: typeof initialState;
}
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';

// Define the IHomeAboutList type
export type IAdminSupport = BaseModel & {
  sequence?: number;
  thumbnail_image?: string;
  main_image?: string;
  heading?: string;
  slug?: string;
  short_description?: string;
  long_description?: string;
  status?: boolean;
};

// Initial state
const initialState = {
  AdminSupportState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0,
      inprocessCount: 0,
      closedCount: 0,
      openCount: 0
    }
  } as any,
  singleAdminSupportState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IAdminSupport | null>,
  currentAdminSupportState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IAdminSupport | null>
};

// Thunks
export const fetchAdminSupportTickets = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field?: string;
    status?: string;
    exportData?: boolean;
  },
  { state: RootState }
>('/fetchAdminSupport', async (input, { dispatch, rejectWithValue }) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      keyword = '',
      field = '',
      status = '',
      exportData = false
    } = input || {};
    dispatch(fetchAdminSupportStart());
    const response = await fetchApi(
      `/adminsupport/get?page=${page}&pageSize=${pageSize}&text=${keyword}&field=${field}&status=${status}&export=${exportData}`,
      { method: 'GET' }
    );
    console.log('response of tickets is ', response);
    if (response?.success) {
      dispatch(
        fetchAdminSupportSuccess({
          data: response.adminSupportData,
          totalCount: response.totalCount,
          closedCount: response.closedCount,
          inprocessCount: response.inprocessCount,
          openCount: response.openCount
        })
      );
      return response;
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error: any) {
    dispatch(
      fetchAdminSupportFailure(error?.message || 'Something went wrong')
    );
    return rejectWithValue(error?.message || 'Something went wrong');
  }
});

export const editTicktStatus = createAsyncThunk<
  any,
  { status?: string; entityId?: string | null },
  { state: RootState }
>(
  'updateTicketStatus',
  async ({ status, entityId }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(addEditAdminSupportStart());
      console.log('Updating ticket status:', status, 'for entityId:', entityId);

      let response = await fetchApi(`/adminsupport/update/${entityId}`, {
        method: 'PUT',
        body: { status }
      });

      if (response?.success) {
        dispatch(addEditAdminSupportSuccess());
        dispatch(fetchAdminSupportTickets({})); // Refresh list after adding/editing
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something went wrong!';
        dispatch(addEditAdminSupportFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something went wrong!';
      dispatch(addEditAdminSupportFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const fetchSingleTicket = createAsyncThunk<
  any,
  { ticketId: string },
  { state: RootState }
>('/fetchAdminSupport', async (input, { dispatch, rejectWithValue }) => {
  try {
    const { ticketId } = input;
    console.log('Fetching single ticket with ID:', ticketId);
    dispatch(fetchSingleTicketStart());
    const response = await fetchApi(`/adminsupport/single/${ticketId}`, {
      method: 'GET'
    });
    console.log('response of tickets is ', response);
    if (response?.success) {
      dispatch(
        fetchSingleTicketSuccess({
          data: response.ticketData
        })
      );
      return response;
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error: any) {
    dispatch(
      fetchSingleTicketFailure(error?.message || 'Something went wrong')
    );
    return rejectWithValue(error?.message || 'Something went wrong');
  }
});

// Slice
const adminSupportSlice = createSlice({
  name: 'adminsupport',
  initialState,
  reducers: {
    fetchAdminSupportStart(state) {
      state.AdminSupportState.loading = true;
      state.AdminSupportState.error = null;
    },
    fetchAdminSupportSuccess(state, action) {
      const { data, totalCount, inprocessCount, closedCount, openCount } =
        action.payload;
      state.AdminSupportState.data = data;
      state.AdminSupportState.pagination.totalCount = totalCount;
      state.AdminSupportState.pagination.openCount = openCount;
      state.AdminSupportState.pagination.inprocessCount = inprocessCount;
      state.AdminSupportState.pagination.closedCount = closedCount;
      state.AdminSupportState.loading = false;
    },
    fetchAdminSupportFailure(state, action) {
      state.AdminSupportState.loading = false;
      state.AdminSupportState.error = action.payload;
    },
    fetchSingleTicketStart(state) {
      state.singleAdminSupportState.loading = true;
      state.singleAdminSupportState.error = null;
    },
    fetchSingleTicketSuccess(state, action) {
      const { data } = action.payload;
      state.singleAdminSupportState.data = data;
      state.singleAdminSupportState.loading = false;
    },
    fetchSingleTicketFailure(state, action) {
      state.singleAdminSupportState.loading = false;
      state.singleAdminSupportState.error = action.payload;
    },
    addEditAdminSupportStart(state) {
      state.singleAdminSupportState.loading = true;
      state.singleAdminSupportState.error = null;
    },
    addEditAdminSupportSuccess(state) {
      state.singleAdminSupportState.loading = false;
    },
    addEditAdminSupportFailure(state, action) {
      state.singleAdminSupportState.loading = false;
      state.singleAdminSupportState.error = action.payload;
    },
    updateHomeAboutListData(state, action) {
      const oldData = state.singleAdminSupportState.data;
      state.singleAdminSupportState.data = { ...oldData, ...action.payload };
    },
    fetchSingleHomeAboutListStart(state) {
      state.singleAdminSupportState.loading = true;
      state.singleAdminSupportState.error = null;
    },
    fetchSingleHomeAboutListSuccess(state, action) {
      state.singleAdminSupportState.loading = false;
      state.singleAdminSupportState.data = action.payload;
      state.singleAdminSupportState.error = null;
    },
    fetchSingleHomeAboutListFailure(state, action) {
      state.singleAdminSupportState.loading = false;
      state.singleAdminSupportState.error = action.payload;
    }
  }
});

export const {
  fetchAdminSupportStart,
  fetchAdminSupportSuccess,
  fetchAdminSupportFailure,
  fetchSingleTicketStart,
  fetchSingleTicketSuccess,
  fetchSingleTicketFailure,
  addEditAdminSupportStart,
  addEditAdminSupportSuccess,
  addEditAdminSupportFailure,
  updateHomeAboutListData,
  fetchSingleHomeAboutListStart,
  fetchSingleHomeAboutListSuccess,
  fetchSingleHomeAboutListFailure
} = adminSupportSlice.actions;

export default adminSupportSlice.reducer;
