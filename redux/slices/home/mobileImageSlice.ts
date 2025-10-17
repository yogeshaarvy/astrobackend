import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IMobileImage = BaseModel & {
  consultationImage?: {
    en?: string;
    hi?: string;
  };
  appBarBanner?: {
    en?: string;
    hi?: string;
  };
  kundliImage?: {
    en?: string;
    hi?: string;
  };
  vibhorImage?: {
    en?: string;
    hi?: string;
  };
};

const initialState = {
  mobileImageState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IMobileImage | null>
};

export const fetchMobileImages = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('image/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleMobileImageStart());

    const response = await fetchApi('/mobile/images/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleMobileImageSuccess(response?.mobileImages));

      console.log('fectmobileImage', response);
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleMobileImageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleMobileImageFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditMobileImage = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditMobileImage',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        mobileImage: {
          mobileImageState: { data }
        }
      } = getState();

      dispatch(addEditMobileImageStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      console.log('The clonedData value is:', clonedData);

      const formData = new FormData();
      const reqData: any = {
        appBarBanner: clonedData.appBarBanner
          ? JSON.stringify(clonedData.appBarBanner)
          : undefined,
        consultationImage: clonedData.consultationImage
          ? JSON.stringify(clonedData.consultationImage)
          : undefined,
        vibhorImage: clonedData.vibhorImage
          ? JSON.stringify(clonedData.vibhorImage)
          : undefined,
        kundliImage: clonedData.kundliImage
          ? JSON.stringify(clonedData.kundliImage)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/mobile/images/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditMobileImageSuccess());
        dispatch(setMobileImage(null));
        dispatch(fetchMobileImages(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditMobileImageFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditMobileImageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

const mobileimageSlice = createSlice({
  name: 'mobileimage',
  initialState,
  reducers: {
    fetchHomeAboutStart(state) {
      state.mobileImageState.loading = true;
      state.mobileImageState.error = null;
    },
    addEditMobileImageStart(state) {
      state.mobileImageState.loading = true;
      state.mobileImageState.error = null;
    },
    addEditMobileImageSuccess(state) {
      state.mobileImageState.loading = false;
      state.mobileImageState.error = null;
    },
    setMobileImage(state, action) {
      state.mobileImageState.data = action.payload;
    },
    addEditMobileImageFailure(state, action) {
      state.mobileImageState.loading = false;
      state.mobileImageState.error = action.payload;
    },
    fetchSingleMobileImageStart(state) {
      state.mobileImageState.loading = true;
      state.mobileImageState.error = null;
    },
    fetchSingleMobileImageSuccess(state, action) {
      state.mobileImageState.loading = false;
      state.mobileImageState.data = action.payload;
      state.mobileImageState.error = null;
    },
    fetchSingleMobileImageFailure(state, action) {
      state.mobileImageState.loading = false;
      state.mobileImageState.error = action.payload;
    },
    updateMobileImage(state, action) {
      const oldData = state.mobileImageState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.mobileImageState.data = newData;
      } else {
        state.mobileImageState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditMobileImageStart,
  addEditMobileImageSuccess,
  addEditMobileImageFailure,
  setMobileImage,
  updateMobileImage,
  fetchSingleMobileImageStart,
  fetchSingleMobileImageSuccess,
  fetchSingleMobileImageFailure
} = mobileimageSlice.actions;

export default mobileimageSlice.reducer;
