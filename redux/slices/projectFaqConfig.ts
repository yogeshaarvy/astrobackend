import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IProjectFaqConfig = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
};

const initialState = {
  projectFaqConfigState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IProjectFaqConfig | null>
};

export const fetchProjectFaqConfig = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleProjectFaqConfigStart());

    const response = await fetchApi('/project_faq/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleProjectFaqConfigSuccess(response?.projectFaqConfig));

      console.log('fecthaboutProjectFaqConfig', response);
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleProjectFaqConfigFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleProjectFaqConfigFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditProjectFaqConfig = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditProjectFaqConfig',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        projectFaqConfig: {
          projectFaqConfigState: { data }
        }
      } = getState();

      dispatch(addEditProjectFaqConfigStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      console.log('The data value in the slice is:', data);

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        metaTitle: clonedData.metaTitle ? clonedData.metaTitle : undefined,
        metaDescription: clonedData.metaDescription
          ? clonedData.metaDescription
          : undefined,
        metaKeyword: clonedData.metaKeyword ? clonedData.metaKeyword : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/project_faq/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditProjectFaqConfigSuccess());
        dispatch(setProjectFaqConfig(null));
        dispatch(fetchProjectFaqConfig(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditProjectFaqConfigFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditProjectFaqConfigFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const projectFaqConfigSlice = createSlice({
  name: 'projectFaqConfig',
  initialState,
  reducers: {
    fetchProjectFaqConfigStart(state) {
      state.projectFaqConfigState.loading = true;
      state.projectFaqConfigState.error = null;
    },
    addEditProjectFaqConfigStart(state) {
      state.projectFaqConfigState.loading = true;
      state.projectFaqConfigState.error = null;
    },
    addEditProjectFaqConfigSuccess(state) {
      state.projectFaqConfigState.loading = false;
      state.projectFaqConfigState.error = null;
    },
    setProjectFaqConfig(state, action) {
      state.projectFaqConfigState.data = action.payload;
    },
    addEditProjectFaqConfigFailure(state, action) {
      state.projectFaqConfigState.loading = false;
      state.projectFaqConfigState.error = action.payload;
    },
    fetchSingleProjectFaqConfigStart(state) {
      state.projectFaqConfigState.loading = true;
      state.projectFaqConfigState.error = null;
    },
    fetchSingleProjectFaqConfigSuccess(state, action) {
      state.projectFaqConfigState.loading = false;
      state.projectFaqConfigState.data = action.payload;
      state.projectFaqConfigState.error = null;
    },
    fetchSingleProjectFaqConfigFailure(state, action) {
      state.projectFaqConfigState.loading = false;
      state.projectFaqConfigState.error = action.payload;
    },
    updateProjectFaqConfig(state, action) {
      const oldData = state.projectFaqConfigState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.projectFaqConfigState.data = newData;
      } else {
        state.projectFaqConfigState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditProjectFaqConfigStart,
  addEditProjectFaqConfigSuccess,
  addEditProjectFaqConfigFailure,
  setProjectFaqConfig,
  updateProjectFaqConfig,
  fetchSingleProjectFaqConfigStart,
  fetchSingleProjectFaqConfigSuccess,
  fetchSingleProjectFaqConfigFailure
} = projectFaqConfigSlice.actions;

export default projectFaqConfigSlice.reducer;
