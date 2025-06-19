import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { RootState } from '@/redux/store';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';

export type ISkills = BaseModel & {
  _id?: string;
  name?: {
    en?: string;
    hi?: string;
  };
  active?: boolean;
};

const initialState = {
  skillListState: {
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
  } as BaseState<ISkills | null>,
  currentSkillState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ISkills | null>,
  addEditSkillState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ISkills | null>
};

export const fetchSkillsList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field?: string;
    status?: string;
    active?: string;
    exportData?: string;
  } | void,
  { state: RootState }
>(
  'skill/fetchSkillsList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, status, exportData } =
        input || {};

      dispatch(fetchSkillStart());
      const response = await fetchApi(
        `/skills/all?page=${page || 1}&limit=${pageSize || 10}&text=${
          keyword || ''
        }&field=${field || ''}&active=${status || ''}&export=${
          exportData || ''
        }`,
        { method: 'GET' }
      );

      // Check if the API response is valid and has the expected data
      if (response?.success) {
        dispatch(
          fetchSkillListSuccess({
            data: response.SkillsData,
            totalCount: response.totalCount
          })
        );
        return response;
      } else {
        // Handle response with no success or an error
        const errorMsg = response?.message || 'Failed to fetch skills';
        dispatch(fetchSkillFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchSkillFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditSkills = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'skill/addEdit',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        skills: {
          singleSkillState: { data }
        }
      } = getState();

      dispatch(addEditSkillStart());

      if (!data) {
        const errorMsg = 'Please Provide Details';
        dispatch(addEditSkillFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }

      const formData = new FormData();
      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const reqData: any = {
        name: clonedData.name ? JSON.stringify(clonedData.name) : undefined,
        active: data.active
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        // Create new skill
        response = await fetchApi('/skills/new', {
          method: 'POST',
          body: formData
        });
      } else {
        // Update existing skill
        response = await fetchApi(`/skills/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        const successMsg = entityId
          ? 'Skills updated successfully'
          : 'Skills created successfully';

        dispatch(
          addEditSkillSuccess(response.skill || response.existingSkills)
        );
        dispatch(fetchSkillsList());
        toast.success(successMsg);
        return response;
      } else {
        const errorMsg = response?.message || 'Something Went Wrong!!';
        dispatch(addEditSkillFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditSkillFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleSkills = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'skill/fetchSingleSkills',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      if (!entityId) {
        const errorMsg = 'Skill ID is required';
        dispatch(fetchSingleSkillFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }

      dispatch(fetchSingleSkillStart());
      const response = await fetchApi(`/skills/single/${entityId}`, {
        method: 'GET'
      });

      if (response?.success) {
        dispatch(fetchSingleSkillSuccess(response?.skilldata));
        return response;
      } else {
        const errorMsg = response?.message || 'No Skill found';
        dispatch(fetchSingleSkillFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleSkillFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteSkills = createAsyncThunk<any, string, { state: RootState }>(
  'skill/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      if (!id) {
        const errorMsg = 'Skill ID is required';
        dispatch(deleteSkillFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }

      dispatch(deleteSkillStart());
      const response = await fetchApi(`/skills/delete/${id}`, {
        method: 'DELETE'
      });

      if (response?.success) {
        dispatch(deleteSkillSuccess(id));
        dispatch(fetchSkillsList());
        toast.success('Skills deleted successfully');
        return response;
      } else {
        const errorMsg = response?.message || 'Skills not found';
        dispatch(deleteSkillFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to delete skill';
      dispatch(deleteSkillFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const skillSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    fetchSkillStart(state) {
      state.skillListState.loading = true;
      state.skillListState.error = null;
    },
    fetchSkillListSuccess(state, action) {
      state.skillListState.loading = false;
      const { data, totalCount } = action.payload;
      state.skillListState.data = data;
      state.skillListState.pagination.totalCount = totalCount;
      state.skillListState.error = null;
    },
    fetchSkillFailure(state, action) {
      state.skillListState.loading = false;
      state.skillListState.error = action.payload;
    },
    setSkillData(state, action) {
      state.singleSkillState.data = action.payload;
    },
    updateSkillData(state, action) {
      const oldData = state.singleSkillState.data;
      state.singleSkillState.data = { ...oldData, ...action.payload };
    },
    clearSkillData(state) {
      state.singleSkillState.data = null;
      state.singleSkillState.error = null;
    },
    addEditSkillStart(state) {
      state.addEditSkillState.loading = true;
      state.addEditSkillState.error = null;
    },
    addEditSkillSuccess(state, action) {
      state.addEditSkillState.loading = false;
      state.addEditSkillState.data = action.payload;
      state.addEditSkillState.error = null;
      // Clear the form data after successful submission
      state.singleSkillState.data = null;
    },
    addEditSkillFailure(state, action) {
      state.addEditSkillState.loading = false;
      state.addEditSkillState.error = action.payload;
    },
    fetchSingleSkillStart(state) {
      state.singleSkillState.loading = true;
      state.singleSkillState.error = null;
    },
    fetchSingleSkillSuccess(state, action) {
      state.singleSkillState.loading = false;
      state.singleSkillState.data = action.payload;
      state.singleSkillState.error = null;
    },
    fetchSingleSkillFailure(state, action) {
      state.singleSkillState.loading = false;
      state.singleSkillState.error = action.payload;
    },
    deleteSkillStart(state) {
      state.skillListState.loading = true;
      state.skillListState.error = null;
    },
    deleteSkillSuccess(state, action) {
      state.skillListState.loading = false;
      // Remove the deleted skill from the list
      state.skillListState.data = (state.skillListState.data ?? []).filter(
        (skill: ISkills) => skill._id !== action.payload
      );
      state.skillListState.pagination.totalCount -= 1;
    },
    deleteSkillFailure(state, action) {
      state.skillListState.loading = false;
      state.skillListState.error = action.payload;
    }
  }
});

export const {
  fetchSkillStart,
  fetchSkillListSuccess,
  fetchSkillFailure,
  addEditSkillStart,
  addEditSkillSuccess,
  addEditSkillFailure,
  setSkillData,
  updateSkillData,
  clearSkillData,
  fetchSingleSkillStart,
  fetchSingleSkillSuccess,
  fetchSingleSkillFailure,
  deleteSkillStart,
  deleteSkillFailure,
  deleteSkillSuccess
} = skillSlice.actions;

export default skillSlice.reducer;
