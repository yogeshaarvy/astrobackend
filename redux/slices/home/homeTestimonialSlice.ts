import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type IHomeTestimonial = BaseModel & {
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
};

const initialState = {
  hometestimonialList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IHomeTestimonial[]>,
  singlehomeTestimonialState: {
    data: null,
    loading: false,
    error: null
  } as BaseState<IHomeTestimonial | null>
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
        homeTestimonial: {
          singlehomeTestimonialState: { data }
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
        active: clonedData.active
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/home/testimonial/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/home/testimonial/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditTestimonialListSuccess());
        dispatch(fetchTestimonialList());
        toast.success(response?.message || 'Testimonial saved successfully');
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditTestimonialListFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditTestimonialListFailure(errorMsg));
      toast.error(errorMsg);
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
  'home/fetchTestimonialList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};

      dispatch(fetchTestimonialListStart());

      const response = await fetchApi(
        `/home/testimonial/all?page=${page || 1}&limit=${
          pageSize || 10
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
              totalCount: response.totalTestimonialCount,
              currentPage: response.currentPage,
              totalPage: response.totalPage,
              limit: response.limit
            })
          );
        } else {
          dispatch(fetchTestimonialExportLoading(false));
        }

        return response;
      } else {
        throw new Error(response?.message || 'No Status Or Invalid Response');
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
      const response = await fetchApi(`/home/testimonial/get/${entityId}`, {
        method: 'GET'
      });
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
>('testimonial/delete', async (id, { dispatch }) => {
  dispatch(deleteTestimonialStart());
  try {
    const response = await fetchApi(`/home/testimonial/delete/${id}`, {
      method: 'DELETE'
    });
    if (response?.success) {
      dispatch(deleteTestimonialSuccess(id));
      dispatch(fetchTestimonialList());
      toast.success(response?.message || 'Testimonial deleted successfully');
      return response;
    } else {
      let errorMsg = response?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteTestimonialFailure(errorMsg));
      return Promise.reject(errorMsg);
    }
  } catch (error: any) {
    let errorMsg = error?.message || 'Failed to delete testimonial';
    dispatch(deleteTestimonialFailure(errorMsg));
    toast.error(errorMsg);
    return Promise.reject(errorMsg);
  }
});

// New thunk for fetching testimonials for users (frontend)
export const fetchTestimonialListForUser = createAsyncThunk<
  any,
  { selectedLanguage?: string } | void,
  { state: RootState }
>(
  'testimonial/fetchTestimonialListForUser',
  async (input, { dispatch, rejectWithValue }) => {
    try {
      const { selectedLanguage = 'en' } = input || {};

      const response = await fetchApi(
        `/home/testimonial/user?selectedLanguage=${selectedLanguage}`,
        { method: 'GET' }
      );

      if (response?.success) {
        return response;
      } else {
        throw new Error(response?.message || 'Failed to fetch testimonials');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      return rejectWithValue(errorMsg);
    }
  }
);

const testimonialSlice = createSlice({
  name: 'testimonial',
  initialState,
  reducers: {
    setTestimonialListData(state, action) {
      state.singlehomeTestimonialState.data = action.payload;
    },
    updateTestimonialListData(state, action) {
      const oldData = state.singlehomeTestimonialState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singlehomeTestimonialState.data = newData;
      } else {
        state.singlehomeTestimonialState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    clearTestimonialData(state) {
      state.singlehomeTestimonialState.data = null;
      state.singlehomeTestimonialState.error = null;
    },
    addEditTestimonialListStart(state) {
      state.singlehomeTestimonialState.loading = true;
      state.singlehomeTestimonialState.error = null;
    },
    addEditTestimonialListSuccess(state) {
      state.singlehomeTestimonialState.loading = false;
      state.singlehomeTestimonialState.error = null;
    },
    addEditTestimonialListFailure(state, action) {
      state.singlehomeTestimonialState.loading = false;
      state.singlehomeTestimonialState.error = action.payload;
    },
    fetchTestimonialListStart(state) {
      state.hometestimonialList.loading = true;
      state.hometestimonialList.error = null;
    },
    fetchTestimonialListSuccess(state, action) {
      state.hometestimonialList.loading = false;
      const { data, totalCount, currentPage, totalPage, limit } =
        action.payload;
      state.hometestimonialList.data = data;
      state.hometestimonialList.pagination.totalCount = totalCount;
      state.hometestimonialList.pagination.page = currentPage || 1;
      state.hometestimonialList.pagination.pageSize = limit || 10;
      state.hometestimonialList.error = null;
    },
    fetchTestimonialListFailure(state, action) {
      state.hometestimonialList.loading = false;
      state.hometestimonialList.error = action.payload;
    },
    fetchSingleTestimonialListStart(state) {
      state.singlehomeTestimonialState.loading = true;
      state.singlehomeTestimonialState.error = null;
    },
    fetchSingleTestimonialListFailure(state, action) {
      state.singlehomeTestimonialState.loading = false;
      state.singlehomeTestimonialState.error = action.payload;
    },
    fetchSingleTestimonialListSuccess(state, action) {
      state.singlehomeTestimonialState.loading = false;
      state.singlehomeTestimonialState.data = action.payload;
      state.singlehomeTestimonialState.error = null;
    },
    fetchTestimonialExportLoading(state, action) {
      state.hometestimonialList.loading = action.payload;
    },
    deleteTestimonialStart(state) {
      state.singlehomeTestimonialState.loading = true;
      state.singlehomeTestimonialState.error = null;
    },
    deleteTestimonialSuccess(state, action) {
      state.singlehomeTestimonialState.loading = false;
      state.singlehomeTestimonialState.error = null;
    },
    deleteTestimonialFailure(state, action) {
      state.singlehomeTestimonialState.loading = false;
      state.singlehomeTestimonialState.error = action.payload;
    }
  }
});

export const {
  setTestimonialListData,
  clearTestimonialData,
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
