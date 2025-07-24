import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IDownloadSection = BaseModel & {
  contentSection?: {
    googleplayImage?: string;
    appStoreImage?: string;
    title?: {
      en?: string;
      hi?: string;
    };
    description?: {
      en?: string;
      hi?: string;
    };
    googleplayLink?: string;
    appStoreLink?: string;
  };
};

const initialState = {
  downloadSectionState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IDownloadSection | null>
};

export const fetchDownloadSection = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleDownloadSectionStart());

    const response = await fetchApi('/download_section/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleDownloadSectionSuccess(response?.downloadSection));
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleDownloadSectionFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleDownloadSectionFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditDownloadSection = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'midbanner/addEditDownloadSection',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        downloadSection: {
          downloadSectionState: { data }
        }
      } = getState();

      dispatch(addEditDownloadSectionStart());

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
        contentSection: clonedData.contentSection
          ? JSON.stringify(clonedData.contentSection)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/download_section/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditDownloadSectionSuccess());
        dispatch(setDownloadSection(null));
        dispatch(fetchDownloadSection(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditDownloadSectionFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditDownloadSectionFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const downloadSectionSlice = createSlice({
  name: 'downloadSection',
  initialState,
  reducers: {
    fetchHomeAboutStart(state) {
      state.downloadSectionState.loading = true;
      state.downloadSectionState.error = null;
    },
    addEditDownloadSectionStart(state) {
      state.downloadSectionState.loading = true;
      state.downloadSectionState.error = null;
    },
    addEditDownloadSectionSuccess(state) {
      state.downloadSectionState.loading = false;
      state.downloadSectionState.error = null;
    },
    setDownloadSection(state, action) {
      state.downloadSectionState.data = action.payload;
    },
    addEditDownloadSectionFailure(state, action) {
      state.downloadSectionState.loading = false;
      state.downloadSectionState.error = action.payload;
    },
    fetchSingleDownloadSectionStart(state) {
      state.downloadSectionState.loading = true;
      state.downloadSectionState.error = null;
    },
    fetchSingleDownloadSectionSuccess(state, action) {
      state.downloadSectionState.loading = false;
      state.downloadSectionState.data = action.payload;
      state.downloadSectionState.error = null;
    },
    fetchSingleDownloadSectionFailure(state, action) {
      state.downloadSectionState.loading = false;
      state.downloadSectionState.error = action.payload;
    },
    updateDownloadSection(state, action) {
      const oldData = state.downloadSectionState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.downloadSectionState.data = newData;
      } else {
        state.downloadSectionState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditDownloadSectionStart,
  addEditDownloadSectionSuccess,
  addEditDownloadSectionFailure,
  setDownloadSection,
  updateDownloadSection,
  fetchSingleDownloadSectionStart,
  fetchSingleDownloadSectionSuccess,
  fetchSingleDownloadSectionFailure
} = downloadSectionSlice.actions;

export default downloadSectionSlice.reducer;
