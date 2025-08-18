import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';

export type IMidbanner = BaseModel & {
  image?: string;
  title?: {
    en?: string;
    hi?: string;
  };
  description?: {
    en?: string;
    hi?: string;
  };
  link?: string;
};

const initialState = {
  midbannerState: {
    data: {},
    loading: false,
    error: null
  } as BaseState<IMidbanner>
};

export const fetchMidbanner = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('midbanner/fetchData', async (input, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleMidbannerStart());

    const response = await fetchApi('/store/banner/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleMidbannerSuccess(response?.data));
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleMidbannerFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleMidbannerFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditMidbanner = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditMidbanner',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        midbanner: {
          midbannerState: { data }
        }
      } = getState();

      dispatch(addEditMidbannerStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();

      const reqData: any = {
        title: clonedData.title ? JSON.stringify(clonedData.title) : undefined,
        description: clonedData.description
          ? JSON.stringify(clonedData.description)
          : undefined,
        image: clonedData.image,
        link: clonedData.link
      };
      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response = await fetchApi('/store/banner/create', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditMidbannerSuccess());
        dispatch(setMidBanner(null));
        dispatch(fetchMidbanner(null));
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditMidbannerFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditMidbannerFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const midbannerSlice = createSlice({
  name: 'midbanner',
  initialState,
  reducers: {
    fetchMidbannerStart(state) {
      state.midbannerState.loading = true;
      state.midbannerState.error = null;
    },
    addEditMidbannerStart(state) {
      state.midbannerState.loading = true;
      state.midbannerState.error = null;
    },
    addEditMidbannerSuccess(state) {
      state.midbannerState.loading = false;
      state.midbannerState.error = null;
    },
    addEditMidbannerFailure(state, action) {
      state.midbannerState.loading = false;
      state.midbannerState.error = action.payload;
    },
    fetchSingleMidbannerStart(state) {
      state.midbannerState.loading = true;
      state.midbannerState.error = null;
    },
    fetchSingleMidbannerSuccess(state, action) {
      state.midbannerState.loading = false;
      state.midbannerState.data = action.payload;
      state.midbannerState.error = null;
    },
    fetchSingleMidbannerFailure(state, action) {
      state.midbannerState.loading = false;
      state.midbannerState.error = action.payload;
    },
    updateMidBannerData(state, action) {
      const oldData = state.midbannerState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.midbannerState.data = newData;
      } else {
        state.midbannerState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    setMidBanner(state, action) {
      state.midbannerState.data = action.payload;
    }
  }
});

export const {
  addEditMidbannerStart,
  addEditMidbannerSuccess,
  addEditMidbannerFailure,
  fetchSingleMidbannerStart,
  updateMidBannerData,
  setMidBanner,
  fetchSingleMidbannerSuccess,
  fetchSingleMidbannerFailure
} = midbannerSlice.actions;

export default midbannerSlice.reducer;
