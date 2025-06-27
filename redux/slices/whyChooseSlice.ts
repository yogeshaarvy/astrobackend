import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IWhyChooseConfig = BaseModel & {
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
    sideImage?: string;
    sideTitle?: {
      en?: string;
      hi?: string;
    };
    sideDescription?: {
      en?: string;
      hi?: string;
    };
  };
};

const initialState = {
  whyChooseConfigState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IWhyChooseConfig | null>
};

export const fetchWhyChoose = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleWhyChooseStart());

    const response = await fetchApi('/whyChoose/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleWhyChooseSuccess(response?.whyChoose));

      console.log('fecthaboutWhyChoose', response);
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleWhyChooseFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleWhyChooseFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditWhyChoose = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditWhyChoose',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        whyChooseConfig: {
          whyChooseConfigState: { data }
        }
      } = getState();

      dispatch(addEditWhyChooseStart());

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
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/whyChoose/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditWhyChooseSuccess());
        dispatch(setWhyChoose(null));
        dispatch(fetchWhyChoose(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditWhyChooseFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditWhyChooseFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const whyChooseSlice = createSlice({
  name: 'whyChoose',
  initialState,
  reducers: {
    fetchWhyChooseStart(state) {
      state.whyChooseConfigState.loading = true;
      state.whyChooseConfigState.error = null;
    },
    addEditWhyChooseStart(state) {
      state.whyChooseConfigState.loading = true;
      state.whyChooseConfigState.error = null;
    },
    addEditWhyChooseSuccess(state) {
      state.whyChooseConfigState.loading = false;
      state.whyChooseConfigState.error = null;
    },
    setWhyChoose(state, action) {
      state.whyChooseConfigState.data = action.payload;
    },
    addEditWhyChooseFailure(state, action) {
      state.whyChooseConfigState.loading = false;
      state.whyChooseConfigState.error = action.payload;
    },
    fetchSingleWhyChooseStart(state) {
      state.whyChooseConfigState.loading = true;
      state.whyChooseConfigState.error = null;
    },
    fetchSingleWhyChooseSuccess(state, action) {
      state.whyChooseConfigState.loading = false;
      state.whyChooseConfigState.data = action.payload;
      state.whyChooseConfigState.error = null;
    },
    fetchSingleWhyChooseFailure(state, action) {
      state.whyChooseConfigState.loading = false;
      state.whyChooseConfigState.error = action.payload;
    },
    updateWhyChoose(state, action) {
      const oldData = state.whyChooseConfigState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.whyChooseConfigState.data = newData;
      } else {
        state.whyChooseConfigState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditWhyChooseStart,
  addEditWhyChooseSuccess,
  addEditWhyChooseFailure,
  setWhyChoose,
  updateWhyChoose,
  fetchSingleWhyChooseStart,
  fetchSingleWhyChooseSuccess,
  fetchSingleWhyChooseFailure
} = whyChooseSlice.actions;

export default whyChooseSlice.reducer;
