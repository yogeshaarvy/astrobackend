import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type IProjectfaq = BaseModel & {
  question?: {
    en?: string;
    hi?: string;
  };
  answer?: {
    en?: string;
    hi?: string;
  };
  sequence?: number;
  active?: boolean;
};

const initialState = {
  projectfaqList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IProjectfaq[]>,
  singleProjectfaqState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IProjectfaq | null>
};

export const addEditProjectfaqList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'home/addEditProjectfaqList',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        projectfaq: {
          singleProjectfaqState: { data }
        }
      } = getState();

      dispatch(addEditProjectfaqListStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        question: clonedData.question
          ? JSON.stringify(clonedData.question)
          : undefined,
        answer: clonedData.answer
          ? JSON.stringify(clonedData.answer)
          : undefined,
        sequence: clonedData.sequence,
        active: clonedData.active
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/project_faq/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/project_faq/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditProjectfaqListSuccess());
        dispatch(fetchProjectfaqList());
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditProjectfaqListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditProjectfaqListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchProjectfaqList = createAsyncThunk<
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
  'home/fetchProjectfaqList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};
      dispatch(fetchProjectfaqListStart());

      const response = await fetchApi(
        `/project_faq/all?page=${page || 1}&limit=${pageSize || 10}&field=${
          field || ''
        }&text=${keyword || ''}&active=${active || ''}&exportData=${
          exportData || false
        }`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchProjectfaqListSuccess({
              data: response.projectFaq,
              totalCount: response.totalProjectFaqCount
            })
          );
        } else {
          dispatch(fetchProjectfaqExportLoading(false));
        }

        return response;
      } else {
        throw new Error('No Status Or Invalid Response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchProjectfaqListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleProjectfaqList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'home/fetchSingleProjectfaq',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleProjectfaqListStart());
      const response = await fetchApi(`/project_faq/get/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleProjectfaqListSuccess(response?.projectfaq));

        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchSingleProjectfaqListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleProjectfaqListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteProjectfaq = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('brand/delete', async (id, { dispatch }) => {
  dispatch(deleteProjectfaqStart());
  try {
    const response = await fetchApi(`/project_faq/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteProjectfaqSuccess(id));
      dispatch(fetchProjectfaqList());
      toast.success('Slider deleted successfuly');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteProjectfaqFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteProjectfaqFailure(error.message || 'Failed to delete slider')
    );
    toast.error(error.message);
  }
});

const projectfaqSlice = createSlice({
  name: 'projectfaq',
  initialState,
  reducers: {
    setProjectfaqListData(state, action) {
      state.singleProjectfaqState.data = action.payload;
    },
    updateProjectfaqListData(state, action) {
      const oldData = state.singleProjectfaqState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleProjectfaqState.data = newData;
      } else {
        state.singleProjectfaqState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditProjectfaqListStart(state) {
      state.singleProjectfaqState.loading = true;
      state.singleProjectfaqState.error = null;
    },
    addEditProjectfaqListSuccess(state) {
      state.singleProjectfaqState.loading = false;
      state.singleProjectfaqState.error = null;
    },
    addEditProjectfaqListFailure(state, action) {
      state.singleProjectfaqState.loading = false;
      state.singleProjectfaqState.error = action.payload;
    },
    fetchProjectfaqListStart(state) {
      state.projectfaqList.loading = true;
      state.projectfaqList.error = null;
    },
    fetchProjectfaqListSuccess(state, action) {
      state.projectfaqList.loading = false;
      const { data, totalCount } = action.payload;
      state.projectfaqList.data = data;
      state.projectfaqList.pagination.totalCount = totalCount;
      state.projectfaqList.error = null;
    },
    fetchProjectfaqListFailure(state, action) {
      state.projectfaqList.loading = false;
      state.projectfaqList.error = action.payload;
    },
    fetchSingleProjectfaqListStart(state) {
      state.singleProjectfaqState.loading = true;
      state.singleProjectfaqState.error = null;
    },
    fetchSingleProjectfaqListFailure(state, action) {
      state.singleProjectfaqState.loading = false;
      state.singleProjectfaqState.data = action.payload;
    },
    fetchSingleProjectfaqListSuccess(state, action) {
      state.singleProjectfaqState.loading = false;
      state.singleProjectfaqState.data = action.payload;
      state.singleProjectfaqState.error = null;
    },
    deleteProjectfaqStart(state) {
      state.singleProjectfaqState.loading = true;
      state.singleProjectfaqState.error = null;
    },
    deleteProjectfaqSuccess(state, action) {
      state.singleProjectfaqState.loading = false;
    },
    deleteProjectfaqFailure(state, action) {
      state.singleProjectfaqState.loading = false;
      state.singleProjectfaqState.error = action.payload;
    },
    fetchProjectfaqExportLoading(state, action) {
      state.projectfaqList.loading = action.payload;
    }
  }
});

export const {
  setProjectfaqListData,
  fetchProjectfaqExportLoading,
  fetchProjectfaqListFailure,
  fetchProjectfaqListStart,
  fetchProjectfaqListSuccess,
  fetchSingleProjectfaqListFailure,
  fetchSingleProjectfaqListStart,
  fetchSingleProjectfaqListSuccess,
  addEditProjectfaqListFailure,
  addEditProjectfaqListStart,
  addEditProjectfaqListSuccess,
  deleteProjectfaqStart,
  deleteProjectfaqSuccess,
  updateProjectfaqListData,
  deleteProjectfaqFailure
} = projectfaqSlice.actions;

export default projectfaqSlice.reducer;
