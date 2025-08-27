import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type ICareerConfig = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  sectionOne?: {
    mainTitle?: {
      en?: string;
      hi?: string;
    };
    leftImage?: string;
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
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
    rightImage?: string;
    heading?: {
      en?: string;
      hi?: string;
    };
    subDescription?: {
      en?: string;
      hi?: string;
    };
    sideImage?: string;
  };
  sectionThree?: {
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
  };
  sectionFour?: {
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    bannerImage?: string;
    buttonText?: {
      en?: string;
      hi?: string;
    };
  };
};

const initialState = {
  careerConfigState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ICareerConfig | null>
};

export const fetchCareerConfig = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('careerConfig/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleCareerConfigStart());

    const response = await fetchApi('/carrier/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleCareerConfigSuccess(response?.data));

      return response;
    } else {
      const errorMsg =
        response?.message || 'Failed to fetch Career Config data';
      dispatch(fetchSingleCareerConfigFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleCareerConfigFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditCareerConfig = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'CareerConfig/addEditCareerConfig',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        carrierConfig: {
          careerConfigState: { data }
        }
      } = getState();

      dispatch(addEditCareerConfigStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        metaTitle: clonedData.metaTitle,
        metaDescription: clonedData.metaDescription,
        metaKeyword: clonedData.metaKeyword,
        sectionOne: clonedData.sectionOne
          ? JSON.stringify(clonedData.sectionOne)
          : undefined,
        sectionTwo: clonedData.sectionTwo
          ? JSON.stringify(clonedData.sectionTwo)
          : undefined,
        sectionThree: clonedData.sectionThree
          ? JSON.stringify(clonedData.sectionThree)
          : undefined,
        sectionFour: clonedData.sectionFour
          ? JSON.stringify(clonedData.sectionFour)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/carrier/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditCareerConfigSuccess());
        dispatch(setCareerConfig(null));
        dispatch(fetchCareerConfig(null)); // Re-fetch to update the latest data
        toast.success('Career Config data updated successfully');
        return response;
      } else {
        const errorMsg =
          response?.message || 'Failed to save Career Config data';
        dispatch(addEditCareerConfigFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditCareerConfigFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const careerConfigSlice = createSlice({
  name: 'careerConfig',
  initialState,
  reducers: {
    fetchCareerConfigStart(state) {
      state.careerConfigState.loading = true;
      state.careerConfigState.error = null;
    },
    addEditCareerConfigStart(state) {
      state.careerConfigState.loading = true;
      state.careerConfigState.error = null;
    },
    addEditCareerConfigSuccess(state) {
      state.careerConfigState.loading = false;
      state.careerConfigState.error = null;
    },
    setCareerConfig(state, action) {
      state.careerConfigState.data = action.payload;
    },
    addEditCareerConfigFailure(state, action) {
      state.careerConfigState.loading = false;
      state.careerConfigState.error = action.payload;
    },
    fetchSingleCareerConfigStart(state) {
      state.careerConfigState.loading = true;
      state.careerConfigState.error = null;
    },
    fetchSingleCareerConfigSuccess(state, action) {
      state.careerConfigState.loading = false;
      state.careerConfigState.data = action.payload;
      state.careerConfigState.error = null;
    },
    fetchSingleCareerConfigFailure(state, action) {
      state.careerConfigState.loading = false;
      state.careerConfigState.error = action.payload;
    },
    updateCareerConfig(state, action) {
      const oldData = state.careerConfigState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.careerConfigState.data = newData;
      } else {
        state.careerConfigState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditCareerConfigStart,
  addEditCareerConfigSuccess,
  addEditCareerConfigFailure,
  setCareerConfig,
  updateCareerConfig,
  fetchSingleCareerConfigStart,
  fetchSingleCareerConfigSuccess,
  fetchSingleCareerConfigFailure
} = careerConfigSlice.actions;

export default careerConfigSlice.reducer;
