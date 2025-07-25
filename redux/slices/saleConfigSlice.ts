import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type ISaleConfig = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  backgroundSection?: {
    bannerImage?: string;
  };
};

const initialState = {
  saleConfigState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ISaleConfig | null>
};

export const fetchSaleConfig = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleSaleConfigStart());

    const response = await fetchApi('/sale_config/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleSaleConfigSuccess(response?.saleConfig));

      console.log('fecthaboutSaleConfig', response);
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleSaleConfigFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleSaleConfigFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditSaleConfig = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditSaleConfig',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        saleConfig: {
          saleConfigState: { data }
        }
      } = getState();

      dispatch(addEditSaleConfigStart());

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
        backgroundSection: clonedData.backgroundSection
          ? JSON.stringify(clonedData.backgroundSection)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/sale_config/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditSaleConfigSuccess());
        dispatch(setSaleConfig(null));
        dispatch(fetchSaleConfig(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditSaleConfigFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditSaleConfigFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const saleConfigSlice = createSlice({
  name: 'saleConfig',
  initialState,
  reducers: {
    fetchHomeAboutStart(state) {
      state.saleConfigState.loading = true;
      state.saleConfigState.error = null;
    },
    addEditSaleConfigStart(state) {
      state.saleConfigState.loading = true;
      state.saleConfigState.error = null;
    },
    addEditSaleConfigSuccess(state) {
      state.saleConfigState.loading = false;
      state.saleConfigState.error = null;
    },
    setSaleConfig(state, action) {
      state.saleConfigState.data = action.payload;
    },
    addEditSaleConfigFailure(state, action) {
      state.saleConfigState.loading = false;
      state.saleConfigState.error = action.payload;
    },
    fetchSingleSaleConfigStart(state) {
      state.saleConfigState.loading = true;
      state.saleConfigState.error = null;
    },
    fetchSingleSaleConfigSuccess(state, action) {
      state.saleConfigState.loading = false;
      state.saleConfigState.data = action.payload;
      state.saleConfigState.error = null;
    },
    fetchSingleSaleConfigFailure(state, action) {
      state.saleConfigState.loading = false;
      state.saleConfigState.error = action.payload;
    },
    updateSaleConfig(state, action) {
      const oldData = state.saleConfigState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.saleConfigState.data = newData;
      } else {
        state.saleConfigState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditSaleConfigStart,
  addEditSaleConfigSuccess,
  addEditSaleConfigFailure,
  setSaleConfig,
  updateSaleConfig,
  fetchSingleSaleConfigStart,
  fetchSingleSaleConfigSuccess,
  fetchSingleSaleConfigFailure
} = saleConfigSlice.actions;

export default saleConfigSlice.reducer;
