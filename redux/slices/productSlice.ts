import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { setNestedProperty } from '@/utils/SetNestedProperty';
export type ISimpleProduct = {
  price?: number;
  special_price?: number;
  weight?: number;
  height?: number;
  breadth?: number;
  length?: number;
};

export type IStockManagement = {
  stock_management?: boolean;
  stock_value?: number;
  stock_status?: string;
  stock_management_level?: string;
};
export type IProducts = BaseModel & {
  _id?: string;
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  active?: boolean;
  filtertypes?: any;
  filtervalues?: any;
  categories?: any;
  sequence?: number;
  special_price?: number;
  price?: number;
  model_no?: string;
  main_image?: string;
  other_image?: any;
  brand_name?: any;
  manufacture?: string;
  meta_title?: string;
  meta_description?: string;
  meta_tag?: string;
  madeIn?: any;
  // price?: number;
  // special_price?: number,
  videotype?: any;
  tax?: any;
  tags?: any;
  maxorder?: string;
  maxorder_value?: number;
  minorder?: string;
  minorder_value?: number;
  hsn_code?: string;
  return_able?: string;
  number_of_days?: number;
  if_cancel?: string;
  cancel_days?: number;
  videodata?: string;
  is_cod_allowed?: boolean;
  // stock_management?: boolean,
  // stock_value?: Number,
  productype?: string;
  simpleProduct?: ISimpleProduct; // Nested object for Simple Product fields
  stockManagement?: IStockManagement; // Nested object for Stock Management fields
  variations?: any;
  attributes?: any;
  variants?: any;
  sku?: string;
  totalStock?: number;
  stock_status?: string;
  values?: any
};

const initialState = {
  productsListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IProducts[]>,
  singleProductsState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IProducts | null>,
  currentProductsState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IProducts | null>,
  changeProductsPassword: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IProducts | null>
};

