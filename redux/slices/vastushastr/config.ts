import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { fetchVastushastrList } from './list';

export type IVastuShastraConfig = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  mainSection?: {
    bannerOne?: string;
    bannerTwo?: string;
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
    sideImage?: {
      en?: string;
      hi?: string;
    };
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
    buttonText?: {
      en?: string;
      hi?: string;
    };
  };
};

const initialState = {
  vastuShastraStateConfig: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IVastuShastraConfig | null>
};

export const fetchVastuShastraConfig = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchVastushastrList());

    const response = await fetchApi('/vastu_shastr/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleVastuShastraSuccessConfig(response?.vastuShastra));

      console.log('fecthaboutVastuShastra', response);
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleVastuShastraFailureConfig(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleVastuShastraFailureConfig(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditVastuShastraConfig = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditKundli',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        vastushastrConfig: {
          vastuShastraStateConfig: { data }
        }
      } = getState();

      dispatch(addEditVastuShastraStartConfig());

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

      const response = await fetchApi('/vastu_shastr/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditVastuShastraSuccessConfig());
        dispatch(setVastuShastraConfig(null));
        dispatch(fetchVastuShastraConfig(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditVastuShastraFailureConfig(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditVastuShastraFailureConfig(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const vastuShastraSliceConfig = createSlice({
  name: 'vastuShastra',
  initialState,
  reducers: {
    fetchHomeAboutStartConfig(state) {
      state.vastuShastraStateConfig.loading = true;
      state.vastuShastraStateConfig.error = null;
    },
    addEditVastuShastraStartConfig(state) {
      state.vastuShastraStateConfig.loading = true;
      state.vastuShastraStateConfig.error = null;
    },
    addEditVastuShastraSuccessConfig(state) {
      state.vastuShastraStateConfig.loading = false;
      state.vastuShastraStateConfig.error = null;
    },
    setVastuShastraConfig(state, action) {
      state.vastuShastraStateConfig.data = action.payload;
    },
    addEditVastuShastraFailureConfig(state, action) {
      state.vastuShastraStateConfig.loading = false;
      state.vastuShastraStateConfig.error = action.payload;
    },
    fetchSingleVastuShastraStartConfig(state) {
      state.vastuShastraStateConfig.loading = true;
      state.vastuShastraStateConfig.error = null;
    },
    fetchSingleVastuShastraSuccessConfig(state, action) {
      state.vastuShastraStateConfig.loading = false;
      state.vastuShastraStateConfig.data = action.payload;
      state.vastuShastraStateConfig.error = null;
    },
    fetchSingleVastuShastraFailureConfig(state, action) {
      state.vastuShastraStateConfig.loading = false;
      state.vastuShastraStateConfig.error = action.payload;
    },
    updateVastuShastraConfig(state, action) {
      const oldData = state.vastuShastraStateConfig.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.vastuShastraStateConfig.data = newData;
      } else {
        state.vastuShastraStateConfig.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditVastuShastraStartConfig,
  addEditVastuShastraSuccessConfig,
  addEditVastuShastraFailureConfig,
  setVastuShastraConfig,
  updateVastuShastraConfig,
  fetchSingleVastuShastraStartConfig,
  fetchSingleVastuShastraSuccessConfig,
  fetchSingleVastuShastraFailureConfig
} = vastuShastraSliceConfig.actions;

export default vastuShastraSliceConfig.reducer;
