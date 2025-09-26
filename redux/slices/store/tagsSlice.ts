import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type ITag = BaseModel & {
  name?: {
    en?: string;
    hi?: string;
  };
  active?: boolean;
  _id?: string;
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
  } as BaseState<ITag | null>
};

export const addEditTag = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'tags/addEditTag',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
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

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        name: clonedData.name ? JSON.stringify(clonedData.name) : undefined,
        active: clonedData.active
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/store/tags/new', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/store/tags/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditTagSuccess());
        dispatch(fetchTagList());
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditTagFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditTagFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchTagList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field?: string;
    active?: string | boolean;
    exportData?: string | boolean;
  } | void,
  { state: RootState }
>(
  'tags/fetchTagList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};
      dispatch(fetchTagListStart());

      const response = await fetchApi(
        `/store/tags/all?page=${page || 1}&limit=${pageSize || 10}&field=${
          field || ''
        }&text=${keyword || ''}&active=${active || ''}&exportData=${
          exportData || false
        }`,
        { method: 'GET' }
      );

      if (response?.success) {
        dispatch(
          fetchTagListSuccess({
            data: response.TagsData,
            totalCount: response.totalCount
          })
        );
      }

      return response;
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchTagListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleTag = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'tags/fetchSingleTag',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleTagStart());
      const response = await fetchApi(`/store/tags/single/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleTagSuccess(response?.tag));

        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchSingleTagFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleTagFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteTag = createAsyncThunk<any, string, { state: RootState }>(
  'tags/deleteTag',
  async (id, { dispatch }) => {
    dispatch(deleteTagStart());
    try {
      const response = await fetchApi(`/store/tags/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        dispatch(deleteTagSuccess(id));
        dispatch(fetchTagList());
        toast.success('Tag deleted successfully');
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
    setTagData(state, action) {
      state.singleTagState.data = action.payload;
    },
    updateTagData(state, action) {
      const oldData = state.singleTagState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleTagState.data = newData;
      } else {
        state.singleTagState.data = {
          ...oldData,
          ...action.payload
        };
      }
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
    fetchTagListStart(state) {
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
    fetchTagListFailure(state, action) {
      state.tagListState.loading = false;
      state.tagListState.error = action.payload;
    },
    fetchSingleTagStart(state) {
      state.singleTagState.loading = true;
      state.singleTagState.error = null;
    },
    fetchSingleTagFailure(state, action) {
      state.singleTagState.loading = false;
      state.singleTagState.error = action.payload;
    },
    fetchSingleTagSuccess(state, action) {
      state.singleTagState.loading = false;
      state.singleTagState.data = action.payload;
      state.singleTagState.error = null;
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
    },
    fetchTagExportLoading(state, action) {
      state.tagListState.loading = action.payload;
    }
  }
});

export const {
  setTagData,
  fetchTagExportLoading,
  fetchTagListFailure,
  fetchTagListStart,
  fetchTagListSuccess,
  fetchSingleTagFailure,
  fetchSingleTagStart,
  fetchSingleTagSuccess,
  addEditTagFailure,
  addEditTagStart,
  addEditTagSuccess,
  deleteTagStart,
  deleteTagSuccess,
  updateTagData,
  deleteTagFailure
} = tagSlice.actions;

export default tagSlice.reducer;
