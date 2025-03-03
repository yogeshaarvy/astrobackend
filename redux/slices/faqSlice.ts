import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the SlidersRootState type to include sliders
export interface SlidersRootState {
  sliders: typeof initialState;
}
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { title } from 'process';

// Define the IFaq type
export type IFaq = BaseModel & {
  sequence?: number;
  question?: string;
  answer?: string;
  status?: boolean;
};

// Initial state
const initialState = {
  faqListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IFaq[]>,
  singlefaqState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IFaq | null>,
  currentFaqState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IFaq | null>
};

// Thunks
export const fetchFaqList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field?: string;
    status?: string;
    exportData?: boolean;
  },
  { state: RootState }
>('faq/fetchFaqList', async (input, { dispatch, rejectWithValue }) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      keyword = '',
      field = '',
      status = '',
      exportData = false
    } = input || {};
    dispatch(fetchFaqStart());
    const response = await fetchApi(
      `/faq/all?page=${page}&pageSize=${pageSize}&text=${keyword}&field=${field}&active=${status}&export=${exportData}`,
      { method: 'GET' }
    );
    if (response?.success) {
      dispatch(
        fetchFaqListSuccess({
          data: response.FaqData,
          totalCount: response.totalCount
        })
      );
      return response.FaqData;
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error: any) {
    dispatch(fetchFaqFailure(error?.message || 'Something went wrong'));
    return rejectWithValue(error?.message || 'Something went wrong');
  }
});

// Async thunk to add/edit sliders
// export const addEditFaq = createAsyncThunk<
// any, // The return type of the thunk
// { data: any, isUpdate: boolean }, // The argument type with data and isUpdate flag
// { state: SlidersRootState }// The type of the root state
// >(
//   'sliders/addEdit',
//   async ({data,isUpdate}, { dispatch, rejectWithValue }) => {

//     if (!data) {
//       return rejectWithValue('Please provide slider details');
//     }

//     // Prepare form data for the API request
//     const formData = new FormData();
//     Object.entries(data).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         formData.append(key, value as string | Blob);
//       }
//     });

//     // Debugging: Log the form data to ensure all data is appended correctly
//     for (let [key, value] of formData.entries()) {

//     }

//     try {
//       // Determine the request method and endpoint based on the isUpdate flag
//       const endpoint = isUpdate ? `/sliders/${data.id}` : '/sliders/new';
//       const method = isUpdate ? 'PUT' : 'POST';

//       // Make the request (POST for new slider, PUT for updating)
//       const response = await fetchApi(endpoint, { method, body: formData });

//       // Handle the response
//       if (response?.success) {
//         dispatch(addEditFaqSuccess()); // Dispatch success action
//         return response; // Return response data
//       } else {
//         throw new Error(response?.message || 'Failed to save slider');
//       }
//     } catch (error: any) {
//       // Dispatch failure action
//       dispatch(addEditFaqFailure(error?.message || 'Something went wrong'));
//       // Reject with error message
//       return rejectWithValue(error?.message || 'Something went wrong');
//     }
// });

export const addEditFaq = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('faq/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      faq: {
        singlefaqState: { data }
      }
    } = getState();

    dispatch(addEditFaqStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    const formData = new FormData();
    const reqData: any = {
      sequence: data.sequence,
      question: data.question,
      answer: data.answer,
      status: data.status
    };
    // Append only defined fields to FormData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    let response;
    if (!entityId) {
      response = await fetchApi('/faq/new', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/faq/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }
    if (response?.success) {
      dispatch(addEditFaqSuccess());
      dispatch(fetchFaqList());
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
      dispatch(addEditFaqFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditFaqFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const fetchsinglefaq = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'types/getsingletypes',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchsinglefaqStart());
      const response = await fetchApi(`/faq/single/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchsinglefaqSuccess(response?.faq));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchsinglefaqFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchsinglefaqFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteFaq = createAsyncThunk<any, string, { state: RootState }>(
  'brand/delete',
  async (id, { dispatch }) => {
    dispatch(deleteFaqStart());
    try {
      const response = await fetchApi(`/faq/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        dispatch(deleteFaqSuccess(id));
        dispatch(fetchFaqList());
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

// Slice
const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    fetchFaqStart(state) {
      state.faqListState.loading = true;
      state.faqListState.error = null;
    },
    fetchFaqListSuccess(state, action) {
      const { data, totalCount } = action.payload;
      state.faqListState.data = data;
      state.faqListState.pagination.totalCount = totalCount;
      state.faqListState.loading = false;
    },
    fetchFaqFailure(state, action) {
      state.faqListState.loading = false;
      state.faqListState.error = action.payload;
    },
    addEditFaqStart(state) {
      state.singlefaqState.loading = true;
      state.singlefaqState.error = null;
    },
    addEditFaqSuccess(state) {
      state.singlefaqState.loading = false;
    },
    addEditFaqFailure(state, action) {
      state.singlefaqState.loading = false;
      state.singlefaqState.error = action.payload;
    },
    updateFaqData(state, action) {
      const oldData = state.singlefaqState.data;
      state.singlefaqState.data = { ...oldData, ...action.payload };
    },
    fetchsinglefaqStart(state) {
      state.singlefaqState.loading = true;
      state.singlefaqState.error = null;
    },
    fetchsinglefaqSuccess(state, action) {
      state.singlefaqState.loading = false;
      state.singlefaqState.data = action.payload;
      state.singlefaqState.error = null;
    },
    fetchsinglefaqFailure(state, action) {
      state.singlefaqState.loading = false;
      state.singlefaqState.error = action.payload;
    },
    deleteFaqStart(state) {
      state.singlefaqState.loading = true;
      state.singlefaqState.error = null;
    },
    deleteFaqSuccess(state, action) {
      state.singlefaqState.loading = false;
    },
    deleteFaqFailure(state, action) {
      state.singlefaqState.loading = false;
      state.singlefaqState.error = action.payload;
    }
  }
});

export const {
  fetchFaqStart,
  fetchFaqListSuccess,
  fetchFaqFailure,
  addEditFaqStart,
  addEditFaqSuccess,
  addEditFaqFailure,
  updateFaqData,
  fetchsinglefaqStart,
  fetchsinglefaqSuccess,
  fetchsinglefaqFailure,
  deleteFaqStart,
  deleteFaqSuccess,
  deleteFaqFailure
} = faqSlice.actions;

export default faqSlice.reducer;
