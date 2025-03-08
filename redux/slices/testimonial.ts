import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type ITestimonial = BaseModel & {
  name?: {
    en?: string;
    hi?: string;
  };
  title?: {
    en?: string;
    hi?: string;
  };
  description?: {
    en?: string;
    hi?: string;
  };
  sequence?: number;
  date?: string;
  profie_image?: string;
  active?: boolean;
  readStatus?: boolean;
  readLinks?: string;
};

const initialState = {
  testimonialList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<ITestimonial[]>,
  singleTestimonialState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ITestimonial | null>
};

export const addEditTestimonialList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'testimonial/addEditTestimonialList',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        testimonial: {
          singleTestimonialState: { data }
        }
      } = getState();

      dispatch(addEditTestimonialListStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      const formData = new FormData();
      const reqData: any = {
        name: data.name ? JSON.stringify(data.name) : undefined,
        title: data.title ? JSON.stringify(data.title) : undefined,
        description: data.description
          ? JSON.stringify(data.description)
          : undefined,
        date: data.date,
        sequence: data.sequence,
        active: data.active,
        readStatus: data.readStatus,
        readLinks: data.readLinks
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/testimonial/testimonialbanner/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(
          `/testimonial/testimonialbanner/update/${entityId}`,
          {
            method: 'PUT',
            body: formData
          }
        );
      }

      if (response?.success) {
        dispatch(addEditTestimonialListSuccess());
        dispatch(fetchTestimonialList());
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditTestimonialListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditTestimonialListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchTestimonialList = createAsyncThunk<
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
  'testimonial/fetchTestimonialList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};

      dispatch(fetchTestimonialListStart());

      const response = await fetchApi(
        `/testimonial/testimonialbanner/all??page=${page || 1}&limit=${
          pageSize || 5
        }&field=${field || ''}&text=${keyword || ''}&active=${
          active || ''
        }&exportData=${exportData || false}`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchTestimonialListSuccess({
              data: response.testimonial,
              totalCount: response.totalTestimonialCount
            })
          );
        } else {
          dispatch(fetchTestimonialExportLoading(false));
        }

        return response;
      } else {
        throw new Error('No Status Or Invalid Response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchTestimonialListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleTestimonialList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'testimonial/fetchSingleTestimonial',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleTestimonialListStart());
      const response = await fetchApi(
        `/testimonial/testimonialbanner/get/${entityId}`,
        {
          method: 'GET'
        }
      );
      if (response?.success) {
        dispatch(fetchSingleTestimonialListSuccess(response?.testimonial));

        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchSingleTestimonialListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleTestimonialListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

const testimonialSlice = createSlice({
  name: 'testimonial',
  initialState,
  reducers: {
    setTestimonialListData(state, action) {
      state.singleTestimonialState.data = action.payload;
    },
    updateTestimonialListData(state, action) {
      const oldData = state.singleTestimonialState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleTestimonialState.data = newData;
      } else {
        state.singleTestimonialState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditTestimonialListStart(state) {
      state.singleTestimonialState.loading = true;
      state.singleTestimonialState.error = null;
    },
    addEditTestimonialListSuccess(state) {
      state.singleTestimonialState.loading = false;
      state.singleTestimonialState.error = null;
    },
    addEditTestimonialListFailure(state, action) {
      state.singleTestimonialState.loading = false;
      state.singleTestimonialState.error = action.payload;
    },
    fetchTestimonialListStart(state) {
      state.testimonialList.loading = true;
      state.testimonialList.error = null;
    },
    fetchTestimonialListSuccess(state, action) {
      state.testimonialList.loading = false;
      const { data, totalCount } = action.payload;
      state.testimonialList.data = data;
      state.testimonialList.pagination.totalCount = totalCount;
      state.testimonialList.error = null;
    },
    fetchTestimonialListFailure(state, action) {
      state.testimonialList.loading = false;
      state.testimonialList.error = action.payload;
    },
    fetchSingleTestimonialListStart(state) {
      state.singleTestimonialState.loading = true;
      state.singleTestimonialState.error = null;
    },
    fetchSingleTestimonialListFailure(state, action) {
      state.singleTestimonialState.loading = false;
      state.singleTestimonialState.data = action.payload;
    },
    fetchSingleTestimonialListSuccess(state, action) {
      state.singleTestimonialState.loading = false;
      state.singleTestimonialState.data = action.payload;
      state.singleTestimonialState.error = null;
    },
    fetchTestimonialExportLoading(state, action) {
      state.testimonialList.loading = action.payload;
    }
  }
});

export const {
  setTestimonialListData,
  fetchTestimonialExportLoading,
  fetchTestimonialListFailure,
  fetchTestimonialListStart,
  fetchTestimonialListSuccess,
  fetchSingleTestimonialListFailure,
  fetchSingleTestimonialListStart,
  fetchSingleTestimonialListSuccess,
  addEditTestimonialListFailure,
  addEditTestimonialListStart,
  addEditTestimonialListSuccess,
  updateTestimonialListData
} = testimonialSlice.actions;

export default testimonialSlice.reducer;
