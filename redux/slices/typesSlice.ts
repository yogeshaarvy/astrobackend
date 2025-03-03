import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';

export type ITypes = BaseModel & {
  _id?: string;
  name?: string;
  active?: boolean;
  sequence?: number;
  searchpage?: string;
  type?: string;
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
  currentTypesState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ITypes | null>,
  changeTypesPassword: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ITypes | null>
};

export const fetchTypesList = createAsyncThunk<
  any,
  {
    page: number;
    pageSize: number;
    keyword: string;
    field: string;
    status: string;
    exportData: string;
    searchKeyword?: string;
  } | void,
  { state: RootState }
>(
  'types/fetchTypesList',
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
        `/filtertypes/all?page=${page || 1}&limit=${pageSize || 10}&text=${
          keyword || ''
        }&field=${field || ''}&active=${status || ''}&export=${
          exportData || ''
        }&searchKeyword=${searchKeyword || ''}`,
        { method: 'GET' }
      );
      // Check if the API response is valid and has the expected data
      if (response?.success) {
        dispatch(
          fetchTypesListSuccess({
            data: response.filterTypesdata,
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
>('types/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      filtertypes: {
        singleTypesState: { data }
      }
    } = getState();


    dispatch(addEditTypesStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    const formData = new FormData();
    const reqData: any = {
      name: data.name,
      active: data.active,
      sequence: data.sequence,
      searchpage: data.searchpage,
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
      response = await fetchApi('/filtertypes/new', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/filtertypes/update/${entityId}`, {
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
  'types/getsingletypes',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleTypesStart());
      const response = await fetchApi(`/filtertypes/single/${entityId}`, {
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
  'types/delete',
  async (id, { dispatch }) => {
    dispatch(deleteTypesStart());
    try {
      const response = await fetchApi(`/filtertypes/delete/${id}`, {
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

const typesSlice = createSlice({
  name: 'types',
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
      const oldData = state.singleTypesState.data;
      state.singleTypesState.data = { ...oldData, ...action.payload };
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
  deleteTypesSuccess
} = typesSlice.actions;

export default typesSlice.reducer;
