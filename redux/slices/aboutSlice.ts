import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IAboutConfig = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  banner?: {
    bannerImage?: string;
    title?: {
      en?: string;
      hi?: string;
    };
    textColor?: string;
  };
  section1?: {
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    dividerImage?: string;
  };
  section2?: {
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    sideImage?: string;
  };
  section3?: {
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    side_Image?: string;
  };
};

const initialState = {
  aboutConfigState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IAboutConfig | null>
};

export const fetchAboutConfig = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('about/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleAboutConfigStart());

    const response = await fetchApi('/about/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleAboutConfigSuccess(response?.aboutConfig));
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleAboutConfigFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleAboutConfigFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditAboutConfig = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditAboutConfig',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        aboutConfig: {
          aboutConfigState: { data }
        }
      } = getState();

      dispatch(addEditAboutConfigStart());

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
        banner: clonedData.banner
          ? JSON.stringify(clonedData.banner)
          : undefined,
        section1: clonedData.section1
          ? JSON.stringify(clonedData.section1)
          : undefined,
        section2: clonedData.section2
          ? JSON.stringify(clonedData.section2)
          : undefined,
        section3: clonedData.section3
          ? JSON.stringify(clonedData.section3)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/about/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditAboutConfigSuccess());
        dispatch(setAboutConfig(null));
        dispatch(fetchAboutConfig(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditAboutConfigFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditAboutConfigFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const aboutConfigSlice = createSlice({
  name: 'aboutConfig',
  initialState,
  reducers: {
    fetchAboutConfigStart(state) {
      state.aboutConfigState.loading = true;
      state.aboutConfigState.error = null;
    },
    addEditAboutConfigStart(state) {
      state.aboutConfigState.loading = true;
      state.aboutConfigState.error = null;
    },
    addEditAboutConfigSuccess(state) {
      state.aboutConfigState.loading = false;
      state.aboutConfigState.error = null;
    },
    setAboutConfig(state, action) {
      state.aboutConfigState.data = action.payload;
    },
    addEditAboutConfigFailure(state, action) {
      state.aboutConfigState.loading = false;
      state.aboutConfigState.error = action.payload;
    },
    fetchSingleAboutConfigStart(state) {
      state.aboutConfigState.loading = true;
      state.aboutConfigState.error = null;
    },
    fetchSingleAboutConfigSuccess(state, action) {
      state.aboutConfigState.loading = false;
      state.aboutConfigState.data = action.payload;
      state.aboutConfigState.error = null;
    },
    fetchSingleAboutConfigFailure(state, action) {
      state.aboutConfigState.loading = false;
      state.aboutConfigState.error = action.payload;
    },
    updateAboutConfig(state, action) {
      const oldData = state.aboutConfigState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.aboutConfigState.data = newData;
      } else {
        state.aboutConfigState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditAboutConfigStart,
  addEditAboutConfigSuccess,
  addEditAboutConfigFailure,
  setAboutConfig,
  updateAboutConfig,
  fetchSingleAboutConfigStart,
  fetchSingleAboutConfigSuccess,
  fetchSingleAboutConfigFailure
} = aboutConfigSlice.actions;

export default aboutConfigSlice.reducer;
