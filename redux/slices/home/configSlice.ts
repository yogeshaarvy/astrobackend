import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { fetchApi } from '@/services/utlis/fetchApi';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IConfig = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  name?: string;
};

const initialState = {
  configState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IConfig | null>
};

export const fetchConfig = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('config/fetchConfig', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchConfigStart());

    const response = await fetchApi('/config/get', {
      method: 'GET'
    });

    if (response?.success) {
      dispatch(fetchConfigSuccess(response?.data));
      return response.data;
    } else {
      const errorMsg = response?.message ?? 'Failed to fetch configs!';
      dispatch(fetchConfigFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Failed to fetch configs!';
    dispatch(fetchConfigFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditConfigPage = createAsyncThunk<
  any,
  null,
  { state: RootState }
>('config/configpage', async (_, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      configs: {
        configState: { data }
      }
    } = getState();

    dispatch(addEditConfigPageStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    let clonedData = cloneDeep(data);

    if (clonedData) {
      clonedData = await processNestedFields(clonedData);
    }

    // Prepare FormData
    const formData = new FormData();
    const reqData: any = {
      metaTitle: clonedData.metaTitle,
      metaDescription: clonedData.metaDescription,
      metaKeyword: clonedData.metaKeyword,
      name: clonedData.name
    };
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    let response = await fetchApi('/config/createorupdate', {
      method: 'POST',
      body: formData
    });

    if (response?.success) {
      dispatch(addEditConfigSuccess());
      dispatch(setConfig(null));
      dispatch(fetchConfig(null));
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong!';
      dispatch(addEditConfigFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!';
    dispatch(addEditConfigFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    addEditConfigPageStart(state) {
      state.configState.loading = true;
      state.configState.error = null;
    },
    addEditConfigSuccess(state) {
      state.configState.loading = false;
      state.configState.error = null;
    },
    addEditConfigFailure(state, action) {
      state.configState.loading = false;
      state.configState.error = action.payload;
    },
    setConfig(state, action) {
      state.configState.data = action.payload;
    },
    fetchConfigStart(state) {
      state.configState.loading = true;
      state.configState.error = null;
    },
    fetchConfigSuccess(state, action) {
      state.configState.loading = false;
      state.configState.data = action.payload;
      state.configState.error = null;
    },
    fetchConfigFailure(state, action) {
      state.configState.loading = false;
      state.configState.error = action.payload;
    },
    updateConfig(state, action) {
      const oldData = state.configState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.configState.data = newData;
      } else {
        state.configState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditConfigFailure,
  addEditConfigPageStart,
  addEditConfigSuccess,
  setConfig,
  fetchConfigStart,
  fetchConfigSuccess,
  fetchConfigFailure,
  updateConfig
} = configSlice.actions;

export default configSlice.reducer;
