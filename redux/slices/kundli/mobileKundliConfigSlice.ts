import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IMobileKundli = BaseModel & {
  mainSection?: {
    sideImage?: string;
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    shortDescription?: {
      en?: string;
      hi?: string;
    };
  };
  sectionOne?: {
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    sectionOneImage?: string;
  };
  sectionTwo?: {
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    sectionTwoImage?: string;
  };
};

const initialState = {
  mobileKundliState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IMobileKundli | null>
};

export const fetchMobileKundli = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('mobileKundli/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleMobileKundliStart());

    const response = await fetchApi('/kundli/mobile/config/get', {
      method: 'GET'
    });

    if (response?.success) {
      dispatch(fetchSingleMobileKundliSuccess(response?.data));
      return response;
    } else {
      const errorMsg =
        response?.message || 'Failed to fetch mobile kundli data';
      dispatch(fetchSingleMobileKundliFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleMobileKundliFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditMobileKundli = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'mobileKundli/addEditMobileKundli',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        mobileKundli: {
          mobileKundliState: { data }
        }
      } = getState();

      dispatch(addEditMobileKundliStart());

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
          : undefined,
        sectionOne: clonedData.sectionOne
          ? JSON.stringify(clonedData.sectionOne)
          : undefined,
        sectionTwo: clonedData.sectionTwo
          ? JSON.stringify(clonedData.sectionTwo)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/kundli/mobile/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditMobileKundliSuccess());
        dispatch(setMobileKundli(null));
        dispatch(fetchMobileKundli(null));
        toast.success('Home Kundli data updated successfully');
        return response;
      } else {
        const errorMsg =
          response?.message || 'Failed to save mobile kundli data';
        dispatch(addEditMobileKundliFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditMobileKundliFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const mobileKundliSlice = createSlice({
  name: 'mobileKundli',
  initialState,
  reducers: {
    addEditMobileKundliStart(state) {
      state.mobileKundliState.loading = true;
      state.mobileKundliState.error = null;
    },
    addEditMobileKundliSuccess(state) {
      state.mobileKundliState.loading = false;
      state.mobileKundliState.error = null;
    },
    setMobileKundli(state, action) {
      state.mobileKundliState.data = action.payload;
    },
    addEditMobileKundliFailure(state, action) {
      state.mobileKundliState.loading = false;
      state.mobileKundliState.error = action.payload;
    },
    fetchSingleMobileKundliStart(state) {
      state.mobileKundliState.loading = true;
      state.mobileKundliState.error = null;
    },
    fetchSingleMobileKundliSuccess(state, action) {
      state.mobileKundliState.loading = false;
      state.mobileKundliState.data = action.payload;
      state.mobileKundliState.error = null;
    },
    fetchSingleMobileKundliFailure(state, action) {
      state.mobileKundliState.loading = false;
      state.mobileKundliState.error = action.payload;
    },
    updateMobileKundli(state, action) {
      const oldData = state.mobileKundliState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.mobileKundliState.data = newData;
      } else {
        state.mobileKundliState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditMobileKundliStart,
  addEditMobileKundliSuccess,
  addEditMobileKundliFailure,
  setMobileKundli,
  updateMobileKundli,
  fetchSingleMobileKundliStart,
  fetchSingleMobileKundliSuccess,
  fetchSingleMobileKundliFailure
} = mobileKundliSlice.actions;

export default mobileKundliSlice.reducer;
