import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type IMatchMakingTestimonial = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  subtitle?: {
    en?: string;
    hi?: string;
  };
  description?: {
    en?: string;
    hi?: string;
  };
  sequence?: number;
  active?: boolean;
};

const initialState = {
  matchMakingTestimonialList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IMatchMakingTestimonial[]>,
  singleMatchMakingTestimonialState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IMatchMakingTestimonial | null>
};

export const addEditMatchMakingTestimonialList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'matchMakingTestimonial/addEditMatchMakingTestimonialList',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        matchMakingTestimonial: {
          singleMatchMakingTestimonialState: { data }
        }
      } = getState();

      dispatch(addEditMatchMakingTestimonialListStart());

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
        subtitle: clonedData.subtitle
          ? JSON.stringify(clonedData.subtitle)
          : undefined,
        description: clonedData.description
          ? JSON.stringify(clonedData.description)
          : undefined,
        sequence: clonedData.sequence,
        active: clonedData.active
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/match-making/testimonial/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(
          `/match-making/testimonial/update/${entityId}`,
          {
            method: 'PUT',
            body: formData
          }
        );
      }

      if (response?.success) {
        dispatch(addEditMatchMakingTestimonialListSuccess());
        dispatch(fetchMatchMakingTestimonialList());
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditMatchMakingTestimonialListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditMatchMakingTestimonialListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchMatchMakingTestimonialList = createAsyncThunk<
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
  'matchMakingTestimonial/fetchMatchMakingTestimonialList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};

      dispatch(fetchMatchMakingTestimonialListStart());

      const response = await fetchApi(
        `/match-making/testimonial/all?page=${page || 1}&limit=${
          pageSize || 5
        }&field=${field || ''}&text=${keyword || ''}&active=${
          active || ''
        }&exportData=${exportData || false}`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchMatchMakingTestimonialListSuccess({
              data: response.testimonials,
              totalCount: response.totalTestimonialCount
            })
          );
        } else {
          dispatch(fetchMatchMakingTestimonialExportLoading(false));
        }

        return response;
      } else {
        throw new Error('No Status Or Invalid Response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchMatchMakingTestimonialListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleMatchMakingTestimonialList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'matchMakingTestimonial/fetchSingleMatchMakingTestimonial',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleMatchMakingTestimonialListStart());
      const response = await fetchApi(
        `/match-making/testimonial/get/${entityId}`,
        {
          method: 'GET'
        }
      );
      if (response?.success) {
        dispatch(
          fetchSingleMatchMakingTestimonialListSuccess(response?.testimonial)
        );
        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchSingleMatchMakingTestimonialListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleMatchMakingTestimonialListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteMatchMakingTestimonial = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('matchMakingTestimonial/delete', async (id, { dispatch }) => {
  dispatch(deleteMatchMakingTestimonialStart());
  try {
    const response = await fetchApi(`/match-making/testimonial/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteMatchMakingTestimonialSuccess(id));
      dispatch(fetchMatchMakingTestimonialList());
      toast.success('MatchMaking Testimonial deleted successfully');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteMatchMakingTestimonialFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteMatchMakingTestimonialFailure(
        error.message || 'Failed to delete testimonial'
      )
    );
    toast.error(error.message);
  }
});

const matchMakingTestimonialSlice = createSlice({
  name: 'matchMakingTestimonial',
  initialState,
  reducers: {
    setMatchMakingTestimonialListData(state, action) {
      state.singleMatchMakingTestimonialState.data = action.payload;
    },
    updateMatchMakingTestimonialListData(state, action) {
      const oldData = state.singleMatchMakingTestimonialState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleMatchMakingTestimonialState.data = newData;
      } else {
        state.singleMatchMakingTestimonialState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditMatchMakingTestimonialListStart(state) {
      state.singleMatchMakingTestimonialState.loading = true;
      state.singleMatchMakingTestimonialState.error = null;
    },
    addEditMatchMakingTestimonialListSuccess(state) {
      state.singleMatchMakingTestimonialState.loading = false;
      state.singleMatchMakingTestimonialState.error = null;
    },
    addEditMatchMakingTestimonialListFailure(state, action) {
      state.singleMatchMakingTestimonialState.loading = false;
      state.singleMatchMakingTestimonialState.error = action.payload;
    },
    fetchMatchMakingTestimonialListStart(state) {
      state.matchMakingTestimonialList.loading = true;
      state.matchMakingTestimonialList.error = null;
    },
    fetchMatchMakingTestimonialListSuccess(state, action) {
      state.matchMakingTestimonialList.loading = false;
      const { data, totalCount } = action.payload;
      state.matchMakingTestimonialList.data = data;
      state.matchMakingTestimonialList.pagination.totalCount = totalCount;
      state.matchMakingTestimonialList.error = null;
    },
    fetchMatchMakingTestimonialListFailure(state, action) {
      state.matchMakingTestimonialList.loading = false;
      state.matchMakingTestimonialList.error = action.payload;
    },
    fetchSingleMatchMakingTestimonialListStart(state) {
      state.singleMatchMakingTestimonialState.loading = true;
      state.singleMatchMakingTestimonialState.error = null;
    },
    fetchSingleMatchMakingTestimonialListFailure(state, action) {
      state.singleMatchMakingTestimonialState.loading = false;
      state.singleMatchMakingTestimonialState.error = action.payload;
    },
    fetchSingleMatchMakingTestimonialListSuccess(state, action) {
      state.singleMatchMakingTestimonialState.loading = false;
      state.singleMatchMakingTestimonialState.data = action.payload;
      state.singleMatchMakingTestimonialState.error = null;
    },
    fetchMatchMakingTestimonialExportLoading(state, action) {
      state.matchMakingTestimonialList.loading = action.payload;
    },

    deleteMatchMakingTestimonialStart(state) {
      state.singleMatchMakingTestimonialState.loading = true;
      state.singleMatchMakingTestimonialState.error = null;
    },
    deleteMatchMakingTestimonialSuccess(state, action) {
      state.singleMatchMakingTestimonialState.loading = false;
    },
    deleteMatchMakingTestimonialFailure(state, action) {
      state.singleMatchMakingTestimonialState.loading = false;
      state.singleMatchMakingTestimonialState.error = action.payload;
    }
  }
});

export const {
  setMatchMakingTestimonialListData,
  fetchMatchMakingTestimonialExportLoading,
  fetchMatchMakingTestimonialListFailure,
  fetchMatchMakingTestimonialListStart,
  fetchMatchMakingTestimonialListSuccess,
  fetchSingleMatchMakingTestimonialListFailure,
  fetchSingleMatchMakingTestimonialListStart,
  fetchSingleMatchMakingTestimonialListSuccess,
  addEditMatchMakingTestimonialListFailure,
  addEditMatchMakingTestimonialListStart,
  addEditMatchMakingTestimonialListSuccess,
  updateMatchMakingTestimonialListData,

  deleteMatchMakingTestimonialStart,
  deleteMatchMakingTestimonialSuccess,
  deleteMatchMakingTestimonialFailure
} = matchMakingTestimonialSlice.actions;

export default matchMakingTestimonialSlice.reducer;
