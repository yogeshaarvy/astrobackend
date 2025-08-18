import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IHomeVibhor = BaseModel & {
  mainSection?: {
    sideImage?: string;
    imageAlignment?: 'right' | 'left';
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    buttonTitle?: {
      en?: string;
      hi?: string;
    };
    buttonLink?: string;
    active?: boolean;
  };
};

const initialState = {
  homeVibhorState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IHomeVibhor | null>
};

export const fetchHomeVibhor = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('homeVibhor/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleHomeVibhorStart());

    const response = await fetchApi('/home/homeVibhor/get', {
      method: 'GET'
    });

    if (response?.success) {
      dispatch(fetchSingleHomeVibhorSuccess(response?.data));
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch home vibhor data';
      dispatch(fetchSingleHomeVibhorFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleHomeVibhorFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const fetchHomeVibhorForUser = createAsyncThunk<
  any,
  string,
  { state: RootState }
>(
  'homeVibhor/fetchForUser',
  async (selectedLanguage = 'en', { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSingleHomeVibhorStart());

      const response = await fetchApi(
        `/home/homeVibhor/getForUser?selectedLanguage=${selectedLanguage}`,
        {
          method: 'GET'
        }
      );

      if (response?.success) {
        dispatch(fetchSingleHomeVibhorSuccess(response?.data));
        return response;
      } else {
        const errorMsg =
          response?.message || 'Failed to fetch home vibhor data';
        dispatch(fetchSingleHomeVibhorFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleHomeVibhorFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditHomeVibhor = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'homeVibhor/addEditHomeVibhor',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        homeVibhor: {
          homeVibhorState: { data }
        }
      } = getState();

      dispatch(addEditHomeVibhorStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        mainSection: clonedData.mainSection
          ? JSON.stringify(clonedData.mainSection)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/home/homeVibhor/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditHomeVibhorSuccess());
        dispatch(setHomeVibhor(null));
        dispatch(fetchHomeVibhor(null)); // Re-fetch to update the latest data
        toast.success('Home Vibhor data updated successfully');
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save home vibhor data';
        dispatch(addEditHomeVibhorFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditHomeVibhorFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const homeVibhorSlice = createSlice({
  name: 'homeVibhor',
  initialState,
  reducers: {
    addEditHomeVibhorStart(state) {
      state.homeVibhorState.loading = true;
      state.homeVibhorState.error = null;
    },
    addEditHomeVibhorSuccess(state) {
      state.homeVibhorState.loading = false;
      state.homeVibhorState.error = null;
    },
    setHomeVibhor(state, action) {
      state.homeVibhorState.data = action.payload;
    },
    addEditHomeVibhorFailure(state, action) {
      state.homeVibhorState.loading = false;
      state.homeVibhorState.error = action.payload;
    },
    fetchSingleHomeVibhorStart(state) {
      state.homeVibhorState.loading = true;
      state.homeVibhorState.error = null;
    },
    fetchSingleHomeVibhorSuccess(state, action) {
      state.homeVibhorState.loading = false;
      state.homeVibhorState.data = action.payload;
      state.homeVibhorState.error = null;
    },
    fetchSingleHomeVibhorFailure(state, action) {
      state.homeVibhorState.loading = false;
      state.homeVibhorState.error = action.payload;
    },
    updateHomeVibhor(state, action) {
      const oldData = state.homeVibhorState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.homeVibhorState.data = newData;
      } else {
        state.homeVibhorState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchHomeVibhor
      .addCase(fetchHomeVibhor.pending, (state) => {
        state.homeVibhorState.loading = true;
        state.homeVibhorState.error = null;
      })
      .addCase(fetchHomeVibhor.fulfilled, (state, action) => {
        state.homeVibhorState.loading = false;
        state.homeVibhorState.data = action.payload?.data || null;
        state.homeVibhorState.error = null;
      })
      .addCase(fetchHomeVibhor.rejected, (state, action) => {
        state.homeVibhorState.loading = false;
        state.homeVibhorState.error = action.payload as string;
      })
      // Handle fetchHomeVibhorForUser
      .addCase(fetchHomeVibhorForUser.pending, (state) => {
        state.homeVibhorState.loading = true;
        state.homeVibhorState.error = null;
      })
      .addCase(fetchHomeVibhorForUser.fulfilled, (state, action) => {
        state.homeVibhorState.loading = false;
        state.homeVibhorState.data = action.payload?.data || null;
        state.homeVibhorState.error = null;
      })
      .addCase(fetchHomeVibhorForUser.rejected, (state, action) => {
        state.homeVibhorState.loading = false;
        state.homeVibhorState.error = action.payload as string;
      })
      // Handle addEditHomeVibhor
      .addCase(addEditHomeVibhor.pending, (state) => {
        state.homeVibhorState.loading = true;
        state.homeVibhorState.error = null;
      })
      .addCase(addEditHomeVibhor.fulfilled, (state) => {
        state.homeVibhorState.loading = false;
        state.homeVibhorState.error = null;
      })
      .addCase(addEditHomeVibhor.rejected, (state, action) => {
        state.homeVibhorState.loading = false;
        state.homeVibhorState.error = action.payload as string;
      });
  }
});

export const {
  addEditHomeVibhorStart,
  addEditHomeVibhorSuccess,
  addEditHomeVibhorFailure,
  setHomeVibhor,
  updateHomeVibhor,
  fetchSingleHomeVibhorStart,
  fetchSingleHomeVibhorSuccess,
  fetchSingleHomeVibhorFailure
} = homeVibhorSlice.actions;

export default homeVibhorSlice.reducer;
