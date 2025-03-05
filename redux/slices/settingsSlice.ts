import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { cloneDeep } from 'lodash';
import { fetchApi } from '@/services/utlis/fetchApi';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';

export type ISetting = BaseModel & {
  image?: {
    dark_logo?: string;
    light_logo?: string;
  };
  general?: {
    copyright?: string;
  };
  app?: {
    play_store_link?: string;
    app_store_link?: string;
  };
  social_links?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    x?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeyword?: string;
  };
  contactUs?: {
    shortDescription?: string;
    address?: string;
    contact?: string;
    eMail?: string;
  };
};

const initialState = {
  settingState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ISetting | null>
};

export const fetchSetting = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('setting/fetchSetting', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSettingStart());

    const response = await fetchApi('/setting/get', {
      method: 'GET'
    });

    if (response?.success) {
      dispatch(fetchSettingSuccess(response?.data));
      return response.data;
    } else {
      const errorMsg = response?.message ?? 'Failed to fetch settings!';
      dispatch(fetchSettingFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Failed to fetch settings!';
    dispatch(fetchSettingFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditSettingPage = createAsyncThunk<
  any,
  null,
  { state: RootState }
>('setting/settingpage', async (_, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      settings: {
        settingState: { data }
      }
    } = getState();

    dispatch(addEditSettingPageStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    console.log('setting 1', data);

    const clonedData = cloneDeep(data);

    let imagesALl = {};

    console.log('setting 2');

    if (clonedData?.image) {
      console.log('setting 3');
      imagesALl = await processNestedFields(clonedData.image || {});
      console.log('setting 4', imagesALl);

      clonedData.image = imagesALl;
    }

    console.log('setting 5', imagesALl);

    // Prepare FormData
    const formData = new FormData();
    const reqData: any = {
      image: clonedData.image ? JSON.stringify(clonedData.image) : undefined,
      general: clonedData.general
        ? JSON.stringify(clonedData.general)
        : undefined,
      app: clonedData.app ? JSON.stringify(clonedData.app) : undefined,
      social_links: clonedData.social_links
        ? JSON.stringify(clonedData.social_links)
        : undefined,
      seo: clonedData.seo ? JSON.stringify(clonedData.seo) : undefined,
      contactUs: clonedData.contactUs
        ? JSON.stringify(clonedData.contactUs)
        : undefined
    };

    console.log('setting 2', reqData);
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });
    console.log('form data is', formData);
    let response = await fetchApi('/setting/createorupdate', {
      method: 'POST',
      body: formData
    });

    if (response?.success) {
      dispatch(addEditSettingSuccess());
      dispatch(setSetting(null));
      dispatch(fetchSetting(null));
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong!';
      dispatch(addEditSettingFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!';
    dispatch(addEditSettingFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    addEditSettingPageStart(state) {
      state.settingState.loading = true;
      state.settingState.error = null;
    },
    addEditSettingSuccess(state) {
      state.settingState.loading = false;
      state.settingState.error = null;
    },
    addEditSettingFailure(state, action) {
      state.settingState.loading = false;
      state.settingState.error = action.payload;
    },
    setSetting(state, action) {
      state.settingState.data = action.payload;
    },
    fetchSettingStart(state) {
      state.settingState.loading = true;
      state.settingState.error = null;
    },
    fetchSettingSuccess(state, action) {
      state.settingState.loading = false;
      state.settingState.data = action.payload;
      state.settingState.error = null;
    },
    fetchSettingFailure(state, action) {
      state.settingState.loading = false;
      state.settingState.error = action.payload;
    },
    updateSetting(state, action) {
      const oldData = state.settingState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.settingState.data = {
          ...newData
        };
      } else {
        state.settingState.data = { ...oldData, ...action.payload };
      }
    }
  }
});

export const {
  addEditSettingFailure,
  addEditSettingPageStart,
  addEditSettingSuccess,
  setSetting,
  fetchSettingStart,
  fetchSettingSuccess,
  fetchSettingFailure,
  updateSetting
} = settingSlice.actions;

export default settingSlice.reducer;
