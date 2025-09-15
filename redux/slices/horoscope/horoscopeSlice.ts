import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IHoroscopeConfig = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  mainSection?: {
    bannerImage?: {
      en?: string;
      hi?: string;
    };
    sideImage?: string;
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
    image?: {
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
  };
  section4?: {
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    rightImage?: {
      en?: string;
      hi?: string;
    };
  };
  cards?: {
    titleOne?: {
      en?: string;
      hi?: string;
    };
    titleTwo?: {
      en?: string;
      hi?: string;
    };
    titleThree?: {
      en?: string;
      hi?: string;
    };
    descriptionOne?: {
      en?: string;
      hi?: string;
    };
    descriptionTwo?: {
      en?: string;
      hi?: string;
    };
    descriptionThree?: {
      en?: string;
      hi?: string;
    };
    iconOne?: string;
    iconTwo?: string;
    iconThree?: string;
  };
};

const initialState = {
  horoscopeState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IHoroscopeConfig | null>
};

export const fetchHoroscope = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleHoroscopeStart());

    const response = await fetchApi('/horoscope/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleHoroscopeSuccess(response?.horoscopeconfig));

      console.log('fecthaboutHoroscope', response);
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleHoroscopeFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleHoroscopeFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditHoroscope = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditHoroscope',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        horoscopeConfig: {
          horoscopeState: { data }
        }
      } = getState();

      dispatch(addEditHoroscopeStart());

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
        section2: clonedData.section2
          ? JSON.stringify(clonedData.section2)
          : undefined,
        section3: clonedData.section3
          ? JSON.stringify(clonedData.section3)
          : undefined,
        section4: clonedData.section4
          ? JSON.stringify(clonedData.section4)
          : undefined,
        cards: clonedData.cards ? JSON.stringify(clonedData.cards) : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/horoscope/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditHoroscopeSuccess());
        dispatch(setHoroscope(null));
        dispatch(fetchHoroscope(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditHoroscopeFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditHoroscopeFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const horoscopeSlice = createSlice({
  name: 'horoscope',
  initialState,
  reducers: {
    fetchHomeAboutStart(state) {
      state.horoscopeState.loading = true;
      state.horoscopeState.error = null;
    },
    addEditHoroscopeStart(state) {
      state.horoscopeState.loading = true;
      state.horoscopeState.error = null;
    },
    addEditHoroscopeSuccess(state) {
      state.horoscopeState.loading = false;
      state.horoscopeState.error = null;
    },
    setHoroscope(state, action) {
      state.horoscopeState.data = action.payload;
    },
    addEditHoroscopeFailure(state, action) {
      state.horoscopeState.loading = false;
      state.horoscopeState.error = action.payload;
    },
    fetchSingleHoroscopeStart(state) {
      state.horoscopeState.loading = true;
      state.horoscopeState.error = null;
    },
    fetchSingleHoroscopeSuccess(state, action) {
      state.horoscopeState.loading = false;
      state.horoscopeState.data = action.payload;
      state.horoscopeState.error = null;
    },
    fetchSingleHoroscopeFailure(state, action) {
      state.horoscopeState.loading = false;
      state.horoscopeState.error = action.payload;
    },
    updateHoroscope(state, action) {
      const oldData = state.horoscopeState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.horoscopeState.data = newData;
      } else {
        state.horoscopeState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditHoroscopeStart,
  addEditHoroscopeSuccess,
  addEditHoroscopeFailure,
  setHoroscope,
  updateHoroscope,
  fetchSingleHoroscopeStart,
  fetchSingleHoroscopeSuccess,
  fetchSingleHoroscopeFailure
} = horoscopeSlice.actions;

export default horoscopeSlice.reducer;
