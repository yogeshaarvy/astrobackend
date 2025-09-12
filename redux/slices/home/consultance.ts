import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IConsultance = BaseModel & {
  mainSection?: {
    bannerImage?: string;
    sideImage?: {
      en?: string;
      hi?: string;
    };
    mainTitle?: {
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
    imageAlignment?: 'right' | 'left';
    textColor?: string;
    buttonStatus?: boolean;
    buttonTitle?: {
      en?: string;
      hi?: string;
    };
    buttonLink?: string;
    active?: boolean;
  };
};

const initialState = {
  consultanceState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IConsultance | null>
};

export const fetchConsultance = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('consultance/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleConsultanceStart());

    const response = await fetchApi('/home/consultance/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleConsultanceSuccess(response?.consultance));

      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch consultance data';
      dispatch(fetchSingleConsultanceFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleConsultanceFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditConsultance = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'consultance/addEditConsultance',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        consultance: {
          consultanceState: { data }
        }
      } = getState();

      dispatch(addEditConsultanceStart());

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

      const response = await fetchApi('/home/consultance/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditConsultanceSuccess());
        dispatch(setConsultance(null));
        dispatch(fetchConsultance(null)); // Re-fetch to update the latest data
        toast.success('consultance data updated successfully');
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save consultance data';
        dispatch(addEditConsultanceFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditConsultanceFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const consultanceSlice = createSlice({
  name: 'consultance',
  initialState,
  reducers: {
    fetchHomeAboutStart(state) {
      state.consultanceState.loading = true;
      state.consultanceState.error = null;
    },
    addEditConsultanceStart(state) {
      state.consultanceState.loading = true;
      state.consultanceState.error = null;
    },
    addEditConsultanceSuccess(state) {
      state.consultanceState.loading = false;
      state.consultanceState.error = null;
    },
    setConsultance(state, action) {
      state.consultanceState.data = action.payload;
    },
    addEditConsultanceFailure(state, action) {
      state.consultanceState.loading = false;
      state.consultanceState.error = action.payload;
    },
    fetchSingleConsultanceStart(state) {
      state.consultanceState.loading = true;
      state.consultanceState.error = null;
    },
    fetchSingleConsultanceSuccess(state, action) {
      state.consultanceState.loading = false;
      state.consultanceState.data = action.payload;
      state.consultanceState.error = null;
    },
    fetchSingleConsultanceFailure(state, action) {
      state.consultanceState.loading = false;
      state.consultanceState.error = action.payload;
    },
    updateConsultance(state, action) {
      const oldData = state.consultanceState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.consultanceState.data = newData;
      } else {
        state.consultanceState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditConsultanceStart,
  addEditConsultanceSuccess,
  addEditConsultanceFailure,
  setConsultance,
  updateConsultance,
  fetchSingleConsultanceStart,
  fetchSingleConsultanceSuccess,
  fetchSingleConsultanceFailure
} = consultanceSlice.actions;

export default consultanceSlice.reducer;
