import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IWhyChoose = BaseModel & {
  mainSection?: {
    bannerImage?: string;
    sideImage?: string;
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
    textAlignment?: 'right' | 'left';
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
  whyChooseState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IWhyChoose | null>
};

export const fetchWhyChoose = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('whyChoose/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleWhyChooseStart());

    const response = await fetchApi('/home/whyChoose/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleWhyChooseSuccess(response?.whyChoose));
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch Why Choose data';
      dispatch(fetchSingleWhyChooseFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleWhyChooseFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditWhyChoose = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'whyChoose/addEditWhyChoose',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        whyChooseData: {
          whyChooseState: { data }
        }
      } = getState();

      dispatch(addEditWhyChooseStart());

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
        mainSection: clonedData.mainSection
          ? JSON.stringify(clonedData.mainSection)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/home/whyChoose/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditWhyChooseSuccess());
        dispatch(setWhyChoose(null));
        dispatch(fetchWhyChoose(null)); // Re-fetch to update the latest data
        toast.success('Why Choose data updated successfully');
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save Why Choose data';
        dispatch(addEditWhyChooseFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditWhyChooseFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const whyChooseSlice = createSlice({
  name: 'whyChoose',
  initialState,
  reducers: {
    fetchHomeAboutStart(state) {
      state.whyChooseState.loading = true;
      state.whyChooseState.error = null;
    },
    addEditWhyChooseStart(state) {
      state.whyChooseState.loading = true;
      state.whyChooseState.error = null;
    },
    addEditWhyChooseSuccess(state) {
      state.whyChooseState.loading = false;
      state.whyChooseState.error = null;
    },
    setWhyChoose(state, action) {
      state.whyChooseState.data = action.payload;
    },
    addEditWhyChooseFailure(state, action) {
      state.whyChooseState.loading = false;
      state.whyChooseState.error = action.payload;
    },
    fetchSingleWhyChooseStart(state) {
      state.whyChooseState.loading = true;
      state.whyChooseState.error = null;
    },
    fetchSingleWhyChooseSuccess(state, action) {
      console.log('The action payload value is:', action?.payload);
      state.whyChooseState.loading = false;
      state.whyChooseState.data = action.payload;
      state.whyChooseState.error = null;
    },
    fetchSingleWhyChooseFailure(state, action) {
      state.whyChooseState.loading = false;
      state.whyChooseState.error = action.payload;
    },
    updateWhyChoose(state, action) {
      const oldData = state.whyChooseState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.whyChooseState.data = newData;
      } else {
        state.whyChooseState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditWhyChooseStart,
  addEditWhyChooseSuccess,
  addEditWhyChooseFailure,
  setWhyChoose,
  updateWhyChoose,
  fetchSingleWhyChooseStart,
  fetchSingleWhyChooseSuccess,
  fetchSingleWhyChooseFailure
} = whyChooseSlice.actions;

export default whyChooseSlice.reducer;
