import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IAboutAstro = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  description?: {
    en?: string;
    hi?: string;
  };
  secureTitle?: {
    en?: string;
    hi?: string;
  };
  benefitTitle?: {
    en?: string;
    hi?: string;
  };
  greatTitle?: {
    en?: string;
    hi?: string;
  };
  images?: {
    backgoundImage?: string;
    mainImage?: string;
    secureImage?: string;
    benefitImage?: string;
    greatImage?: string;
  };
};

const initialState = {
  homeaboutState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IAboutAstro | null>
};

export const fetchHomeAbout = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleHomeAboutStart());

    const response = await fetchApi('/store/aboutastro/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleHomeAboutSuccess(response?.aboutAstro));

      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleHomeAboutFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleHomeAboutFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditHomeAbout = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditHomeAbout',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        astroAbout: {
          homeaboutState: { data }
        }
      } = getState();

      dispatch(addEditHomeAboutStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        images: clonedData.images
          ? JSON.stringify(clonedData.images)
          : undefined,
        title: clonedData.title ? JSON.stringify(clonedData.title) : undefined,
        description: clonedData.description
          ? JSON.stringify(clonedData.description)
          : undefined,
        secureTitle: clonedData.secureTitle
          ? JSON.stringify(clonedData.secureTitle)
          : undefined,
        benefitTitle: clonedData.benefitTitle
          ? JSON.stringify(clonedData.benefitTitle)
          : undefined,
        greatTitle: clonedData.greatTitle
          ? JSON.stringify(clonedData.greatTitle)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/store/aboutastro/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditHomeAboutSuccess());
        dispatch(setAboutAstro(null));
        dispatch(fetchHomeAbout(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditHomeAboutFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditHomeAboutFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const homeaboutSlice = createSlice({
  name: 'homeabout',
  initialState,
  reducers: {
    fetchHomeAboutStart(state) {
      state.homeaboutState.loading = true;
      state.homeaboutState.error = null;
    },
    addEditHomeAboutStart(state) {
      state.homeaboutState.loading = true;
      state.homeaboutState.error = null;
    },
    addEditHomeAboutSuccess(state) {
      state.homeaboutState.loading = false;
      state.homeaboutState.error = null;
    },
    setAboutAstro(state, action) {
      state.homeaboutState.data = action.payload;
    },
    addEditHomeAboutFailure(state, action) {
      state.homeaboutState.loading = false;
      state.homeaboutState.error = action.payload;
    },
    fetchSingleHomeAboutStart(state) {
      state.homeaboutState.loading = true;
      state.homeaboutState.error = null;
    },
    fetchSingleHomeAboutSuccess(state, action) {
      state.homeaboutState.loading = false;
      state.homeaboutState.data = action.payload;
      state.homeaboutState.error = null;
    },
    fetchSingleHomeAboutFailure(state, action) {
      state.homeaboutState.loading = false;
      state.homeaboutState.error = action.payload;
    },
    updateAboutAstro(state, action) {
      const oldData = state.homeaboutState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.homeaboutState.data = newData;
      } else {
        state.homeaboutState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditHomeAboutStart,
  addEditHomeAboutSuccess,
  addEditHomeAboutFailure,
  setAboutAstro,
  updateAboutAstro,
  fetchSingleHomeAboutStart,
  fetchSingleHomeAboutSuccess,
  fetchSingleHomeAboutFailure
} = homeaboutSlice.actions;

export default homeaboutSlice.reducer;
