import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { cloneDeep } from 'lodash';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IBrand = BaseModel & {
  _id?: string;
  name?: {
    en: string;
    hi: string;
  };
  logo_image?: string;
  banner_image?: string;
  short_description?: {
    en: string;
    hi: string;
  };
  long_description?: {
    en: string;
    hi: string;
  };
  active?: boolean;
  sequence?: number;
  meta_title?: string;
  meta_description?: string;
  meta_tag?: string;
  slug?: string;
};
const initialState = {
  brandListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IBrand[]>,
  singleBrandState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IBrand | null>,
  currentBrandState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IBrand | null>,
  changeBrandPassword: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IBrand | null>
};

export const fetchBrandList = createAsyncThunk<
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
  'brand/fetchBrandList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, status, exportData } =
        input || {};

      dispatch(fetchBrandStart());
      const response = await fetchApi(
        `/store/brands/all?page=${page || 1}&limit=${pageSize || 10}&text=${
          keyword || ''
        }&field=${field || ''}&active=${status || ''}&export=${exportData}`,
        { method: 'GET' }
      );

      // Check if the API response is valid and has the expected data
      if (response?.success) {
        dispatch(
          fetchBrandListSuccess({
            data: response.brand,
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
      dispatch(fetchBrandFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const addEditBrand = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('brand/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      brand: {
        singleBrandState: { data }
      }
    } = getState();

    dispatch(addEditBrandStart());

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
      short_description: clonedData.short_description
        ? JSON.stringify(clonedData.short_description)
        : undefined,
      long_description: clonedData.long_description
        ? JSON.stringify(clonedData.long_description)
        : undefined,
      logo_image: data.logo_image,
      banner_image: data.banner_image,
      meta_tag: data.meta_tag,
      meta_description: data.meta_description,
      meta_title: data.meta_title,
      active: data.active,
      slug: data.slug,
      sequence: data.sequence
    };
    // Append only defined fields to FormData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    let response;
    if (!entityId) {
      response = await fetchApi('/store/brands/new', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/store/brands/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }
    if (response?.success) {
      dispatch(addEditBrandSuccess());
      dispatch(fetchBrandList());
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
      dispatch(addEditBrandFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditBrandFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});
export const fetchSingleBrand = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'brands/getsinglebrand',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleBrandStart());
      const response = await fetchApi(`/store/brands/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleBrandSuccess(response?.brand));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleBrandFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleBrandFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteBrand = createAsyncThunk<any, string, { state: RootState }>(
  'brand/delete',
  async (id, { dispatch }) => {
    dispatch(deleteBrandStart());
    try {
      const response = await fetchApi(`/store/brands/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        dispatch(deleteBrandSuccess(id));
        dispatch(fetchBrandList());
        toast.success('Brand deleted successfuly');
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        toast.error(errorMsg);
        dispatch(deleteBrandFailure(errorMsg));
      }
    } catch (error: any) {
      dispatch(deleteBrandFailure(error.message || 'Failed to delete brand'));
      toast.error(error.message);
    }
  }
);

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    fetchBrandStart(state) {
      state.brandListState.loading = true;
      state.brandListState.error = null;
    },
    fetchBrandListSuccess(state, action) {
      state.brandListState.loading = false;
      const { data, totalCount } = action.payload;
      state.brandListState.data = data;
      state.brandListState.pagination.totalCount = totalCount;
      state.brandListState.error = null;
    },
    fetchBrandFailure(state, action) {
      state.brandListState.loading = false;
      state.brandListState.error = action.payload;
    },
    setBrandData(state, action) {
      state.singleBrandState.data = action.payload;
    },
    updateBrandData(state, action) {
      const oldData = state.singleBrandState.data;

      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);

        state.singleBrandState.data = newData;
      } else {
        state.singleBrandState.data = { ...oldData, ...action.payload };
      }
    },
    addEditBrandStart(state) {
      state.singleBrandState.loading = true;
      state.singleBrandState.error = null;
    },
    addEditBrandSuccess(state) {
      state.singleBrandState.loading = false;
      state.singleBrandState.error = null;
    },
    addEditBrandFailure(state, action) {
      state.singleBrandState.loading = false;
      state.singleBrandState.error = action.payload;
    },
    fetchSingleBrandStart(state) {
      state.singleBrandState.loading = true;
      state.singleBrandState.error = null;
    },
    fetchSingleBrandSuccess(state, action) {
      state.singleBrandState.loading = false;
      state.singleBrandState.data = action.payload;
      state.singleBrandState.error = null;
    },
    fetchSingleBrandFailure(state, action) {
      state.singleBrandState.loading = false;
      state.singleBrandState.error = action.payload;
    },
    deleteBrandStart(state) {
      state.singleBrandState.loading = true;
      state.singleBrandState.error = null;
    },
    deleteBrandSuccess(state, action) {
      state.singleBrandState.loading = false;
    },
    deleteBrandFailure(state, action) {
      state.singleBrandState.loading = false;
      state.singleBrandState.error = action.payload;
    }
  }
});

export const {
  fetchBrandStart,
  fetchBrandListSuccess,
  fetchBrandFailure,
  addEditBrandStart,
  addEditBrandSuccess,
  addEditBrandFailure,
  setBrandData,
  updateBrandData,
  fetchSingleBrandStart,
  fetchSingleBrandSuccess,
  fetchSingleBrandFailure,
  deleteBrandStart,
  deleteBrandFailure,
  deleteBrandSuccess
} = brandSlice.actions;

export default brandSlice.reducer;
