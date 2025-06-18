import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { RootState } from '@/redux/store';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';

export type ILanguageData = BaseModel & {
  _id?: string;
  name?: string;
  active?: boolean;
};

const initialState = {
  languageDataListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<ILanguageData[]>,
  singleLanguageDataState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ILanguageData | null>,
  currentLanguageDataState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ILanguageData | null>
};

export const fetchLanguageDataList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field: string;
    status: string;
    exportData: string;
  } | void,
  { state: RootState }
>(
  'languageData/fetchLanguageDataList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, status, exportData } =
        input || {};

      dispatch(fetchLanguageDataStart());
      const response = await fetchApi(
        `/language_data/all?page=${page || 1}&limit=${pageSize || 10}&text=${
          keyword || ''
        }&field=${field || ''}&active=${status || ''}&export=${exportData}`,
        { method: 'GET' }
      );
      // Check if the API response is valid and has the expected data
      if (response?.success) {
        dispatch(
          fetchLanguageDataListSuccess({
            data: response.languageData,
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
      dispatch(fetchLanguageDataFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditLanguageData = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'languageData/addEdit',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        languageData: {
          singleLanguageDataState: { data }
        }
      } = getState();

      dispatch(addEditLanguageDataStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      const formData = new FormData();
      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const reqData: any = {
        name: clonedData.name ? clonedData.name : undefined,
        active: data.active
      };
      // Append only defined fields to FormData
      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/language_data/new', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/language_data/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }
      if (response?.success) {
        dispatch(addEditLanguageDataSuccess());
        dispatch(fetchLanguageDataList());
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong!!';
        dispatch(addEditLanguageDataFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditLanguageDataFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleLanguageData = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'languageData/fetchSingle',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleLanguageDataStart());
      const response = await fetchApi(`/language_data/single/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleLanguageDataSuccess(response?.languagedata));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleLanguageDataFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleLanguageDataFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteLanguageData = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('languageData/delete', async (id, { dispatch }) => {
  dispatch(deleteLanguageDataStart());
  try {
    const response = await fetchApi(`/language_data/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteLanguageDataSuccess(id));
      dispatch(fetchLanguageDataList());
      toast.success('Language data deleted successfully');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteLanguageDataFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteLanguageDataFailure(
        error.message || 'Failed to delete language data'
      )
    );
    toast.error(error.message);
  }
});

const languageDataSlice = createSlice({
  name: 'languageData',
  initialState,
  reducers: {
    fetchLanguageDataStart(state) {
      state.languageDataListState.loading = true;
      state.languageDataListState.error = null;
    },
    fetchLanguageDataListSuccess(state, action) {
      state.languageDataListState.loading = false;
      const { data, totalCount } = action.payload;
      state.languageDataListState.data = data;
      state.languageDataListState.pagination.totalCount = totalCount;
      state.languageDataListState.error = null;
    },
    fetchLanguageDataFailure(state, action) {
      state.languageDataListState.loading = false;
      state.languageDataListState.error = action.payload;
    },
    setLanguageData(state, action) {
      state.singleLanguageDataState.data = action.payload;
    },
    updateLanguageData(state, action) {
      const oldData = state.singleLanguageDataState.data;
      state.singleLanguageDataState.data = { ...oldData, ...action.payload };
    },
    addEditLanguageDataStart(state) {
      state.singleLanguageDataState.loading = true;
      state.singleLanguageDataState.error = null;
    },
    addEditLanguageDataSuccess(state) {
      state.singleLanguageDataState.loading = false;
      state.singleLanguageDataState.error = null;
    },
    addEditLanguageDataFailure(state, action) {
      state.singleLanguageDataState.loading = false;
      state.singleLanguageDataState.error = action.payload;
    },
    fetchSingleLanguageDataStart(state) {
      state.singleLanguageDataState.loading = true;
      state.singleLanguageDataState.error = null;
    },
    fetchSingleLanguageDataSuccess(state, action) {
      state.singleLanguageDataState.loading = false;
      state.singleLanguageDataState.data = action.payload;
      state.singleLanguageDataState.error = null;
    },
    fetchSingleLanguageDataFailure(state, action) {
      state.singleLanguageDataState.loading = false;
      state.singleLanguageDataState.error = action.payload;
    },
    deleteLanguageDataStart(state) {
      state.singleLanguageDataState.loading = true;
      state.singleLanguageDataState.error = null;
    },
    deleteLanguageDataSuccess(state, action) {
      state.singleLanguageDataState.loading = false;
    },
    deleteLanguageDataFailure(state, action) {
      state.singleLanguageDataState.loading = false;
      state.singleLanguageDataState.error = action.payload;
    }
  }
});

export const {
  fetchLanguageDataStart,
  fetchLanguageDataListSuccess,
  fetchLanguageDataFailure,
  addEditLanguageDataStart,
  addEditLanguageDataSuccess,
  addEditLanguageDataFailure,
  setLanguageData,
  updateLanguageData,
  fetchSingleLanguageDataStart,
  fetchSingleLanguageDataSuccess,
  fetchSingleLanguageDataFailure,
  deleteLanguageDataStart,
  deleteLanguageDataFailure,
  deleteLanguageDataSuccess
} = languageDataSlice.actions;

export default languageDataSlice.reducer;
