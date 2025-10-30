import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { IAllUsers } from '../allusersSlice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IConsultationsOrdersList = BaseModel & {
  orderId?: string;
  bookedDate?: string;
  bookedTime?: string;
  duration?: string;
  paidAmount?: number;
  talkTime?: string;
  message?: string;
  orderStatus?: 'no started' | 'progress' | 'start' | 'complete' | 'cancel';
  user?: IAllUsers;
  astroId?: IAllUsers;
  paymentStatus?: 'pending' | 'success' | 'falied';
  createdAt?: string;
  transactionId?: string;
  transaction_details?: any;
};

const initialState = {
  consultationOrderList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IConsultationsOrdersList[]>,
  singleConsultationOrderState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IConsultationsOrdersList | null>
};

export const fetchConsultationOrderList = createAsyncThunk<
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
  'orders/fetchConsultationOrderList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};

      dispatch(fetchConsultationOrderListStart());

      const response = await fetchApi(
        `/astrodetails/getbooking/admin?page=${page || 1}&limit=${
          pageSize || 5
        }&field=${field || ''}&text=${keyword || ''}&active=${
          active || ''
        }&exportData=${exportData || false}`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchConsultationOrderListSuccess({
              data: response.astroBooking,
              totalCount: response.totalAstroBookingCount
            })
          );
        } else {
          dispatch(fetchConsultationOrderExportLoading(false));
        }

        return response;
      } else {
        throw new Error('No Status Or Invalid Response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchConsultationOrderListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleConsultationOrderDetails = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'fetch-order/fetchSingleConsultationDetails',
  async (orderId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSingleConsultationOrderStart());
      const response = await fetchApi(
        `/astrodetails/get/booking/order/admin/single/${orderId}`,
        {
          method: 'GET'
        }
      );
      if (response?.success) {
        dispatch(fetchSingleConsultationOrderSuccess(response?.order));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleConsultationOrderFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleConsultationOrderFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

const consultationOrderSlice = createSlice({
  name: 'consultationOrder',
  initialState,
  reducers: {
    setConsultationOrderListData(state, action) {
      state.singleConsultationOrderState.data = action.payload;
    },
    updateConsultationOrderListData(state, action) {
      const oldData = state.singleConsultationOrderState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleConsultationOrderState.data = newData;
      } else {
        state.singleConsultationOrderState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    fetchConsultationOrderListStart(state) {
      state.consultationOrderList.loading = true;
      state.consultationOrderList.error = null;
    },
    fetchConsultationOrderListSuccess(state, action) {
      state.consultationOrderList.loading = false;
      const { data, totalCount } = action.payload;
      state.consultationOrderList.data = data;
      state.consultationOrderList.pagination.totalCount = totalCount;
      state.consultationOrderList.error = null;
    },
    fetchConsultationOrderListFailure(state, action) {
      state.consultationOrderList.loading = false;
      state.consultationOrderList.error = action.payload;
    },
    fetchSingleConsultationOrderStart(state) {
      state.singleConsultationOrderState.loading = true;
      state.singleConsultationOrderState.error = null;
    },
    fetchSingleConsultationOrderFailure(state, action) {
      state.singleConsultationOrderState.loading = false;
      state.singleConsultationOrderState.data = action.payload;
    },
    fetchSingleConsultationOrderSuccess(state, action) {
      state.singleConsultationOrderState.loading = false;
      state.singleConsultationOrderState.data = action.payload;
      state.singleConsultationOrderState.error = null;
    },
    fetchConsultationOrderExportLoading(state, action) {
      state.consultationOrderList.loading = action.payload;
    }
  }
});

export const {
  setConsultationOrderListData,
  fetchConsultationOrderExportLoading,
  fetchConsultationOrderListFailure,
  fetchConsultationOrderListStart,
  fetchConsultationOrderListSuccess,
  fetchSingleConsultationOrderFailure,
  fetchSingleConsultationOrderStart,
  fetchSingleConsultationOrderSuccess,
  updateConsultationOrderListData
} = consultationOrderSlice.actions;

export default consultationOrderSlice.reducer;
