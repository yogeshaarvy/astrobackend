import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IHomeKundli = BaseModel & {
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
  homeKundliState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IHomeKundli | null>
};

export const fetchHomeKundli = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('homeKundli/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleHomeKundliStart());

    const response = await fetchApi('/home/homeKundli/get', {
      method: 'GET'
    });

    if (response?.success) {
      dispatch(fetchSingleHomeKundliSuccess(response?.data));
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch home kundli data';
      dispatch(fetchSingleHomeKundliFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleHomeKundliFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditHomeKundli = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'homeKundli/addEditHomeKundli',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        homeKundli: {
          homeKundliState: { data }
        }
      } = getState();

      dispatch(addEditHomeKundliStart());

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

      const response = await fetchApi('/home/homeKundli/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditHomeKundliSuccess());
        dispatch(setHomeKundli(null));
        dispatch(fetchHomeKundli(null)); // Re-fetch to update the latest data
        toast.success('Home Kundli data updated successfully');
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save home kundli data';
        dispatch(addEditHomeKundliFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditHomeKundliFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const homeKundliSlice = createSlice({
  name: 'homeKundli',
  initialState,
  reducers: {
    addEditHomeKundliStart(state) {
      state.homeKundliState.loading = true;
      state.homeKundliState.error = null;
    },
    addEditHomeKundliSuccess(state) {
      state.homeKundliState.loading = false;
      state.homeKundliState.error = null;
    },
    setHomeKundli(state, action) {
      state.homeKundliState.data = action.payload;
    },
    addEditHomeKundliFailure(state, action) {
      state.homeKundliState.loading = false;
      state.homeKundliState.error = action.payload;
    },
    fetchSingleHomeKundliStart(state) {
      state.homeKundliState.loading = true;
      state.homeKundliState.error = null;
    },
    fetchSingleHomeKundliSuccess(state, action) {
      state.homeKundliState.loading = false;
      state.homeKundliState.data = action.payload;
      state.homeKundliState.error = null;
    },
    fetchSingleHomeKundliFailure(state, action) {
      state.homeKundliState.loading = false;
      state.homeKundliState.error = action.payload;
    },
    updateHomeKundli(state, action) {
      const oldData = state.homeKundliState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.homeKundliState.data = newData;
      } else {
        state.homeKundliState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditHomeKundliStart,
  addEditHomeKundliSuccess,
  addEditHomeKundliFailure,
  setHomeKundli,
  updateHomeKundli,
  fetchSingleHomeKundliStart,
  fetchSingleHomeKundliSuccess,
  fetchSingleHomeKundliFailure
} = homeKundliSlice.actions;

export default homeKundliSlice.reducer;
