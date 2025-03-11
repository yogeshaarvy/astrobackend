import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type IBlogsCategory = BaseModel & {
  name?: string;
  slug?: string;
  sequence?: number;
  web?: {
    title: {
      en: string;
      hi: string;
    };
    description: {
      en?: string;
      hi?: string;
    };
    shortDescription: {
      en?: string;
      hi?: string;
    };
    active: boolean;
  };
};

const initialState = {
  blogsCategoryList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IBlogsCategory[]>,
  singleBlogsCategoryState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IBlogsCategory | null>,
  currentBlogsCategoryState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IBlogsCategory | null>
};

// Blogs Category Section
export const fetchBlogsCategoryList = createAsyncThunk<
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
  'blogs/fetchBlogsCategoryList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};
      dispatch(fetchBlogsCategoryListStart());
      const response = await fetchApi(
        `/blogs/category/all?page=${page}&limit=${pageSize}&field=${
          field || ''
        }&text=${keyword || ''}&active=${active || ''}&exportData=${
          exportData || false
        }`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchBlogsCategoryListSuccess({
              data: response.blogsCategoryList,
              totalCount: response.totalBlogsCategory
            })
          );
        } else {
          dispatch(fetchBlogsCategoryLoading(false));
        }

        // Always return the response data
        return response;
      } else {
        throw new Error('No status or invalid response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchBlogsCategoryListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditBlogsCategory = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('blogs/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      blogs: {
        singleBlogsCategoryState: { data }
      }
    } = getState();

    dispatch(addEditBlogsCategoryStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    console.log('dhbcjhasbcjhb', data);

    const formData = new FormData();
    const reqData: any = {
      name: data.name,
      slug: data.slug,
      sequence: data.sequence,
      web: data.web ? JSON.stringify(data.web) : undefined,
      active: data.active
    };

    console.log('jabscjabscjb', reqData);
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    let response;
    if (!entityId) {
      response = await fetchApi('/blogs/category/create', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/blogs/category/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }

    if (response?.success) {
      dispatch(addEditBlogsCategorySuccess());
      dispatch(fetchBlogsCategoryList());
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong!!';
      dispatch(addEditBlogsCategoryFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditBlogsCategoryFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const fetchSingleBlogsCategory = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'category/getsinglecategory',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleBlogsCategoryStart());
      const response = await fetchApi(`/blogs/category/get/${entityId}`, {
        method: 'GET'
      });

      if (response?.success) {
        dispatch(fetchSingleBlogsCategorySuccess(response.categoryData));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleBlogsCategoryFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleBlogsCategoryFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    fetchBlogsCategoryListStart(state) {
      state.blogsCategoryList.loading = true;
      state.blogsCategoryList.error = null;
    },
    fetchBlogsCategoryListSuccess(state, action) {
      state.blogsCategoryList.loading = false;
      const { data, totalCount } = action.payload;
      state.blogsCategoryList.data = data;
      state.blogsCategoryList.pagination.totalCount = totalCount;
      state.blogsCategoryList.error = null;
    },
    fetchBlogsCategoryListFailure(state, action) {
      state.blogsCategoryList.loading = false;
      state.blogsCategoryList.error = action.payload;
    },
    fetchBlogsCategoryLoading(state, action) {
      state.blogsCategoryList.loading = action.payload;
    },
    fetchSingleBlogsCategoryStart(state) {
      state.singleBlogsCategoryState.loading = true;
      state.singleBlogsCategoryState.error = null;
    },
    fetchSingleBlogsCategorySuccess(state, action) {
      state.singleBlogsCategoryState.loading = false;
      state.singleBlogsCategoryState.data = action.payload;
      state.singleBlogsCategoryState.error = null;
    },
    fetchSingleBlogsCategoryFailure(state, action) {
      state.singleBlogsCategoryState.loading = false;
      state.singleBlogsCategoryState.error = action.payload;
    },
    addEditBlogsCategoryStart(state) {
      state.singleBlogsCategoryState.loading = true;
      state.singleBlogsCategoryState.error = null;
    },
    addEditBlogsCategorySuccess(state) {
      state.singleBlogsCategoryState.loading = false;
      state.singleBlogsCategoryState.error = null;
    },
    addEditBlogsCategoryFailure(state, action) {
      state.singleBlogsCategoryState.loading = false;
      state.singleBlogsCategoryState.error = action.payload;
    },
    setBlogsCategoryData(state, action) {
      state.singleBlogsCategoryState.data = action.payload;
    },
    updateBlogsCategoryData(state, action) {
      const oldData = state.singleBlogsCategoryState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };

        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleBlogsCategoryState.data = newData;
      } else {
        state.singleBlogsCategoryState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  fetchBlogsCategoryListStart,
  fetchBlogsCategoryListSuccess,
  fetchBlogsCategoryListFailure,
  addEditBlogsCategoryStart,
  addEditBlogsCategorySuccess,
  addEditBlogsCategoryFailure,
  setBlogsCategoryData,
  updateBlogsCategoryData,
  fetchSingleBlogsCategoryStart,
  fetchSingleBlogsCategorySuccess,
  fetchSingleBlogsCategoryFailure,
  fetchBlogsCategoryLoading
} = blogsSlice.actions;
export default blogsSlice.reducer;
