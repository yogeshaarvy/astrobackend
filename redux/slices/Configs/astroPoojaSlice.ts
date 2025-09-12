import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IAstroPooja = BaseModel & {
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
    description?: {
      en?: string;
      hi?: string;
    };
  };
  section3?: {
    image?: string;
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
  };
};

const initialState = {
  astropoojaState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IAstroPooja | null>
};

export const fetchAstroPooja = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleAstroPoojaStart());

    const response = await fetchApi('/astro-pooja/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleAstroPoojaSuccess(response?.astroPooja));

      console.log('fectaboutAbout', response);
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleAstroPoojaFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleAstroPoojaFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditAstroPooja = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditAstroPooja',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        astroPoojas: {
          astropoojaState: { data }
        }
      } = getState();

      dispatch(addEditAstroPoojaStart());

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

      const response = await fetchApi('/astro-pooja/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditAstroPoojaSuccess());
        dispatch(setAstroPooja(null));
        dispatch(fetchAstroPooja(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditAstroPoojaFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditAstroPoojaFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const astropoojaSlice = createSlice({
  name: 'astropooja',
  initialState,
  reducers: {
    fetchHomeAboutStart(state) {
      state.astropoojaState.loading = true;
      state.astropoojaState.error = null;
    },
    addEditAstroPoojaStart(state) {
      state.astropoojaState.loading = true;
      state.astropoojaState.error = null;
    },
    addEditAstroPoojaSuccess(state) {
      state.astropoojaState.loading = false;
      state.astropoojaState.error = null;
    },
    setAstroPooja(state, action) {
      state.astropoojaState.data = action.payload;
    },
    addEditAstroPoojaFailure(state, action) {
      state.astropoojaState.loading = false;
      state.astropoojaState.error = action.payload;
    },
    fetchSingleAstroPoojaStart(state) {
      state.astropoojaState.loading = true;
      state.astropoojaState.error = null;
    },
    fetchSingleAstroPoojaSuccess(state, action) {
      state.astropoojaState.loading = false;
      state.astropoojaState.data = action.payload;
      state.astropoojaState.error = null;
    },
    fetchSingleAstroPoojaFailure(state, action) {
      state.astropoojaState.loading = false;
      state.astropoojaState.error = action.payload;
    },
    updateAstroPooja(state, action) {
      const oldData = state.astropoojaState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.astropoojaState.data = newData;
      } else {
        state.astropoojaState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditAstroPoojaStart,
  addEditAstroPoojaSuccess,
  addEditAstroPoojaFailure,
  setAstroPooja,
  updateAstroPooja,
  fetchSingleAstroPoojaStart,
  fetchSingleAstroPoojaSuccess,
  fetchSingleAstroPoojaFailure
} = astropoojaSlice.actions;

export default astropoojaSlice.reducer;
