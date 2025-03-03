import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';

export type ITag = BaseModel & {
  _id?: string;
  name?: string;
  active?: boolean;
};

const initialState = {
  tagListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<ITag[]>,
  singleTagState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ITag | null>,
  currentTagState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ITag | null>,
  changeTagPassword: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ITag | null>
};

export const fetchTagList = createAsyncThunk<
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
  'tag/fetchTagList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, status, exportData } =
        input || {};

      dispatch(fetchTagStart());
      const response = await fetchApi(
        `/tags/all?page=${page || 1}&limit=${pageSize || 10}&text=${
          keyword || ''
        }&field=${field || ''}&active=${status || ''}&export=${exportData}`,
        { method: 'GET' }
      );
      // Check if the API response is valid and has the expected data
      if (response?.success) {
        dispatch(
          fetchTagListSuccess({
            data: response.TagsData,
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
      dispatch(fetchTagFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const addEditTag = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('tag/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      tags: {
        singleTagState: { data }
      }
    } = getState();

    dispatch(addEditTagStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    const formData = new FormData();
    const reqData: any = {
      name: data.name,
      active: data.active
    };
    // Append only defined fields to FormData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    let response;
    if (!entityId) {
      response = await fetchApi('/tags/new', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/tags/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }
    if (response?.success) {
      dispatch(addEditTagSuccess());
      dispatch(fetchTagList());
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
      dispatch(addEditTagFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditTagFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});
export const fetchSingleTag = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('/cities/all', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    dispatch(fetchSingleTagStart());
    const response = await fetchApi(`/cities/all/${entityId}`, {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleTagSuccess(response?.tagdata));
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      dispatch(fetchSingleTagFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    let errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleTagFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const deleteTag = createAsyncThunk<any, string, { state: RootState }>(
  'tag/delete',
  async (id, { dispatch }) => {
    dispatch(deleteTagStart());
    try {
      const response = await fetchApi(`/tags/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        dispatch(deleteTagSuccess(id));
        dispatch(fetchTagList());
        toast.success('Tag deleted successfuly');
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        toast.error(errorMsg);
        dispatch(deleteTagFailure(errorMsg));
      }
    } catch (error: any) {
      dispatch(deleteTagFailure(error.message || 'Failed to delete tag'));
      toast.error(error.message);
    }
  }
);

const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    fetchTagStart(state) {
      state.tagListState.loading = true;
      state.tagListState.error = null;
    },
    fetchTagListSuccess(state, action) {
      state.tagListState.loading = false;
      const { data, totalCount } = action.payload;
      state.tagListState.data = data;
      state.tagListState.pagination.totalCount = totalCount;
      state.tagListState.error = null;
    },
    fetchTagFailure(state, action) {
      state.tagListState.loading = false;
      state.tagListState.error = action.payload;
    },
    setTagData(state, action) {
      state.singleTagState.data = action.payload;
    },
    updateTagData(state, action) {
      const oldData = state.singleTagState.data;
      state.singleTagState.data = { ...oldData, ...action.payload };
    },
    addEditTagStart(state) {
      state.singleTagState.loading = true;
      state.singleTagState.error = null;
    },
    addEditTagSuccess(state) {
      state.singleTagState.loading = false;
      state.singleTagState.error = null;
    },
    addEditTagFailure(state, action) {
      state.singleTagState.loading = false;
      state.singleTagState.error = action.payload;
    },
    fetchSingleTagStart(state) {
      state.singleTagState.loading = true;
      state.singleTagState.error = null;
    },
    fetchSingleTagSuccess(state, action) {
      state.singleTagState.loading = false;
      state.singleTagState.data = action.payload;
      state.singleTagState.error = null;
    },
    fetchSingleTagFailure(state, action) {
      state.singleTagState.loading = false;
      state.singleTagState.error = action.payload;
    },
    deleteTagStart(state) {
      state.singleTagState.loading = true;
      state.singleTagState.error = null;
    },
    deleteTagSuccess(state, action) {
      state.singleTagState.loading = false;
    },
    deleteTagFailure(state, action) {
      state.singleTagState.loading = false;
      state.singleTagState.error = action.payload;
    }
  }
});

export const {
  fetchTagStart,
  fetchTagListSuccess,
  fetchTagFailure,
  addEditTagStart,
  addEditTagSuccess,
  addEditTagFailure,
  setTagData,
  updateTagData,
  fetchSingleTagStart,
  fetchSingleTagSuccess,
  fetchSingleTagFailure,
  deleteTagStart,
  deleteTagFailure,
  deleteTagSuccess
} = tagSlice.actions;

export default tagSlice.reducer;
