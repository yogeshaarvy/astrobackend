import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type IFaq = BaseModel & {
  name?: string;
  sequence?: number;
  active?: boolean;
  question: {
    en?: string;
    hi?: string;
  };
  answer: {
    en?: string;
    hi?: string;
  };
};

const initialState = {
  ListFaq: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IFaq[]>,
  singleListFaqState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IFaq | null>
};

//  List FAQ Section
export const addEditListFaq = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'kundli/addEditListFaq',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        kundliListFaq: {
          singleListFaqState: { data }
        }
      } = getState();

      dispatch(addEditListFaqStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      console.log('data', data);

      const formData = new FormData();
      const reqData: any = {
        name: data.name,
        sequence: data.sequence,
        question: JSON.stringify({
          en: data.question?.en,
          hi: data.question?.hi
        }),
        answer: JSON.stringify({ en: data.answer?.en, hi: data.answer?.hi }),
        active: data.active
      };

      console.log('reqData', reqData);

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/kundli/faq/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/kundli/faq/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditListFaqSuccess());
        dispatch(fetchListFaq());
        return response;
      } else {
        console.error('API Error Response:', response);
        const errorMsg = response?.data?.message ?? 'Something Went Wrong!!';
        dispatch(addEditListFaqFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: unknown) {
      console.error('Exception caught:', error);
      const errorMsg =
        error instanceof Error ? error.message : 'Something Went Wrong!!';
      dispatch(addEditListFaqFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchListFaq = createAsyncThunk<
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
  'kundli/fetchListFaq',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};
      dispatch(fetchListFaqStart());
      const response = await fetchApi(
        `/kundli/faq/all?page=${page || 1}&limit=${pageSize || 5}&field=${
          field || ''
        }&text=${keyword || ''}&active=${active || ''}&exportData=${
          exportData || false
        }`,
        { method: 'GET' }
      );
      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchListFaqSuccess({
              data: response.Faq,
              totalCount: response.totalFaq
            })
          );
        } else {
          dispatch(fetchExportLoading(false));
        }
        // Always return the response data
        return response;
      } else {
        throw new Error('No status or invalid response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchListFaqFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleListFaq = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'kundli/getSingleList',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleListFaqStart());
      const response = await fetchApi(`/kundli/faq/get/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleListFaqSuccess(response.KundliFaqData));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleListFaqFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleListFaqFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteFaq = createAsyncThunk<any, string, { state: RootState }>(
  'faq/delete',
  async (id, { dispatch }) => {
    dispatch(deleteFaqStart());
    try {
      const response = await fetchApi(`/kundli/faq/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        dispatch(deleteFaqSuccess(id));
        dispatch(fetchListFaq());
        toast.success('Faq deleted successfuly');
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        toast.error(errorMsg);
        dispatch(deleteFaqFailure(errorMsg));
      }
    } catch (error: any) {
      dispatch(deleteFaqFailure(error.message || 'Failed to delete faq'));
      toast.error(error.message);
    }
  }
);

const kundliFaqSlice = createSlice({
  name: 'kundliFaq',
  initialState,
  reducers: {
    setListFaqData(state, action) {
      state.singleListFaqState.data = action.payload;
    },
    updateListFaqData(state, action) {
      const oldData = state.singleListFaqState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleListFaqState.data = {
          ...newData,
          question: newData.question || { en: undefined, hi: undefined },
          answer: newData.answer || { en: undefined, hi: undefined }
        };
      } else {
        state.singleListFaqState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditListFaqStart(state) {
      state.singleListFaqState.loading = true;
      state.singleListFaqState.error = null;
    },
    addEditListFaqSuccess(state) {
      state.singleListFaqState.loading = false;
      state.singleListFaqState.error = null;
    },
    addEditListFaqFailure(state, action) {
      state.singleListFaqState.loading = false;
      state.singleListFaqState.error = action.payload;
    },
    fetchListFaqStart(state) {
      state.ListFaq.loading = true;
      state.ListFaq.error = null;
    },
    fetchListFaqSuccess(state, action) {
      state.ListFaq.loading = false;
      const { data, totalCount } = action.payload;
      state.ListFaq.data = data;
      state.ListFaq.pagination.totalCount = totalCount;
      state.ListFaq.error = null;
    },
    fetchListFaqFailure(state, action) {
      state.ListFaq.loading = false;
      state.ListFaq.error = action.payload;
    },
    fetchSingleListFaqStart(state) {
      state.singleListFaqState.loading = true;
      state.singleListFaqState.error = null;
    },
    fetchSingleListFaqSuccess(state, action) {
      state.singleListFaqState.loading = false;
      state.singleListFaqState.data = action.payload;
      state.singleListFaqState.error = null;
    },
    fetchSingleListFaqFailure(state, action) {
      state.singleListFaqState.loading = false;
      state.singleListFaqState.error = action.payload;
    },
    fetchExportLoading(state, action) {
      state.ListFaq.loading = action.payload;
    },

    deleteFaqStart(state) {
      state.singleListFaqState.loading = true;
      state.singleListFaqState.error = null;
    },
    deleteFaqSuccess(state, action) {
      state.singleListFaqState.loading = false;
    },
    deleteFaqFailure(state, action) {
      state.singleListFaqState.loading = false;
      state.singleListFaqState.error = action.payload;
    }
  }
});

export const {
  setListFaqData,
  updateListFaqData,
  addEditListFaqStart,
  addEditListFaqSuccess,
  addEditListFaqFailure,
  fetchListFaqStart,
  fetchListFaqSuccess,
  fetchListFaqFailure,
  fetchSingleListFaqStart,
  fetchSingleListFaqSuccess,
  fetchSingleListFaqFailure,
  fetchExportLoading,

  deleteFaqStart,
  deleteFaqSuccess,
  deleteFaqFailure
} = kundliFaqSlice.actions;
export default kundliFaqSlice.reducer;
