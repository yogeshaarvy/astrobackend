import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { RootState } from '@/redux/store';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type ICategory = BaseModel & {
  _id?: string;
  name?: {
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
    field: string;
    status: string;
    exportData: string;
    entityId: string;
  } | void,
  { state: RootState }
>(
  'category/fetchCategoryList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, status, exportData, entityId } =
        input || {};
      dispatch(fetchCategoryStart());
      const response = await fetchApi(
        `/store/category/all?page=${page || 1}&limit=${pageSize || 10}&text=${
          keyword || ''
        }&field=${field || ''}&active=${
          status || ''
        }&export=${exportData}&entityId=${entityId || ''}`,
        { method: 'GET' }
      );
      // Check if the API response is valid and has the expected data
      if (response?.success) {
        dispatch(
          fetchCategoryListSuccess({
            data: response.categoriesdata,
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
    // let childdata = (data?.child as ICategory) === 'yes' ? 1 : 0
    const formData = new FormData();
    const reqData: any = {
      name: data.name ? JSON.stringify(data.name) : undefined,
      short_description: JSON.stringify(data.short_description),
      long_description: JSON.stringify(data.long_description),
      light_logo_image: data.light_logo_image,
      dark_logo_image: data.dark_logo_image,
      banner_image: data.banner_image,
      meta_tag: data.meta_tag,
      meta_description: data.meta_description,
      meta_title: data.meta_title,
      active: data.active,
      slug: data.slug,
      sequence: data.sequence,
      child: data.child,
      show_in_menu: data.show_in_menu,
      show_in_home: data.show_in_home,
      tags:
        typeof data?.tags === 'object' && data?.tags !== null
          ? data.tags?._id
          : data.tags,
      parent:
        typeof data?.parent === 'object' && data?.parent !== null
          ? data.parent?._id
          : data.parent
    };

    // Append only defined fields to FormData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    let response;
    if (!entityId) {
      response = await fetchApi('/store/category/new', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/store/category/update/${entityId}`, {
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
      const response = await fetchApi(`/store/category/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        response.category.parent = response.category.parent._id;
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
    const response = await fetchApi(`/store/category/delete/${id}`, {
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
