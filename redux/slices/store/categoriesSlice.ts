import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { RootState } from '@/redux/store';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';

export type ICategory = BaseModel & {
  _id?: string;
  name?: string;
  title?: {
    en?: string;
    hi?: string;
  };
  light_logo_image?: string;
  dark_logo_image?: string;
  banner_image?: string;
  short_description?: {
    en?: string;
    hi?: string;
  };
  long_description?: {
    en?: string;
    hi?: string;
  };
  active?: boolean;
  sequence?: number;
  meta_title?: string;
  meta_description?: string;
  meta_tag?: string;
  slug?: string;
  child?: string;
  parent?: any;
  show_in_menu?: boolean;
  show_in_home?: boolean;
  tags?: any;
};
const initialState = {
  categoryListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<ICategory[]>,
  singleCategoryState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ICategory | null>,
  currentCategoryState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ICategory | null>,
  changeCategoryPassword: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ICategory | null>
};

export const fetchCategoryList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field?: string;
    active?: string;
    exportData?: boolean;
    entityId?: string;
  } | void,
  { state: RootState }
>(
  'category/fetchCategoryList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData, entityId } =
        input || {};
      dispatch(fetchCategoryStart());
      const response = await fetchApi(
        `/store/categories/all?page=${page || 1}&limit=${pageSize || 10}&text=${
          keyword || ''
        }&field=${field || ''}&active=${
          active || ''
        }&export=${exportData}&entityId=${entityId || ''}`,
        { method: 'GET' }
      );
      // Check if the API response is valid and has the expected data
      if (response?.success) {
        dispatch(
          fetchCategoryListSuccess({
            data: response.categoryList,
            totalCount: response.totalCount
          })
        );
      } else {
        // Handle response with no active or an error
        throw new Error('No active or invalid response');
      }
      return response;
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchCategoryFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const addEditCategory = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('category/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      category: {
        singleCategoryState: { data }
      }
    } = getState();

    dispatch(addEditCategoryStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    let clonedData = cloneDeep(data);

    if (clonedData) {
      clonedData = await processNestedFields(clonedData);
    }

    const formData = new FormData();
    const reqData: any = {
      name: clonedData.name,
      title: clonedData.title ? JSON.stringify(clonedData.title) : undefined,
      short_description: JSON.stringify(clonedData.short_description),
      long_description: JSON.stringify(clonedData.long_description),
      light_logo_image: clonedData.light_logo_image,
      dark_logo_image: clonedData.dark_logo_image,
      banner_image: clonedData.banner_image,
      meta_tag: clonedData.meta_tag,
      meta_description: clonedData.meta_description,
      meta_title: clonedData.meta_title,
      active: clonedData.active,
      slug: clonedData.slug,
      sequence: clonedData.sequence,
      child: clonedData.child,
      show_in_menu: clonedData.show_in_menu,
      show_in_home: clonedData.show_in_home,
      tags:
        typeof clonedData?.tags === 'object' && clonedData?.tags !== null
          ? clonedData.tags?._id
          : clonedData.tags,
      parent:
        typeof clonedData?.parent === 'object' && clonedData?.parent !== null
          ? clonedData.parent?._id
          : clonedData.parent
    };
    // Append only defined fields to FormData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    let response;
    if (!entityId) {
      response = await fetchApi('/store/categories/new', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/store/categories/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }
    if (response?.success) {
      dispatch(addEditCategorySuccess());
      dispatch(fetchCategoryList());
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
      dispatch(addEditCategoryFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditCategoryFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});
export const fetchSingleCategory = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'category/getsinglecategory',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleCategoryStart());
      const response = await fetchApi(`/store/categories/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleCategorySuccess(response?.category));
        return response.category;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleCategoryFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleCategoryFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteCategory = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('category/delete', async (id, { dispatch }) => {
  dispatch(deleteCategoryStart());
  try {
    const response = await fetchApi(`/store/categories/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteCategorySuccess(id));
      dispatch(fetchCategoryList());
      toast.success('Category deleted successfuly');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteCategoryFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteCategoryFailure(error.message || 'Failed to delete category')
    );
    toast.error(error.message);
  }
});

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    fetchCategoryStart(state) {
      state.categoryListState.loading = true;
      state.categoryListState.error = null;
    },
    fetchCategoryListSuccess(state, action) {
      state.categoryListState.loading = false;
      const { data, totalCount } = action.payload;
      state.categoryListState.data = data;
      state.categoryListState.pagination.totalCount = totalCount;
      state.categoryListState.error = null;
    },
    fetchCategoryFailure(state, action) {
      state.categoryListState.loading = false;
      state.categoryListState.error = action.payload;
    },
    setCategoryData(state, action) {
      state.singleCategoryState.data = action.payload;
    },
    updateCategoryData(state, action) {
      const oldData = state.singleCategoryState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleCategoryState.data = newData;
      } else {
        state.singleCategoryState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditCategoryStart(state) {
      state.singleCategoryState.loading = true;
      state.singleCategoryState.error = null;
    },
    addEditCategorySuccess(state) {
      state.singleCategoryState.loading = false;
      state.singleCategoryState.error = null;
    },
    addEditCategoryFailure(state, action) {
      state.singleCategoryState.loading = false;
      state.singleCategoryState.error = action.payload;
    },
    fetchSingleCategoryStart(state) {
      state.singleCategoryState.loading = true;
      state.singleCategoryState.error = null;
    },
    fetchSingleCategorySuccess(state, action) {
      state.singleCategoryState.loading = false;
      state.singleCategoryState.data = action.payload;
      state.singleCategoryState.error = null;
    },
    fetchSingleCategoryFailure(state, action) {
      state.singleCategoryState.loading = false;
      state.singleCategoryState.error = action.payload;
    },
    deleteCategoryStart(state) {
      state.singleCategoryState.loading = true;
      state.singleCategoryState.error = null;
    },
    deleteCategorySuccess(state, action) {
      state.singleCategoryState.loading = false;
    },
    deleteCategoryFailure(state, action) {
      state.singleCategoryState.loading = false;
      state.singleCategoryState.error = action.payload;
    }
  }
});

export const {
  fetchCategoryStart,
  fetchCategoryListSuccess,
  fetchCategoryFailure,
  addEditCategoryStart,
  addEditCategorySuccess,
  addEditCategoryFailure,
  setCategoryData,
  updateCategoryData,
  fetchSingleCategoryStart,
  fetchSingleCategorySuccess,
  fetchSingleCategoryFailure,
  deleteCategoryStart,
  deleteCategoryFailure,
  deleteCategorySuccess
} = categorySlice.actions;

export default categorySlice.reducer;
