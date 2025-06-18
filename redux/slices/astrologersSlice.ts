import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { da } from 'date-fns/locale';

export type IRequest = BaseModel & {
  _id?: string;
  name?: string;
  dob?: string;
  gender?: string;
  languages?: any[];
  skills?: any[];
  phoneType?: string;
  email?: string;
  phone?: string;
  password?: string;
  image?: any;
  status?: string;
  active?: boolean;
  showinhome?: boolean;
};

const initialState = {
  astrologersListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IRequest[]>,
  singleRequestState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IRequest | null>,
  currentRequestState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IRequest | null>,
  changeRequestPassword: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IRequest | null>
};

export const fetchAstrologersList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field: string;
    status: string;
    exportData: string;
    active?: string;
  } | void,
  { state: RootState }
>(
  'request/fetchastrologersList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, status, exportData, active } =
        input || {};

      dispatch(fetchAstrologersStart());
      const response = await fetchApi(
        `/astrodetails/all?page=${page || 1}&limit=${pageSize || 10}&text=${
          keyword || ''
        }&field=${field || ''}&status=${status || ''}&export=${
          exportData || ''
        }&active=${active || ''}`,
        { method: 'GET' }
      );
      // Check if the API response is valid and has the expected data
      if (response?.success) {
        dispatch(
          fetchAstrologersListSuccess({
            data: response.astroDetial,
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
      dispatch(fetchAstrologersFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const addEditRequest = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('request/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      astrologersData: {
        singleRequestState: { data }
      }
    } = getState();

    dispatch(addEditRequestStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }
    const formData = new FormData();
    const reqData: any = {
      name: data.name || '',
      dob: data.dob || '',
      gender: data.gender || '',
      languages: JSON.stringify(data.languages) || [],
      skills: JSON.stringify(data.skills) || [],
      phoneType: data.phoneType || '',
      email: data.email || '',
      phone: data.phone || '',
      password: data.password || '',
      image: data.image || null,
      status: data.status || 'pending',
      active: data.active,
      showinhome: data.showinhome
    };
    console.log('req data is ', reqData);
    // Append only defined fields to FormData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    let response;
    if (!entityId) {
      response = await fetchApi('/astrodetails/new', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/astrodetails/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }
    if (response?.success) {
      dispatch(addEditRequestSuccess());
      dispatch(fetchAstrologersList());
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
      dispatch(addEditRequestFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditRequestFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});
export const fetchSingleRequest = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  '/astrodetails/single',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleRequestStart());
      const response = await fetchApi(`/astrodetails/single/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleRequestSuccess(response?.astroDetial));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleRequestFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleRequestFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteRequest = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('request/delete', async (id, { dispatch }) => {
  dispatch(deleteRequestStart());
  try {
    const response = await fetchApi(`/promo/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteRequestSuccess(id));
      dispatch(fetchAstrologersList());
      toast.success('Request deleted successfuly');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteRequestFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(deleteRequestFailure(error.message || 'Failed to delete request'));
    toast.error(error.message);
  }
});

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    fetchAstrologersStart(state) {
      state.astrologersListState.loading = true;
      state.astrologersListState.error = null;
    },
    fetchAstrologersListSuccess(state, action) {
      state.astrologersListState.loading = false;
      const { data, totalCount } = action.payload;
      state.astrologersListState.data = data;
      state.astrologersListState.pagination.totalCount = totalCount;
      state.astrologersListState.error = null;
    },
    fetchAstrologersFailure(state, action) {
      state.astrologersListState.loading = false;
      state.astrologersListState.error = action.payload;
    },
    setRequestData(state, action) {
      state.singleRequestState.data = action.payload;
    },
    updateRequestData(state, action) {
      const oldData = state.singleRequestState.data;
      state.singleRequestState.data = { ...oldData, ...action.payload };
    },
    addEditRequestStart(state) {
      state.singleRequestState.loading = true;
      state.singleRequestState.error = null;
    },
    addEditRequestSuccess(state) {
      state.singleRequestState.loading = false;
      state.singleRequestState.error = null;
    },
    addEditRequestFailure(state, action) {
      state.singleRequestState.loading = false;
      state.singleRequestState.error = action.payload;
    },
    fetchSingleRequestStart(state) {
      state.singleRequestState.loading = true;
      state.singleRequestState.error = null;
    },
    fetchSingleRequestSuccess(state, action) {
      state.singleRequestState.loading = false;
      state.singleRequestState.data = action.payload;
      state.singleRequestState.error = null;
    },
    fetchSingleRequestFailure(state, action) {
      state.singleRequestState.loading = false;
      state.singleRequestState.error = action.payload;
    },
    deleteRequestStart(state) {
      state.singleRequestState.loading = true;
      state.singleRequestState.error = null;
    },
    deleteRequestSuccess(state, action) {
      state.singleRequestState.loading = false;
    },
    deleteRequestFailure(state, action) {
      state.singleRequestState.loading = false;
      state.singleRequestState.error = action.payload;
    }
  }
});

export const {
  fetchAstrologersStart,
  fetchAstrologersListSuccess,
  fetchAstrologersFailure,
  addEditRequestStart,
  addEditRequestSuccess,
  addEditRequestFailure,
  setRequestData,
  updateRequestData,
  fetchSingleRequestStart,
  fetchSingleRequestSuccess,
  fetchSingleRequestFailure,
  deleteRequestStart,
  deleteRequestFailure,
  deleteRequestSuccess
} = requestSlice.actions;

export default requestSlice.reducer;
