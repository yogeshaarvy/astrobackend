import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IAstroRegisterConfig = BaseModel & {
  registerConfig?: {
    sideImage?: string;
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    active?: boolean;
  };
};

const initialState = {
  astrologerConfigState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IAstroRegisterConfig | null>
};

export const fetchAstrologerConfig = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('AstrologerConfig/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleAstrologerConfigStart());

    const response = await fetchApi('/astro_register_config/register/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleAstrologerConfigSuccess(response?.registerImage));

      return response;
    } else {
      const errorMsg =
        response?.message || 'Failed to fetch Astrologer Config data';
      dispatch(fetchSingleAstrologerConfigFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleAstrologerConfigFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditAstrologerConfig = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'astrologerConfig/addEditAstrologerConfig',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        astroRegisterConfig: {
          astrologerConfigState: { data }
        }
      } = getState();

      dispatch(addEditAstrologerConfigStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        registerConfig: clonedData.registerConfig
          ? JSON.stringify(clonedData.registerConfig)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi(
        '/astro_register_config/register/createorupdate',
        {
          method: 'POST',
          body: formData
        }
      );

      if (response?.success) {
        dispatch(addEditAstrologerConfigSuccess());
        dispatch(setAstrologerConfig(null));
        dispatch(fetchAstrologerConfig(null)); // Re-fetch to update the latest data
        toast.success('Astrologer Config updated successfully');
        return response;
      } else {
        const errorMsg =
          response?.message || 'Failed to save Astrologer Config data';
        dispatch(addEditAstrologerConfigFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditAstrologerConfigFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const astrologerConfigSlice = createSlice({
  name: 'astrologerConfig',
  initialState,
  reducers: {
    fetchAstrologerConfigStart(state) {
      state.astrologerConfigState.loading = true;
      state.astrologerConfigState.error = null;
    },
    addEditAstrologerConfigStart(state) {
      state.astrologerConfigState.loading = true;
      state.astrologerConfigState.error = null;
    },
    addEditAstrologerConfigSuccess(state) {
      state.astrologerConfigState.loading = false;
      state.astrologerConfigState.error = null;
    },
    setAstrologerConfig(state, action) {
      state.astrologerConfigState.data = action.payload;
    },
    addEditAstrologerConfigFailure(state, action) {
      state.astrologerConfigState.loading = false;
      state.astrologerConfigState.error = action.payload;
    },
    fetchSingleAstrologerConfigStart(state) {
      state.astrologerConfigState.loading = true;
      state.astrologerConfigState.error = null;
    },
    fetchSingleAstrologerConfigSuccess(state, action) {
      state.astrologerConfigState.loading = false;
      state.astrologerConfigState.data = action.payload;
      state.astrologerConfigState.error = null;
    },
    fetchSingleAstrologerConfigFailure(state, action) {
      state.astrologerConfigState.loading = false;
      state.astrologerConfigState.error = action.payload;
    },
    updateAstrologerConfig(state, action) {
      const oldData = state.astrologerConfigState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.astrologerConfigState.data = newData;
      } else {
        state.astrologerConfigState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditAstrologerConfigStart,
  addEditAstrologerConfigSuccess,
  addEditAstrologerConfigFailure,
  setAstrologerConfig,
  updateAstrologerConfig,
  fetchSingleAstrologerConfigStart,
  fetchSingleAstrologerConfigSuccess,
  fetchSingleAstrologerConfigFailure
} = astrologerConfigSlice.actions;

export default astrologerConfigSlice.reducer;
