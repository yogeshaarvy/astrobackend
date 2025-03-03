import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';

export type IValues = BaseModel & {
  _id?: string;
  short_name?: string;
  full_name?: string;
  active?: boolean;
  types?: any;
  sequence?: number;
};

const initialState = {
  valuesListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IValues[]>,
  singleValuesState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IValues | null>,
  currentValuesState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IValues | null>,
  changeValuesPassword: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IValues | null>
};

export const fetchValuesList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field: string;
    status: string;
    exportData: string;
    filterByTypes: any;
  } | void,
  { state: RootState }
>(
  'values/fetchValuesList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        page,
        pageSize,
        keyword,
        field,
        status,
        exportData,
        filterByTypes
      } = input || {};
      dispatch(fetchValuesStart());
      const response = await fetchApi(
        `/filtervalues/all?page=${page || 1}&limit=${pageSize || 10}&text=${
          keyword || ''
        }&field=${field || ''}&active=${status || ''}&export=${
          exportData || ''
        }&filterByTypes=${filterByTypes || ''}`,
        { method: 'GET' }
      );

      // Check if the API response is valid and has the expected data
      if (response?.success) {
        dispatch(
          fetchValuesListSuccess({
            data: response.filterValuesdata,
            totalCount: response.totalCount
          })
        );
      } else {
        // Handle response with no status or an error
        throw new Error('No status or invalid response');
      }
      return response;
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchValuesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const addEditValues = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('values/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      filtervalues: {
        singleValuesState: { data }
      }
    } = getState();

    dispatch(addEditValuesStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }
    const formData = new FormData();
    const reqData: any = {
      short_name: data.short_name,
      full_name: data.full_name,
      active: data.active,
      sequence: data.sequence,
      // types: Array.isArray(data.types) ? data.types : [data.types]
      types: Array.isArray(data.types)
        ? data.types.map((type) => (typeof type === 'object' ? type._id : type))
        : [data.types]
      // types: Array.isArray(data.types)
      // ? data.types.map((type) =>
      //     typeof type === 'object' ? JSON.stringify(type) : type
      //   )
      // : [data.types]
    };

    formData.forEach((value, key) => {});

    // Append only defined fields to FormData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Append arrays as individual FormData entries
          value.forEach((item) => formData.append(key, item)); // Use `key` without `[]`
        } else {
          formData.append(key, value as string | Blob);
        }
      }
    });
    let response;
    if (!entityId) {
      response = await fetchApi('/filtervalues/new', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/filtervalues/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }
    if (response?.success) {
      dispatch(addEditValuesSuccess());
      dispatch(fetchValuesList());
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
      dispatch(addEditValuesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditValuesFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});
export const fetchSingleValues = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'filtervalues/getsinglevalues',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleValuesStart());
      const response = await fetchApi(`/filtervalues/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleValuesSuccess(response?.filterValue));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleValuesFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleValuesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteValues = createAsyncThunk<any, string, { state: RootState }>(
  'values/delete',
  async (id, { dispatch }) => {
    dispatch(deleteValuesStart());
    try {
      const response = await fetchApi(`/filtervalues/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        dispatch(deleteValuesSuccess(id));
        dispatch(fetchValuesList());
        toast.success('Values deleted successfuly');
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        toast.error(errorMsg);
        dispatch(deleteValuesFailure(errorMsg));
      }
    } catch (error: any) {
      dispatch(deleteValuesFailure(error.message || 'Failed to delete values'));
      toast.error(error.message);
    }
  }
);

const valuesSlice = createSlice({
  name: 'values',
  initialState,
  reducers: {
    fetchValuesStart(state) {
      state.valuesListState.loading = true;
      state.valuesListState.error = null;
    },
    fetchValuesListSuccess(state, action) {
      state.valuesListState.loading = false;
      const { data, totalCount } = action.payload;
      state.valuesListState.data = data;
      state.valuesListState.pagination.totalCount = totalCount;
      state.valuesListState.error = null;
    },
    fetchValuesFailure(state, action) {
      state.valuesListState.loading = false;
      state.valuesListState.error = action.payload;
    },
    setValuesData(state, action) {
      state.singleValuesState.data = action.payload;
    },
    updateValuesData(state, action) {
      const oldData = state.singleValuesState.data;
      state.singleValuesState.data = { ...oldData, ...action.payload };
    },
    addEditValuesStart(state) {
      state.singleValuesState.loading = true;
      state.singleValuesState.error = null;
    },
    addEditValuesSuccess(state) {
      state.singleValuesState.loading = false;
      state.singleValuesState.error = null;
    },
    addEditValuesFailure(state, action) {
      state.singleValuesState.loading = false;
      state.singleValuesState.error = action.payload;
    },
    fetchSingleValuesStart(state) {
      state.singleValuesState.loading = true;
      state.singleValuesState.error = null;
    },
    fetchSingleValuesSuccess(state, action) {
      state.singleValuesState.loading = false;
      state.singleValuesState.data = action.payload;
      state.singleValuesState.error = null;
    },
    fetchSingleValuesFailure(state, action) {
      state.singleValuesState.loading = false;
      state.singleValuesState.error = action.payload;
    },
    deleteValuesStart(state) {
      state.singleValuesState.loading = true;
      state.singleValuesState.error = null;
    },
    deleteValuesSuccess(state, action) {
      state.singleValuesState.loading = false;
    },
    deleteValuesFailure(state, action) {
      state.singleValuesState.loading = false;
      state.singleValuesState.error = action.payload;
    }
  }
});

export const {
  fetchValuesStart,
  fetchValuesListSuccess,
  fetchValuesFailure,
  addEditValuesStart,
  addEditValuesSuccess,
  addEditValuesFailure,
  setValuesData,
  updateValuesData,
  fetchSingleValuesStart,
  fetchSingleValuesSuccess,
  fetchSingleValuesFailure,
  deleteValuesStart,
  deleteValuesFailure,
  deleteValuesSuccess
} = valuesSlice.actions;

export default valuesSlice.reducer;
