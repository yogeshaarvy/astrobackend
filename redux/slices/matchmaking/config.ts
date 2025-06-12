import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IMatchMaking = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  mainSection?: {
    bannerImage?: string;
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
  matchMakingState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IMatchMaking | null>
};

export const fetchMatchMaking = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('matchmaking/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleMatchMakingStart());

    const response = await fetchApi('/match-making/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleMatchMakingSuccess(response?.matchMaking));

      console.log('fetchMatchMaking', response);
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch matchmaking data';
      dispatch(fetchSingleMatchMakingFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleMatchMakingFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditMatchMaking = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'matchmaking/addEditMatchMaking',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        matchMaking: {
          matchMakingState: { data }
        }
      } = getState();

      dispatch(addEditMatchMakingStart());

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
          : undefined,
        section4: clonedData.section4
          ? JSON.stringify(clonedData.section4)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/match-making/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditMatchMakingSuccess());
        dispatch(setMatchMaking(null));
        dispatch(fetchMatchMaking(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save matchmaking data';
        dispatch(addEditMatchMakingFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditMatchMakingFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const matchMakingSlice = createSlice({
  name: 'matchmaking',
  initialState,
  reducers: {
    addEditMatchMakingStart(state) {
      state.matchMakingState.loading = true;
      state.matchMakingState.error = null;
    },
    addEditMatchMakingSuccess(state) {
      state.matchMakingState.loading = false;
      state.matchMakingState.error = null;
    },
    setMatchMaking(state, action) {
      state.matchMakingState.data = action.payload;
    },
    addEditMatchMakingFailure(state, action) {
      state.matchMakingState.loading = false;
      state.matchMakingState.error = action.payload;
    },
    fetchSingleMatchMakingStart(state) {
      state.matchMakingState.loading = true;
      state.matchMakingState.error = null;
    },
    fetchSingleMatchMakingSuccess(state, action) {
      state.matchMakingState.loading = false;
      state.matchMakingState.data = action.payload;
      state.matchMakingState.error = null;
    },
    fetchSingleMatchMakingFailure(state, action) {
      state.matchMakingState.loading = false;
      state.matchMakingState.error = action.payload;
    },
    updateMatchMaking(state, action) {
      const oldData = state.matchMakingState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.matchMakingState.data = newData;
      } else {
        state.matchMakingState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    clearMatchMakingError(state) {
      state.matchMakingState.error = null;
    },
    resetMatchMakingState(state) {
      state.matchMakingState = {
        data: null,
        loading: null,
        error: null
      };
    }
  }
});

export const {
  addEditMatchMakingStart,
  addEditMatchMakingSuccess,
  addEditMatchMakingFailure,
  setMatchMaking,
  updateMatchMaking,
  fetchSingleMatchMakingStart,
  fetchSingleMatchMakingSuccess,
  fetchSingleMatchMakingFailure,
  clearMatchMakingError,
  resetMatchMakingState
} = matchMakingSlice.actions;

export default matchMakingSlice.reducer;