export const fetchProductsList = createAsyncThunk<
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
  'products/fetchProductsList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, status, exportData } =
        input || {};

      dispatch(fetchProductsStart());
      const response = await fetchApi(
        `/products/all?page=${page || 1}&limit=${pageSize || 10}&text=${keyword || ''
        }&field=${field || ''}&active=${status || ''}&exportData=${exportData}`,
        { method: 'GET' }
      );

      // Check if the API response is valid and has the expected data
      if (response?.success) {
        dispatch(
          fetchProductsListSuccess({
            data: response.productsdata,
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
      dispatch(fetchProductsFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const addEditProducts = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('products/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      productsdata: {
        singleProductsState: { data }
      }
    } = getState();

    dispatch(addEditProductsStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }
    const formData = new FormData();
    const reqData: any = {
      name: data.name,
      slug: data.slug,
      active: data.active,
      sequence: data.sequence,
      model_no: data.model_no,
      main_image: data.main_image,
      manufacture: data.manufacture,
      meta_tag: data.meta_tag,
      meta_description: data.meta_description,
      meta_title: data.meta_title,
      videodata: data.videodata,
      productype: data.productype,
      // price: data.price,
      // special_price: data.special_price,
      maxorder: data.maxorder,
      maxorder_value: data.maxorder_value,
      minorder: data.minorder,
      minorder_value: data.minorder_value,
      hsn_code: data.hsn_code,
      return_able: data.return_able,
      number_of_days: data.number_of_days,
      if_cancel: data.if_cancel,
      cancel_days: data.cancel_days,
      is_cod_allowed: data.is_cod_allowed,
      description: data.description,
      sku: data.sku,
      tax:
        typeof data?.tax === 'object' && data?.tax !== null
          ? data.tax?._id
          : data.tax,
      tags:
        typeof data?.tags === 'object' && data?.tags !== null
          ? data.tags?._id
          : data.tags,
      madeIn:
        typeof data?.madeIn === 'object' && data?.madeIn !== null
          ? data.madeIn?._id
          : data.madeIn,
      brand_name:
        typeof data?.brand_name === 'object' && data?.brand_name !== null
          ? data.brand_name?._id
          : data.brand_name,
      other_image: Array.isArray(data.other_image)
        ? data.other_image
        : [data.other_image],
      filtertypes: Array.isArray(data.filtertypes)
        ? data.filtertypes
        : [data.filtertypes],
      filtervalues: Array.isArray(data.filtervalues)
        ? data.filtervalues
        : [data.filtervalues],
      categories: data.categories ? data.categories?.map((cat: any) => cat?._id).join(",") : [],
      attributes: data.attributes,
      variants: data.variations,
      stockManagement: JSON.stringify(data.stockManagement) // Convert to JSON string
    };
    // Append only defined fields to FormData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Append arrays as individual FormData entries
          value.forEach((item) => formData.append(key, item)); // Use `key` without `[]`
        } else {
          formData.append(key, value as string | Blob);
        }
      }
    });

    let response;
    if (!entityId) {
      response = await fetchApi('/products/new', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/products/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }
    if (response?.success) {
      dispatch(addEditProductsSuccess());
      dispatch(fetchProductsList());
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
      dispatch(addEditProductsFailure(errorMsg));
      toast.error(errorMsg)
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    toast.error(errorMsg)
    dispatch(addEditProductsFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});
export const fetchSingleProducts = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'products/getsingleproducts',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleProductsStart());
      const response = await fetchApi(`/products/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleProductsSuccess(response?.productData));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleProductsFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleProductsFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteProducts = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('product/delete', async (id, { dispatch }) => {
  dispatch(deleteProductsStart());
  try {
    const response = await fetchApi(`/products/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteProductsSuccess(id));
      dispatch(fetchProductsList());
      toast.success('Products deleted successfuly');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteProductsFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteProductsFailure(error.message || 'Failed to delete products')
    );
    toast.error(error.message);
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart(state) {
      state.productsListState.loading = true;
      state.productsListState.error = null;
    },
    fetchProductsListSuccess(state, action) {
      state.productsListState.loading = false;
      const { data, totalCount } = action.payload;
      state.productsListState.data = data;
      state.productsListState.pagination.totalCount = totalCount;
      state.productsListState.error = null;
    },
    fetchProductsFailure(state, action) {
      state.productsListState.loading = false;
      state.productsListState.error = action.payload;
    },
    setProductsData(state, action) {
      state.singleProductsState.data = action.payload;
    },
    updateProductsData(state, action) {

      const oldData = state.singleProductsState.data;
      state.singleProductsState.data = { ...oldData, ...action.payload };
      // const keyFirst = Object.keys(action.payload)[0];

      // if (keyFirst.includes('.')) {
      //   const newData = { ...oldData };

      //   setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
      //   state.singleProductsState.data = newData;
      // } else {
      //   state.singleProductsState.data = {
      //     ...oldData,
      //     ...action.payload
      //   };
      // }
    },
    addEditProductsStart(state) {
      state.singleProductsState.loading = true;
      state.singleProductsState.error = null;
    },
    addEditProductsSuccess(state) {
      state.singleProductsState.loading = false;
      state.singleProductsState.error = null;
    },
    addEditProductsFailure(state, action) {
      state.singleProductsState.loading = false;
      state.singleProductsState.error = action.payload;
    },
    fetchSingleProductsStart(state) {
      state.singleProductsState.loading = true;
      state.singleProductsState.error = null;
    },
    fetchSingleProductsSuccess(state, action) {
      state.singleProductsState.loading = false;
      state.singleProductsState.data = action.payload;
      state.singleProductsState.error = null;
    },
    fetchSingleProductsFailure(state, action) {
      state.singleProductsState.loading = false;
      state.singleProductsState.error = action.payload;
    },
    deleteProductsStart(state) {
      state.singleProductsState.loading = true;
      state.singleProductsState.error = null;
    },
    deleteProductsSuccess(state, action) {
      state.singleProductsState.loading = false;
    },
    deleteProductsFailure(state, action) {
      state.singleProductsState.loading = false;
      state.singleProductsState.error = action.payload;
    }
  }
});

export const {
  fetchProductsStart,
  fetchProductsListSuccess,
  fetchProductsFailure,
  addEditProductsStart,
  addEditProductsSuccess,
  addEditProductsFailure,
  setProductsData,
  updateProductsData,
  fetchSingleProductsStart,
  fetchSingleProductsSuccess,
  fetchSingleProductsFailure,
  deleteProductsStart,
  deleteProductsFailure,
  deleteProductsSuccess
} = productsSlice.actions;

export default productsSlice.reducer;
