import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { fetchApi } from '@/services/utlis/fetchApi';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IStoreconfig = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  name?: string;
};

const initialState = {
  storeconfigState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IStoreconfig | null>
};

export const fetchStoreconfig = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('storeconfig/fetchStoreconfig', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchStoreconfigStart());

    const response = await fetchApi('/storeconfig/get', {
      method: 'GET'
    });

    if (response?.success) {
      dispatch(fetchStoreconfigSuccess(response?.data));
      return response.data;
    } else {
      const errorMsg = response?.message ?? 'Failed to fetch configs!';
      dispatch(fetchStoreconfigFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Failed to fetch configs!';
    dispatch(fetchStoreconfigFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditStoreconfigPage = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'storeconfig/configpage',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        storeconfigs: {
          storeconfigState: { data }
        }
      } = getState();

      dispatch(addEditStoreconfigPageStart());

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

      let response = await fetchApi('/storeconfig/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditStoreconfigSuccess());
        dispatch(setStoreconfig(null));
        dispatch(fetchStoreconfig(null));
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong!';
        dispatch(addEditStoreconfigFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!';
      dispatch(addEditStoreconfigFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

const storeconfigSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    addEditStoreconfigPageStart(state) {
      state.storeconfigState.loading = true;
      state.storeconfigState.error = null;
    },
    addEditStoreconfigSuccess(state) {
      state.storeconfigState.loading = false;
      state.storeconfigState.error = null;
    },
    addEditStoreconfigFailure(state, action) {
      state.storeconfigState.loading = false;
      state.storeconfigState.error = action.payload;
    },
    setStoreconfig(state, action) {
      state.storeconfigState.data = action.payload;
    },
    fetchStoreconfigStart(state) {
      state.storeconfigState.loading = true;
      state.storeconfigState.error = null;
    },
    fetchStoreconfigSuccess(state, action) {
      state.storeconfigState.loading = false;
      state.storeconfigState.data = action.payload;
      state.storeconfigState.error = null;
    },
    fetchStoreconfigFailure(state, action) {
      state.storeconfigState.loading = false;
      state.storeconfigState.error = action.payload;
    },
    updateStoreconfig(state, action) {
      const oldData = state.storeconfigState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.storeconfigState.data = newData;
      } else {
        state.storeconfigState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditStoreconfigFailure,
  addEditStoreconfigPageStart,
  addEditStoreconfigSuccess,
  setStoreconfig,
  fetchStoreconfigStart,
  fetchStoreconfigSuccess,
  fetchStoreconfigFailure,
  updateStoreconfig
} = storeconfigSlice.actions;

export default storeconfigSlice.reducer;
