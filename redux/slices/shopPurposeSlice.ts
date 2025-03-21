import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the ShopPurposesRootState type to include shopPurposes
export interface ShopPurposesRootState {
  shopPurposes: typeof initialState;
}
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

// Define the IShopPurposes type
export type IShopPurposes = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  sequence?: number;
  product_image?: string;
  image_link?: string;
  active?: boolean;
};

// Initial state
const initialState = {
  shopPurposesListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IShopPurposes[]>,
  singleShopPurposeState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IShopPurposes | null>
};

// Thunks
export const fetchShopPurposesList = createAsyncThunk<
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
  'shopPurposes/fetchShopPurposesList',
  async (input, { dispatch, rejectWithValue }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};
      dispatch(fetchShopPurposesStart());

      const response = await fetchApi(
        `/store/shoppurpose/all?page=${page || 1}&pageSize=${
          pageSize || 5
        }&text=${keyword || ''}&field=${field || ''}&active=${
          active || ''
        }&export=${exportData || false}`,
        { method: 'GET' }
      );
      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchShopPurposesListSuccess({
              data: response.shoppurpose,
              totalCount: response.totalShopPurposesCount
            })
          );
        } else {
          dispatch(fetchShopPurposesExportLoading(false));
        }

        return response;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error: any) {
      dispatch(
        fetchShopPurposesFailure(error?.message || 'Something went wrong')
      );
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

export const addEditShopPurposes = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'shopPurposes/add',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        shopPurpose: {
          singleShopPurposeState: { data }
        }
      } = getState();

      dispatch(addEditShopPurposesStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        title: clonedData.title ? JSON.stringify(clonedData.title) : undefined,
        sequence: clonedData.sequence,
        product_image: clonedData.product_image,
        image_link: clonedData.image_link,
        active: clonedData.active
      };

      // Append only defined fields to FormData
      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/store/shoppurpose/new', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/store/shoppurpose/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }
      if (response?.success) {
        dispatch(addEditShopPurposesSuccess());
        dispatch(fetchShopPurposesList());
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
        dispatch(addEditShopPurposesFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditShopPurposesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleShopPurpose = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'types/getsingletypes',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleShopPurposeStart());
      const response = await fetchApi(`/store/shoppurpose/single/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleShopPurposeSuccess(response?.shoppurpose));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleShopPurposeFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleShopPurposeFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteShopPurpose = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('brand/delete', async (id, { dispatch }) => {
  dispatch(deleteShopPurposeStart());
  try {
    const response = await fetchApi(`/store/shoppurpose/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteShopPurposeSuccess(id));
      dispatch(fetchShopPurposesList());
      toast.success('ShopPurpose deleted successfuly');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteShopPurposeFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteShopPurposeFailure(error.message || 'Failed to delete shopPurpose')
    );
    toast.error(error.message);
  }
});

// Slice
const shopPurposesSlice = createSlice({
  name: 'shopPurposes',
  initialState,
  reducers: {
    setShopPurposesData(state, action) {
      state.singleShopPurposeState.data = action.payload;
    },
    fetchShopPurposesStart(state) {
      state.shopPurposesListState.loading = true;
      state.shopPurposesListState.error = null;
    },
    fetchShopPurposesListSuccess(state, action) {
      const { data, totalCount } = action.payload;
      state.shopPurposesListState.data = data;
      state.shopPurposesListState.pagination.totalCount = totalCount;
      state.shopPurposesListState.loading = false;
    },
    fetchShopPurposesFailure(state, action) {
      state.shopPurposesListState.loading = false;
      state.shopPurposesListState.error = action.payload;
    },
    addEditShopPurposesStart(state) {
      state.singleShopPurposeState.loading = true;
      state.singleShopPurposeState.error = null;
    },
    addEditShopPurposesSuccess(state) {
      state.singleShopPurposeState.loading = false;
    },
    addEditShopPurposesFailure(state, action) {
      state.singleShopPurposeState.loading = false;
      state.singleShopPurposeState.error = action.payload;
    },
    updateShopPurposesData(state, action) {
      const oldData = state.singleShopPurposeState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleShopPurposeState.data = newData;
      } else {
        state.singleShopPurposeState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    fetchSingleShopPurposeStart(state) {
      state.singleShopPurposeState.loading = true;
      state.singleShopPurposeState.error = null;
    },
    fetchSingleShopPurposeSuccess(state, action) {
      state.singleShopPurposeState.loading = false;
      state.singleShopPurposeState.data = action.payload;
      state.singleShopPurposeState.error = null;
    },
    fetchSingleShopPurposeFailure(state, action) {
      state.singleShopPurposeState.loading = false;
      state.singleShopPurposeState.error = action.payload;
    },
    deleteShopPurposeStart(state) {
      state.singleShopPurposeState.loading = true;
      state.singleShopPurposeState.error = null;
    },
    deleteShopPurposeSuccess(state, action) {
      state.singleShopPurposeState.loading = false;
    },
    deleteShopPurposeFailure(state, action) {
      state.singleShopPurposeState.loading = false;
      state.singleShopPurposeState.error = action.payload;
    },
    fetchShopPurposesExportLoading(state, action) {
      state.shopPurposesListState.loading = action.payload;
    }
  }
});

export const {
  fetchShopPurposesStart,
  fetchShopPurposesListSuccess,
  fetchShopPurposesFailure,
  addEditShopPurposesStart,
  fetchShopPurposesExportLoading,
  addEditShopPurposesSuccess,
  setShopPurposesData,
  addEditShopPurposesFailure,
  updateShopPurposesData,
  fetchSingleShopPurposeStart,
  fetchSingleShopPurposeSuccess,
  fetchSingleShopPurposeFailure,
  deleteShopPurposeStart,
  deleteShopPurposeSuccess,
  deleteShopPurposeFailure
} = shopPurposesSlice.actions;

export default shopPurposesSlice.reducer;
