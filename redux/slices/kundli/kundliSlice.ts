import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IKundli = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  mainSection?: {
    bannerImage?: string;
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
    title1?: {
      en?: string;
      hi?: string;
    };
    title2?: {
      en?: string;
      hi?: string;
    };
    description1?: {
      en?: string;
      hi?: string;
    };
    description2?: {
      en?: string;
      hi?: string;
    };
  };
};

const initialState = {
  kundliState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IKundli | null>
};

export const fetchKundli = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleKundliStart());

    const response = await fetchApi('/kundli/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleKundliSuccess(response?.kundli));

      console.log('fecthaboutKundli', response);
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleKundliFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleKundliFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditKundli = createAsyncThunk<any, null, { state: RootState }>(
  'midbanner/addEditKundli',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        kundliConfig: {
          kundliState: { data }
        }
      } = getState();

      dispatch(addEditKundliStart());

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
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/kundli/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditKundliSuccess());
        dispatch(setKundli(null));
        dispatch(fetchKundli(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditKundliFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditKundliFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const kundliSlice = createSlice({
  name: 'kundli',
  initialState,
  reducers: {
    fetchHomeAboutStart(state) {
      state.kundliState.loading = true;
      state.kundliState.error = null;
    },
    addEditKundliStart(state) {
      state.kundliState.loading = true;
      state.kundliState.error = null;
    },
    addEditKundliSuccess(state) {
      state.kundliState.loading = false;
      state.kundliState.error = null;
    },
    setKundli(state, action) {
      state.kundliState.data = action.payload;
    },
    addEditKundliFailure(state, action) {
      state.kundliState.loading = false;
      state.kundliState.error = action.payload;
    },
    fetchSingleKundliStart(state) {
      state.kundliState.loading = true;
      state.kundliState.error = null;
    },
    fetchSingleKundliSuccess(state, action) {
      state.kundliState.loading = false;
      state.kundliState.data = action.payload;
      state.kundliState.error = null;
    },
    fetchSingleKundliFailure(state, action) {
      state.kundliState.loading = false;
      state.kundliState.error = action.payload;
    },
    updateKundli(state, action) {
      const oldData = state.kundliState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.kundliState.data = newData;
      } else {
        state.kundliState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditKundliStart,
  addEditKundliSuccess,
  addEditKundliFailure,
  setKundli,
  updateKundli,
  fetchSingleKundliStart,
  fetchSingleKundliSuccess,
  fetchSingleKundliFailure
} = kundliSlice.actions;

export default kundliSlice.reducer;
