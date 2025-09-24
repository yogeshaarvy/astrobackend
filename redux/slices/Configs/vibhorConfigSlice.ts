import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IVibhorConfig = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  mainSection?: {
    bannerImage?: {
      en?: string;
      hi?: string;
    };
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    textAlignment?: string;
    textColor?: string;
  };
  section2?: {
    title?: {
      en?: string;
      hi?: string;
    };
    shortDescription?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    image?: string;
  };
};

const initialState = {
  vibhorConfigState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IVibhorConfig | null>
};

export const fetchVibhorConfig = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('vibhor/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleVibhorConfigStart());

    const response = await fetchApi('/vibhor/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleVibhorConfigSuccess(response?.vibhorConfig));
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleVibhorConfigFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleVibhorConfigFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditVibhorConfig = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditVibhorConfig',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        vibhorConfig: {
          vibhorConfigState: { data }
        }
      } = getState();

      dispatch(addEditVibhorConfigStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

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
        metaKeyword: clonedData.metaKeyword
          ? clonedData.metaKeyword
          : undefined,
        mainSection: clonedData.mainSection
          ? JSON.stringify(clonedData.mainSection)
          : undefined,
        section2: clonedData.section2
          ? JSON.stringify(clonedData.section2)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/vibhor/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditVibhorConfigSuccess());
        dispatch(setVibhorConfig(null));
        dispatch(fetchVibhorConfig(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditVibhorConfigFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditVibhorConfigFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const vibhorConfigSlice = createSlice({
  name: 'vibhorConfig',
  initialState,
  reducers: {
    fetchVibhorConfigStart(state) {
      state.vibhorConfigState.loading = true;
      state.vibhorConfigState.error = null;
    },
    addEditVibhorConfigStart(state) {
      state.vibhorConfigState.loading = true;
      state.vibhorConfigState.error = null;
    },
    addEditVibhorConfigSuccess(state) {
      state.vibhorConfigState.loading = false;
      state.vibhorConfigState.error = null;
    },
    setVibhorConfig(state, action) {
      state.vibhorConfigState.data = action.payload;
    },
    addEditVibhorConfigFailure(state, action) {
      state.vibhorConfigState.loading = false;
      state.vibhorConfigState.error = action.payload;
    },
    fetchSingleVibhorConfigStart(state) {
      state.vibhorConfigState.loading = true;
      state.vibhorConfigState.error = null;
    },
    fetchSingleVibhorConfigSuccess(state, action) {
      state.vibhorConfigState.loading = false;
      state.vibhorConfigState.data = action.payload;
      state.vibhorConfigState.error = null;
    },
    fetchSingleVibhorConfigFailure(state, action) {
      state.vibhorConfigState.loading = false;
      state.vibhorConfigState.error = action.payload;
    },
    updateVibhorConfig(state, action) {
      const oldData = state.vibhorConfigState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.vibhorConfigState.data = newData;
      } else {
        state.vibhorConfigState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditVibhorConfigStart,
  addEditVibhorConfigSuccess,
  addEditVibhorConfigFailure,
  setVibhorConfig,
  updateVibhorConfig,
  fetchSingleVibhorConfigStart,
  fetchSingleVibhorConfigSuccess,
  fetchSingleVibhorConfigFailure
} = vibhorConfigSlice.actions;

export default vibhorConfigSlice.reducer;
