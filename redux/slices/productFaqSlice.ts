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
export type IProductFaq = BaseModel & {
  sequence?: number;
  question?: string;
  answer?: string;
  status?: boolean;
  product_id?: string;
};

// Initial state
const initialState = {
  productfaqListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IProductFaq[]>,
  singleproductfaqState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IProductFaq | null>,
  currentproductFaqState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IProductFaq | null>
};

// Thunks
export const fetchproductFaqList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field?: string;
    status?: string;
    exportData?: boolean;
    productId?: string;
  },
  { state: RootState }
>('faq/fetchproductFaqList', async (input, { dispatch, rejectWithValue }) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      keyword = '',
      field = '',
      status = '',
      exportData = false
    } = input || {};
    dispatch(fetchproductFaqStart());
    const response = await fetchApi(
      `/productfaq/all?productId=${input.productId}&page=${page}&pageSize=${pageSize}&text=${keyword}&field=${field}&active=${status}&export=${exportData}`,
      { method: 'GET' }
    );
    if (response?.success) {
      dispatch(
        fetchproductFaqListSuccess({
          data: response.productFaqData,
          totalCount: response.totalCount
        })
      );
      return response.productFaqData;
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error: any) {
    dispatch(fetchproductFaqFailure(error?.message || 'Something went wrong'));
    return rejectWithValue(error?.message || 'Something went wrong');
  }
});

// Async thunk to add/edit sliders
// export const addEditproductFaq = createAsyncThunk<
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
//         dispatch(addEditproductFaqSuccess()); // Dispatch success action
//         return response; // Return response data
//       } else {
//         throw new Error(response?.message || 'Failed to save slider');
//       }
//     } catch (error: any) {
//       // Dispatch failure action
//       dispatch(addEditproductFaqFailure(error?.message || 'Something went wrong'));
//       // Reject with error message
//       return rejectWithValue(error?.message || 'Something went wrong');
//     }
// });

interface AddEditProductFaqInput {
  entityId: string | null;
  productId: string;
}

interface AddEditProductFaqResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export const addEditproductFaq = createAsyncThunk<
  AddEditProductFaqResponse,
  AddEditProductFaqInput,
  { state: RootState }
>(
  'faq/add',
  async ({ entityId, productId }, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        productfaq: {
          singleproductfaqState: { data }
        }
      } = getState();

      dispatch(addEditproductFaqStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      const formData = new FormData();
      const reqData: any = {
        product_id: productId,
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

      let response: AddEditProductFaqResponse;
      if (!entityId) {
        response = await fetchApi('/productfaq/new', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/productfaq/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }
      if (response?.success) {
        dispatch(addEditproductFaqSuccess());
        dispatch(fetchproductFaqList());
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditproductFaqFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditproductFaqFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchsingleproductfaq = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'types/getsingletypes',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchsingleproductfaqStart());
      const response = await fetchApi(`/productfaq/single/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchsingleproductfaqSuccess(response?.faqdata));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchsingleproductfaqFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchsingleproductfaqFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteproductFaq = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('brand/delete', async (id, { dispatch }) => {
  dispatch(deleteproductFaqStart());
  try {
    const response = await fetchApi(`/productfaq/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteproductFaqSuccess(id));
      dispatch(fetchproductFaqList());
      toast.success('Faq deleted successfuly');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteproductFaqFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(deleteproductFaqFailure(error.message || 'Failed to delete faq'));
    toast.error(error.message);
  }
});

// Slice
const productfaqSlice = createSlice({
  name: 'productfaq',
  initialState,
  reducers: {
    fetchproductFaqStart(state) {
      state.productfaqListState.loading = true;
      state.productfaqListState.error = null;
    },
    fetchproductFaqListSuccess(state, action) {
      const { data, totalCount } = action.payload;
      state.productfaqListState.data = data;
      state.productfaqListState.pagination.totalCount = totalCount;
      state.productfaqListState.loading = false;
    },
    fetchproductFaqFailure(state, action) {
      state.productfaqListState.loading = false;
      state.productfaqListState.error = action.payload;
    },
    addEditproductFaqStart(state) {
      state.singleproductfaqState.loading = true;
      state.singleproductfaqState.error = null;
    },
    addEditproductFaqSuccess(state) {
      state.singleproductfaqState.loading = false;
    },
    addEditproductFaqFailure(state, action) {
      state.singleproductfaqState.loading = false;
      state.singleproductfaqState.error = action.payload;
    },
    updateproductFaqData(state, action) {
      const oldData = state.singleproductfaqState.data;
      state.singleproductfaqState.data = { ...oldData, ...action.payload };
    },
    fetchsingleproductfaqStart(state) {
      state.singleproductfaqState.loading = true;
      state.singleproductfaqState.error = null;
    },
    fetchsingleproductfaqSuccess(state, action) {
      state.singleproductfaqState.loading = false;
      state.singleproductfaqState.data = action.payload;
      state.singleproductfaqState.error = null;
    },
    fetchsingleproductfaqFailure(state, action) {
      state.singleproductfaqState.loading = false;
      state.singleproductfaqState.error = action.payload;
    },
    deleteproductFaqStart(state) {
      state.singleproductfaqState.loading = true;
      state.singleproductfaqState.error = null;
    },
    deleteproductFaqSuccess(state, action) {
      state.singleproductfaqState.loading = false;
    },
    deleteproductFaqFailure(state, action) {
      state.singleproductfaqState.loading = false;
      state.singleproductfaqState.error = action.payload;
    }
  }
});

export const {
  fetchproductFaqStart,
  fetchproductFaqListSuccess,
  fetchproductFaqFailure,
  addEditproductFaqStart,
  addEditproductFaqSuccess,
  addEditproductFaqFailure,
  updateproductFaqData,
  fetchsingleproductfaqStart,
  fetchsingleproductfaqSuccess,
  fetchsingleproductfaqFailure,
  deleteproductFaqStart,
  deleteproductFaqSuccess,
  deleteproductFaqFailure
} = productfaqSlice.actions;

export default productfaqSlice.reducer;
