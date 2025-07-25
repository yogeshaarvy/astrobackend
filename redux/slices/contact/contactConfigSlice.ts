import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IContactConfig = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  mainSection?: {
    bannerImage?: string;
    title?: {
      en?: string;
      hi?: string;
    };
    address: {
      en?: string;
      hi?: string;
    };
    schedule: {
      en?: string;
      hi?: string;
    };
    mapTitle: {
      en?: string;
      hi?: string;
    };
    mapLink?: string;
  };
};

const initialState = {
  contactConfigState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IContactConfig | null>
};

export const fetchContactConfig = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleContactConfigStart());

    const response = await fetchApi('/contact/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleContactConfigSuccess(response?.contactConfig));

      console.log('fecthaboutContactConfig', response);
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleContactConfigFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleContactConfigFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditContactConfig = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditContactConfig',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        contactConfig: {
          contactConfigState: { data }
        }
      } = getState();

      dispatch(addEditContactConfigStart());

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
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/contact/config/create', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditContactConfigSuccess());
        dispatch(setContactConfig(null));
        dispatch(fetchContactConfig(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditContactConfigFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditContactConfigFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const contactConfigSlice = createSlice({
  name: 'contactConfig',
  initialState,
  reducers: {
    fetchContactConfigStart(state) {
      state.contactConfigState.loading = true;
      state.contactConfigState.error = null;
    },
    addEditContactConfigStart(state) {
      state.contactConfigState.loading = true;
      state.contactConfigState.error = null;
    },
    addEditContactConfigSuccess(state) {
      state.contactConfigState.loading = false;
      state.contactConfigState.error = null;
    },
    setContactConfig(state, action) {
      state.contactConfigState.data = action.payload;
    },
    addEditContactConfigFailure(state, action) {
      state.contactConfigState.loading = false;
      state.contactConfigState.error = action.payload;
    },
    fetchSingleContactConfigStart(state) {
      state.contactConfigState.loading = true;
      state.contactConfigState.error = null;
    },
    fetchSingleContactConfigSuccess(state, action) {
      state.contactConfigState.loading = false;
      state.contactConfigState.data = action.payload;
      state.contactConfigState.error = null;
    },
    fetchSingleContactConfigFailure(state, action) {
      state.contactConfigState.loading = false;
      state.contactConfigState.error = action.payload;
    },
    updateContactConfig(state, action) {
      const oldData = state.contactConfigState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.contactConfigState.data = newData;
      } else {
        state.contactConfigState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditContactConfigStart,
  addEditContactConfigSuccess,
  addEditContactConfigFailure,
  setContactConfig,
  updateContactConfig,
  fetchSingleContactConfigStart,
  fetchSingleContactConfigSuccess,
  fetchSingleContactConfigFailure
} = contactConfigSlice.actions;

export default contactConfigSlice.reducer;
