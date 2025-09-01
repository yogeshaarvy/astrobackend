import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IPanchang = BaseModel & {
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
  };
  hindu_calendar?: {
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    table_title?: {
      en?: string;
      hi?: string;
    };
    stripImage?: string;
  };
};

const initialState = {
  panchangState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IPanchang | null>
};

export const fetchPanchang = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSinglePanchangStart());

    const response = await fetchApi('/panchang/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSinglePanchangSuccess(response?.panchang));

      console.log('fecthaboutPanchang', response);
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSinglePanchangFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSinglePanchangFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditPanchang = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditPanchang',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        panchangConfig: {
          panchangState: { data }
        }
      } = getState();

      dispatch(addEditPanchangStart());

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
        hindu_calendar: clonedData.hindu_calendar
          ? JSON.stringify(clonedData.hindu_calendar)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/panchang/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditPanchangSuccess());
        dispatch(setPanchang(null));
        dispatch(fetchPanchang(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditPanchangFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditPanchangFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const panchangSlice = createSlice({
  name: 'panchang',
  initialState,
  reducers: {
    fetchHomeAboutStart(state) {
      state.panchangState.loading = true;
      state.panchangState.error = null;
    },
    addEditPanchangStart(state) {
      state.panchangState.loading = true;
      state.panchangState.error = null;
    },
    addEditPanchangSuccess(state) {
      state.panchangState.loading = false;
      state.panchangState.error = null;
    },
    setPanchang(state, action) {
      state.panchangState.data = action.payload;
    },
    addEditPanchangFailure(state, action) {
      state.panchangState.loading = false;
      state.panchangState.error = action.payload;
    },
    fetchSinglePanchangStart(state) {
      state.panchangState.loading = true;
      state.panchangState.error = null;
    },
    fetchSinglePanchangSuccess(state, action) {
      state.panchangState.loading = false;
      state.panchangState.data = action.payload;
      state.panchangState.error = null;
    },
    fetchSinglePanchangFailure(state, action) {
      state.panchangState.loading = false;
      state.panchangState.error = action.payload;
    },
    updatePanchang(state, action) {
      const oldData = state.panchangState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.panchangState.data = newData;
      } else {
        state.panchangState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditPanchangStart,
  addEditPanchangSuccess,
  addEditPanchangFailure,
  setPanchang,
  updatePanchang,
  fetchSinglePanchangStart,
  fetchSinglePanchangSuccess,
  fetchSinglePanchangFailure
} = panchangSlice.actions;

export default panchangSlice.reducer;
