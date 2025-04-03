import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type ITestimonial = BaseModel & {
  name?: {
    en?: string;
    hi?: string;
  };
  title?: {
    en?: string;
    hi?: string;
  };
  review?: {
    en?: string;
    hi?: string;
  };
  sequence?: number;
  date?: string;
  profile_image?: string;
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
        horoscopetestimonial: {
          singleTestimonialState: { data }
        }
      } = getState();

      dispatch(addEditTestimonialListStart());

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
        title: clonedData.title ? JSON.stringify(clonedData.title) : undefined,
        review: clonedData.review
          ? JSON.stringify(clonedData.review)
          : undefined,
        date: clonedData.date,
        sequence: clonedData.sequence,
        profile_image: clonedData.profile_image,
        active: clonedData.active,
        readStatus: clonedData.readStatus,
        readLinks: clonedData.readLinks
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/horoscope/testimonial/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/horoscope/testimonial/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
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
        `/horoscope/testimonial/all?page=${page || 1}&limit=${
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
        `/horoscope/testimonial/get/${entityId}`,
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

export const deleteTestimonial = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('Testimonial/delete', async (id, { dispatch }) => {
  dispatch(deleteTestimonialStart());
  try {
    const response = await fetchApi(`/horoscope/testimonial/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteTestimonialSuccess(id));
      dispatch(fetchTestimonialList());
      toast.success('Testimonial deleted successfuly');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteTestimonialFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(deleteTestimonialFailure(error.message || 'Failed to delete faq'));
    toast.error(error.message);
  }
});

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
    },

    deleteTestimonialStart(state) {
      state.singleTestimonialState.loading = true;
      state.singleTestimonialState.error = null;
    },
    deleteTestimonialSuccess(state, action) {
      state.singleTestimonialState.loading = false;
    },
    deleteTestimonialFailure(state, action) {
      state.singleTestimonialState.loading = false;
      state.singleTestimonialState.error = action.payload;
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
  updateTestimonialListData,

  deleteTestimonialStart,
  deleteTestimonialSuccess,
  deleteTestimonialFailure
} = testimonialSlice.actions;

export default testimonialSlice.reducer;
