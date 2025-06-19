import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type ISkills = BaseModel & {
  name?: {
    en?: string;
    hi?: string;
  };
  sequence?: number;
  active?: boolean;
};

const initialState = {
  SkillsList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<ISkills[]>,
  singleSkillState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ISkills | null>
};

export const addEditSkillsList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'skills/addEditSkillsList',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        skills: {
          singleSkillState: { data }
        }
      } = getState();

      dispatch(addEditSkillsListStart());

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
        response = await fetchApi('/skills/new', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/skills/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditSkillsListSuccess());
        dispatch(fetchSkillsList());
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditSkillsListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditSkillsListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSkillsList = createAsyncThunk<
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
  'skills/fetchSkillsList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};
      dispatch(fetchSkillsListStart());

      const response = await fetchApi(
        `/skills/all?page=${page || 1}&limit=${pageSize || 10}&field=${
          field || ''
        }&text=${keyword || ''}&active=${active || ''}&exportData=${
          exportData || false
        }`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchSkillsListSuccess({
              data: response.skills,
              totalCount: response.totalSkillsCount
            })
          );
        } else {
          dispatch(fetchSkillsExportLoading(false));
        }

        return response;
      } else {
        throw new Error('No Status Or Invalid Response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchSkillsListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleSkillsList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'skills/fetchSingleSkills',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleSkillsListStart());
      const response = await fetchApi(`/skills/single/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleSkillsListSuccess(response?.skills));

        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchSingleSkillsListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleSkillsListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteSkills = createAsyncThunk<any, string, { state: RootState }>(
  'skills/delete',
  async (id, { dispatch }) => {
    dispatch(deleteSkillsStart());
    try {
      const response = await fetchApi(`/skills/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        dispatch(deleteSkillsSuccess(id));
        dispatch(fetchSkillsList());
        toast.success('Skill deleted successfully');
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        toast.error(errorMsg);
        dispatch(deleteSkillsFailure(errorMsg));
      }
    } catch (error: any) {
      dispatch(deleteSkillsFailure(error.message || 'Failed to delete skill'));
      toast.error(error.message);
    }
  }
);

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    setSkillsListData(state, action) {
      state.singleSkillState.data = action.payload;
    },
    updateSkillsListData(state, action) {
      const oldData = state.singleSkillState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleSkillState.data = newData;
      } else {
        state.singleSkillState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditSkillsListStart(state) {
      state.singleSkillState.loading = true;
      state.singleSkillState.error = null;
    },
    addEditSkillsListSuccess(state) {
      state.singleSkillState.loading = false;
      state.singleSkillState.error = null;
    },
    addEditSkillsListFailure(state, action) {
      state.singleSkillState.loading = false;
      state.singleSkillState.error = action.payload;
    },
    fetchSkillsListStart(state) {
      state.SkillsList.loading = true;
      state.SkillsList.error = null;
    },
    fetchSkillsListSuccess(state, action) {
      state.SkillsList.loading = false;
      const { data, totalCount } = action.payload;
      state.SkillsList.data = data;
      state.SkillsList.pagination.totalCount = totalCount;
      state.SkillsList.error = null;
    },
    fetchSkillsListFailure(state, action) {
      state.SkillsList.loading = false;
      state.SkillsList.error = action.payload;
    },
    fetchSingleSkillsListStart(state) {
      state.singleSkillState.loading = true;
      state.singleSkillState.error = null;
    },
    fetchSingleSkillsListFailure(state, action) {
      state.singleSkillState.loading = false;
      state.singleSkillState.error = action.payload;
    },
    fetchSingleSkillsListSuccess(state, action) {
      state.singleSkillState.loading = false;
      state.singleSkillState.data = action.payload;
      state.singleSkillState.error = null;
    },
    deleteSkillsStart(state) {
      state.singleSkillState.loading = true;
      state.singleSkillState.error = null;
    },
    deleteSkillsSuccess(state, action) {
      state.singleSkillState.loading = false;
    },
    deleteSkillsFailure(state, action) {
      state.singleSkillState.loading = false;
      state.singleSkillState.error = action.payload;
    },
    fetchSkillsExportLoading(state, action) {
      state.SkillsList.loading = action.payload;
    }
  }
});

export const {
  setSkillsListData,
  fetchSkillsExportLoading,
  fetchSkillsListFailure,
  fetchSkillsListStart,
  fetchSkillsListSuccess,
  fetchSingleSkillsListFailure,
  fetchSingleSkillsListStart,
  fetchSingleSkillsListSuccess,
  addEditSkillsListFailure,
  addEditSkillsListStart,
  addEditSkillsListSuccess,
  deleteSkillsStart,
  deleteSkillsSuccess,
  updateSkillsListData,
  deleteSkillsFailure
} = skillsSlice.actions;

export default skillsSlice.reducer;
