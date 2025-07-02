import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type ISales = BaseModel & {
  images?: {
    leftImage?: string;
    mainImage?: string;
    lowerImage?: string;
    rightImage?: string;
    upperImage?: string;
  };
  titles?: {
    leftTitle?: {
      en?: string;
      hi?: string;
    };
    rightTitle?: {
      en?: string;
      hi?: string;
    };
    upperTitle?: {
      en?: string;
      hi?: string;
    };
    lowerTitle?: {
      en?: string;
      hi?: string;
    };
    mainTitle?: {
      en?: string;
      hi?: string;
    };
  };
  links?: {
    leftLink?: string;
    rightLink?: string;
    upperLink?: string;
    lowerLink?: string;
  };
};

const initialState = {
  salesState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ISales | null>
};

export const fetchSales = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('sales/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleSalesStart()); // Use a generic start action or create a new one

    const response = await fetchApi('/store/sales/get', {
      method: 'GET'
    });

    if (response?.success) {
      dispatch(fetchSingleSalesSuccess(response)); // Assuming response contains `descriptionData`
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleSalesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleSalesFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditSales = createAsyncThunk<any, null, { state: RootState }>(
  'sales/addEditSale',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        sales: {
          salesState: { data }
        }
      } = getState();

      dispatch(addEditSalesStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      const clonedData = cloneDeep(data);

      let imagesALl = {};

      if (clonedData.images) {
        imagesALl = await processNestedFields(clonedData.images || {});

        clonedData.images = imagesALl;
      }

      // Prepare FormData
      const formData = new FormData();
      const reqData: any = {
        images: clonedData.images
          ? JSON.stringify(clonedData.images)
          : undefined,
        titles: clonedData.titles
          ? JSON.stringify(clonedData.titles)
          : undefined,
        links: clonedData.links ? JSON.stringify(clonedData.links) : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response = await fetchApi('/store/sales/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditSalesSuccess());
        dispatch(setSales(null));
        dispatch(fetchSales(null));
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong!';
        dispatch(addEditSalesFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!';
      dispatch(addEditSalesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    fetchSalesStart(state) {
      state.salesState.loading = true;
      state.salesState.error = null;
    },

    addEditSalesStart(state) {
      state.salesState.loading = true;
      state.salesState.error = null;
    },
    addEditSalesSuccess(state) {
      state.salesState.loading = false;
      state.salesState.error = null;
    },
    addEditSalesFailure(state, action) {
      state.salesState.loading = false;
      state.salesState.error = action.payload;
    },
    fetchSingleSalesStart(state) {
      state.salesState.loading = true;
      state.salesState.error = null;
    },
    fetchSingleSalesSuccess(state, action) {
      state.salesState.loading = false;
      state.salesState.data = action.payload.salesData;
      state.salesState.error = null;
    },
    fetchSingleSalesFailure(state, action) {
      state.salesState.loading = false;
      state.salesState.error = action.payload;
    },
    setSales(state, action) {
      state.salesState.data = action.payload;
    },
    updateSalesPage(state, action) {
      const oldData = state.salesState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.salesState.data = newData;
      } else {
        state.salesState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditSalesStart,
  addEditSalesSuccess,
  addEditSalesFailure,
  setSales,
  updateSalesPage,
  fetchSingleSalesStart,
  fetchSingleSalesSuccess,
  fetchSingleSalesFailure
} = salesSlice.actions;

export default salesSlice.reducer;
