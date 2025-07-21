import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type ITax = BaseModel & {
  _id?: string;
  name?: {
    en?: string;
    hi?: string;
  };
  rate?: string;
  active?: boolean;
};

const initialState = {
  taxListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<ITax[]>,
  singleTaxState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ITax | null>
};

export const addEditTax = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'taxes/addEditTax',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        taxsdata: {
          singleTaxState: { data }
        }
      } = getState();

      dispatch(addEditTaxStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        name: clonedData.name ? JSON.stringify(clonedData.name) : undefined,
        rate: clonedData.rate,
        active: clonedData.active
      };
      console.log('this is the tags form', formData);

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/store/taxs/new', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/store/taxs/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditTaxSuccess());
        dispatch(fetchTaxList());
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditTaxFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditTaxFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchTaxList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field?: string;
    active?: string;
  } | void,
  { state: RootState }
>(
  'taxes/fetchTaxList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active } = input || {};
      dispatch(fetchTaxListStart());
      console.log('this is the input');
      const response = await fetchApi(
        `/store/taxs/all?page=${page || 1}&limit=${pageSize || 10}&field=${
          field || ''
        }&text=${keyword || ''}&active=${active || ''}`,
        { method: 'GET' }
      );
      console.log('respone of tax is', response);
      if (response?.success) {
        dispatch(
          fetchTaxListSuccess({
            data: response.TaxsData,
            totalCount: response.totalTaxCount
          })
        );
        return response;
      } else {
        throw new Error('No Status Or Invalid Response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchTaxListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleTax = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'taxes/fetchSingleTax',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleTaxStart());
      const response = await fetchApi(`/store/taxs/single/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleTaxSuccess(response?.tax));

        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchSingleTaxFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleTaxFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteTax = createAsyncThunk<any, string, { state: RootState }>(
  'taxes/deleteTax',
  async (id, { dispatch }) => {
    dispatch(deleteTaxStart());
    try {
      const response = await fetchApi(`/store/taxs/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        dispatch(deleteTaxSuccess(id));
        dispatch(fetchTaxList());
        toast.success('Tax deleted successfully');
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        toast.error(errorMsg);
        dispatch(deleteTaxFailure(errorMsg));
      }
    } catch (error: any) {
      dispatch(deleteTaxFailure(error.message || 'Failed to delete tax'));
      toast.error(error.message);
    }
  }
);

const taxSlice = createSlice({
  name: 'taxs',
  initialState,
  reducers: {
    setTaxData(state, action) {
      state.singleTaxState.data = action.payload;
    },
    updateTaxData(state, action) {
      const oldData = state.singleTaxState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleTaxState.data = newData;
      } else {
        state.singleTaxState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditTaxStart(state) {
      state.singleTaxState.loading = true;
      state.singleTaxState.error = null;
    },
    addEditTaxSuccess(state) {
      state.singleTaxState.loading = false;
      state.singleTaxState.error = null;
    },
    addEditTaxFailure(state, action) {
      state.singleTaxState.loading = false;
      state.singleTaxState.error = action.payload;
    },
    fetchTaxListStart(state) {
      state.taxListState.loading = true;
      state.taxListState.error = null;
    },
    fetchTaxListSuccess(state, action) {
      state.taxListState.loading = false;
      const { data, totalCount } = action.payload;
      state.taxListState.data = data;
      state.taxListState.pagination.totalCount = totalCount;
      state.taxListState.error = null;
    },
    fetchTaxListFailure(state, action) {
      state.taxListState.loading = false;
      state.taxListState.error = action.payload;
    },
    fetchSingleTaxStart(state) {
      state.singleTaxState.loading = true;
      state.singleTaxState.error = null;
    },
    fetchSingleTaxFailure(state, action) {
      state.singleTaxState.loading = false;
      state.singleTaxState.error = action.payload;
    },
    fetchSingleTaxSuccess(state, action) {
      state.singleTaxState.loading = false;
      state.singleTaxState.data = action.payload;
      state.singleTaxState.error = null;
    },
    deleteTaxStart(state) {
      state.taxListState.loading = true;
      state.taxListState.error = null;
    },
    deleteTaxSuccess(state, action) {
      state.taxListState.loading = false;
    },
    deleteTaxFailure(state, action) {
      state.taxListState.loading = false;
      state.taxListState.error = action.payload;
    },
    fetchTaxExportLoading(state, action) {
      state.taxListState.loading = action.payload;
    }
  }
});

export const {
  setTaxData,
  fetchTaxExportLoading,
  fetchTaxListFailure,
  fetchTaxListStart,
  fetchTaxListSuccess,
  fetchSingleTaxFailure,
  fetchSingleTaxStart,
  fetchSingleTaxSuccess,
  addEditTaxFailure,
  addEditTaxStart,
  addEditTaxSuccess,
  deleteTaxStart,
  deleteTaxSuccess,
  updateTaxData,
  deleteTaxFailure
} = taxSlice.actions;

export default taxSlice.reducer;
