import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Define the SlidersRootState type to include sliders
export interface SlidersRootState {
  sliders: typeof initialState;
}
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { title } from 'process';
import { RootState } from '@/redux/store';

// Define the IHomeAboutList type
export type IAllOrdersList = BaseModel & {
  //   ?: number;
  images?: string;
  product?: any;
  status?: any;
  user?: any;
  addressData?: any;
  totalAmount?: any;
  products?: any;
  orderId?: any;
  createdAt?: any;
  orderStatus?: any;
  paymentMethod?: any;

  transactionId?: any;

  paidAmount?: any;
};

// Initial state
const initialState = {
  AllVibhorOrdersState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IAllOrdersList[]>,
  singleAllOrdersListState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IAllOrdersList | null>,
  currentAllOrdersListState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IAllOrdersList | null>,
  MonthlyOrdersState: {
    data: [],
    loading: false,
    error: null
  }
};

// Thunks
export const fetchAllOrdersList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    exportData?: boolean;
    orderStatus?: string;
    paymentStatus?: string;
    startDate?: string;
    email?: string;
    endDate?: string;
    orderNo?: string;
  },
  { state: RootState }
>(
  'homeaboutlist/fetchAllOrdersList',
  async (input, { dispatch, rejectWithValue }) => {
    try {
      const {
        page = 1,
        pageSize = 10,
        exportData = false,
        orderStatus = 'all',
        paymentStatus = 'all',
        startDate = '',
        endDate = '',
        email = '',
        orderNo = ''
      } = input || {};

      dispatch(fetchAllOrdersListStart());
      const response = await fetchApi(
        `/vibhor_order/all?page=${page}&pageSize=${pageSize}&export=${exportData}&orderStatus=${orderStatus}&paymentStatus=${paymentStatus}&startDate=${startDate}&endDate=${endDate}&email=${
          email ?? ''
        }&orderNo=${orderNo ?? ''}`,
        { method: 'GET' }
      );
      if (response?.success) {
        dispatch(
          fetchAllOrdersListSuccess({
            data: response.vibhorOrders,
            totalCount: response.totalCount
          })
        );
        return response;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error: any) {
      dispatch(
        fetchAllOrdersListFailure(error?.message || 'Something went wrong')
      );
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

export const fetchSingleOrderList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'types/getsingletypes',
  async (orderId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleOrderListStart());
      const response = await fetchApi(
        `/vibhor_order/getsingleorder/${orderId}`,
        {
          method: 'GET'
        }
      );
      console.log('response of single vibhor orders data....', response);

      if (response?.success) {
        dispatch(fetchSingleOrderListSuccess(response?.order));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleOrderListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleOrderListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateOrder = async ({
  orderId,
  transactionId,
  orderStatus
}: {
  orderId: any;
  transactionId: any;
  orderStatus: any;
}) => {
  try {
    const response = await fetchApi(`/vibhor_order/updateorder/${orderId}`, {
      body: { transactionId, orderStatus },
      method: 'PUT'
    });
    if (response?.success) {
      toast.success('Order Updated Successfully!');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      return errorMsg;
    }
  } catch (error: any) {
    let errorMsg = error?.message || 'Something Went Wrong';
    toast.error(errorMsg);
    return errorMsg;
  }
};
//for dashboard
export const fetchMonthlyOrders = createAsyncThunk<{ state: RootState }>(
  'orders/monthly-sales',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchMonthlyOrdersStart());
      const response = await fetchApi(`/vibhor_order/monthly-sales`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(
          fetchMonthlyOrdersSuccess({
            data: response?.monthlyordersdata
          })
        );
        return response;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error: any) {
      dispatch(
        fetchMonthlyOrdersFailure(error?.message || 'Something went wrong')
      );
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);
//create shiprocket order
export const createShiprocketOrder = async (orderId: any) => {
  try {
    const response = await fetchApi(`/vibhor_order/shiprocket-order`, {
      body: { orderId },
      method: 'POST'
    });
    if (response?.success) {
      toast.success('Shiprocket Order Created Successfully!');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      return errorMsg;
    }
  } catch (error: any) {
    let errorMsg = error?.message || 'Something Went Wrong';
    toast.error(errorMsg);
    return errorMsg;
  }
};
// Slice
const vibhorOrdersListSlice = createSlice({
  name: 'all orders',
  initialState,
  reducers: {
    fetchAllOrdersListStart(state) {
      state.AllVibhorOrdersState.loading = true;
      state.AllVibhorOrdersState.error = null;
    },
    fetchAllOrdersListSuccess(state, action) {
      const { data, totalCount } = action.payload;
      state.AllVibhorOrdersState.data = data;
      state.AllVibhorOrdersState.pagination.totalCount = totalCount;
      state.AllVibhorOrdersState.loading = false;
    },
    fetchAllOrdersListFailure(state, action) {
      state.AllVibhorOrdersState.loading = false;
      state.AllVibhorOrdersState.error = action.payload;
    },

    fetchSingleOrderListStart(state) {
      state.singleAllOrdersListState.loading = true;
      state.singleAllOrdersListState.error = null;
    },
    fetchSingleOrderListSuccess(state, action) {
      state.singleAllOrdersListState.loading = false;
      state.singleAllOrdersListState.data = action.payload;
      state.singleAllOrdersListState.error = null;
    },
    fetchSingleOrderListFailure(state, action) {
      state.singleAllOrdersListState.loading = false;
      state.singleAllOrdersListState.error = action.payload;
    },
    fetchMonthlyOrdersStart(state) {
      state.MonthlyOrdersState.loading = true;
      state.MonthlyOrdersState.error = null;
    },
    fetchMonthlyOrdersSuccess(state, action) {
      const { data } = action.payload;
      state.MonthlyOrdersState.data = data;
      state.MonthlyOrdersState.loading = false;
    },
    fetchMonthlyOrdersFailure(state, action) {
      state.MonthlyOrdersState.loading = false;
      state.MonthlyOrdersState.error = action.payload;
    }
  }
});

export const {
  fetchAllOrdersListStart,
  fetchAllOrdersListSuccess,
  fetchAllOrdersListFailure,

  fetchSingleOrderListStart,
  fetchSingleOrderListSuccess,
  fetchSingleOrderListFailure,
  fetchMonthlyOrdersStart,
  fetchMonthlyOrdersSuccess,
  fetchMonthlyOrdersFailure
} = vibhorOrdersListSlice.actions;

export default vibhorOrdersListSlice.reducer;
