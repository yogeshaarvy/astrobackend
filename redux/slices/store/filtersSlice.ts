import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type ITypes = BaseModel & {
  _id?: string;
  name?: {
    en?: String;
    hi?: String;
  };
  active?: boolean;
  sequence?: number;
  searchPage?: string;
  type?: string;
};

export type IValues = BaseModel & {
  _id?: string;
  short_name?: {
    en?: String;
    hi?: String;
  };
  full_name?: {
    en?: String;
    hi?: String;
  };
  active?: boolean;
  types?: any;
  sequence?: number;
};

const initialState = {
  typesListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<ITypes[]>,
  singleTypesState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ITypes | null>,

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
  } as BaseState<IValues | null>
};

// Start Type

export const fetchTypesList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field?: string;
    status?: string;
    exportData?: string;
    searchKeyword?: string;
  } | void,
  { state: RootState }
>(
  'filter/fetchTypesList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        page,
        pageSize,
        keyword,
        field,
        status,
        exportData,
        searchKeyword
      } = input || {};
      dispatch(fetchTypesStart());
      const response = await fetchApi(
        `/store/filter/type/all?page=${page || 1}&limit=${
          pageSize || 10
        }&text=${keyword || ''}&field=${field || ''}&active=${
          status || ''
        }&export=${exportData || ''}&searchKeyword=${searchKeyword || ''}`,
        { method: 'GET' }
      );
      // Check if the API response is valid and has the expected data
      if (response?.success) {
        dispatch(
          fetchTypesListSuccess({
            data: response.filterTypesData,
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
      dispatch(fetchTypesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const addEditTypes = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('filter/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      filter: {
        singleTypesState: { data }
      }
    } = getState();

    dispatch(addEditTypesStart());
    console.log('filterSlice -> addEditTypes -> data 1');

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    console.log('filterSlice -> addEditTypes -> data', data);
    let clonedData = cloneDeep(data);

    if (clonedData) {
      clonedData = await processNestedFields(clonedData);
    }

    const formData = new FormData();
    const reqData: any = {
      name: clonedData.name ? JSON.stringify(clonedData.name) : undefined,
      active: data.active,
      sequence: data.sequence,
      searchPage: data.searchPage,
      type: data.type
    };
    // Append only defined fields to FormData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    let response;
    if (!entityId) {
      response = await fetchApi('/store/filter/type/new', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/store/filter/type/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }
    if (response?.success) {
      dispatch(addEditTypesSuccess());
      dispatch(fetchTypesList());
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
      dispatch(addEditTypesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditTypesFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});
export const fetchSingleTypes = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'filter/getsingletypes',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleTypesStart());
      const response = await fetchApi(`/store/filter/type/single/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleTypesSuccess(response?.filterType));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleTypesFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleTypesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteTypes = createAsyncThunk<any, string, { state: RootState }>(
  'filter/delete',
  async (id, { dispatch }) => {
    dispatch(deleteTypesStart());
    try {
      const response = await fetchApi(`/store/filter/type/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        dispatch(deleteTypesSuccess(id));
        dispatch(fetchTypesList());
        toast.success('Types deleted successfuly');
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        toast.error(errorMsg);
        dispatch(deleteTypesFailure(errorMsg));
      }
    } catch (error: any) {
      dispatch(deleteTypesFailure(error.message || 'Failed to delete types'));
      toast.error(error.message);
    }
  }
);

// Start Values

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
        `/store/filter/value/all?page=${page || 1}&limit=${
          pageSize || 10
        }&text=${keyword || ''}&field=${field || ''}&active=${
          status || ''
        }&export=${exportData || ''}&filterByTypes=${filterByTypes || ''}`,
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
      filter: {
        singleValuesState: { data }
      }
    } = getState();

    dispatch(addEditValuesStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    let clonedData = cloneDeep(data);

    if (clonedData) {
      clonedData = await processNestedFields(clonedData);
    }

    const formData = new FormData();
    const reqData: any = {
      short_name: clonedData.short_name
        ? JSON.stringify(clonedData.short_name)
        : undefined,
      full_name: clonedData.full_name
        ? JSON.stringify(clonedData.full_name)
        : undefined,
      active: data.active,
      sequence: data.sequence,
      types: Array.isArray(data.types)
        ? data.types.map((type) => (typeof type === 'object' ? type._id : type))
        : [data.types]
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
      response = await fetchApi('/store/filter/value/new', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/store/filter/value/update/${entityId}`, {
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
      const response = await fetchApi(`/store/filter/value/${entityId}`, {
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

export const deleteValues = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('values/delete', async (id, { dispatch }) => {
  dispatch(deleteValuesStart());
  try {
    const response = await fetchApi(`/store/filter/value/delete/${id}`, {
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
});

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    fetchTypesStart(state) {
      state.typesListState.loading = true;
      state.typesListState.error = null;
    },
    fetchTypesListSuccess(state, action) {
      state.typesListState.loading = false;
      const { data, totalCount } = action.payload;
      state.typesListState.data = data;
      state.typesListState.pagination.totalCount = totalCount;
      state.typesListState.error = null;
    },
    fetchTypesFailure(state, action) {
      state.typesListState.loading = false;
      state.typesListState.error = action.payload;
    },
    setTypesData(state, action) {
      state.singleTypesState.data = action.payload;
    },
    updateTypesData(state, action) {
      console.log('testing 1', action.payload);
      const oldData = state.singleTypesState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleTypesState.data = newData;
      } else {
        state.singleTypesState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditTypesStart(state) {
      state.singleTypesState.loading = true;
      state.singleTypesState.error = null;
    },
    addEditTypesSuccess(state) {
      state.singleTypesState.loading = false;
      state.singleTypesState.error = null;
    },
    addEditTypesFailure(state, action) {
      state.singleTypesState.loading = false;
      state.singleTypesState.error = action.payload;
    },
    fetchSingleTypesStart(state) {
      state.singleTypesState.loading = true;
      state.singleTypesState.error = null;
    },
    fetchSingleTypesSuccess(state, action) {
      state.singleTypesState.loading = false;
      state.singleTypesState.data = action.payload;
      state.singleTypesState.error = null;
    },
    fetchSingleTypesFailure(state, action) {
      state.singleTypesState.loading = false;
      state.singleTypesState.error = action.payload;
    },
    deleteTypesStart(state) {
      state.singleTypesState.loading = true;
      state.singleTypesState.error = null;
    },
    deleteTypesSuccess(state, action) {
      state.singleTypesState.loading = false;
    },
    deleteTypesFailure(state, action) {
      state.singleTypesState.loading = false;
      state.singleTypesState.error = action.payload;
    },

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
      console.log('testing 1', action.payload);
      const oldData = state.singleValuesState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleValuesState.data = newData;
      } else {
        state.singleValuesState.data = {
          ...oldData,
          ...action.payload
        };
      }
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
  fetchTypesStart,
  fetchTypesListSuccess,
  fetchTypesFailure,
  addEditTypesStart,
  addEditTypesSuccess,
  addEditTypesFailure,
  setTypesData,
  updateTypesData,
  fetchSingleTypesStart,
  fetchSingleTypesSuccess,
  fetchSingleTypesFailure,
  deleteTypesStart,
  deleteTypesFailure,
  deleteTypesSuccess,

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
} = filterSlice.actions;

export default filterSlice.reducer;
