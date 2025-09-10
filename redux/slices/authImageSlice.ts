import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IAuthImages = BaseModel & {
  user?: {
    userLoginImage?: string;
    userRegistrationImage?: string;
    userForgetPasswordImage?: string;
    userOtpVerifyImage?: string;
    userUpdatePasswordImage?: string;
  };
  astrologer?: {
    astrologerRegistrationImage?: string;
    astrologerLoginImage?: string;
    astrologerForgetPasswordImage?: string;
    astrologerOtpVerifyImage?: string;
    astrologerUpdatePasswordImage?: string;
  };
};

const initialState = {
  authImageState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IAuthImages | null>
};

export const fetchAuthImage = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('authImage/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleAuthImageStart());

    const response = await fetchApi('/auth_Images/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleAuthImageSuccess(response?.authImages));

      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch authImage data';
      dispatch(fetchSingleAuthImageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleAuthImageFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditAuthImage = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'authImage/addEditAuthImage',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        authImage: {
          authImageState: { data }
        }
      } = getState();

      dispatch(addEditAuthImageStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        user: clonedData.user ? JSON.stringify(clonedData.user) : undefined,
        astrologer: clonedData.astrologer
          ? JSON.stringify(clonedData.astrologer)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/auth_Images/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditAuthImageSuccess());
        dispatch(setAuthImage(null));
        dispatch(fetchAuthImage(null)); // Re-fetch to update the latest data
        toast.success('authImage data updated successfully');
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save authImage data';
        dispatch(addEditAuthImageFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditAuthImageFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const authImageSlice = createSlice({
  name: 'authImage',
  initialState,
  reducers: {
    fetchAuthImageStart(state) {
      state.authImageState.loading = true;
      state.authImageState.error = null;
    },
    addEditAuthImageStart(state) {
      state.authImageState.loading = true;
      state.authImageState.error = null;
    },
    addEditAuthImageSuccess(state) {
      state.authImageState.loading = false;
      state.authImageState.error = null;
    },
    setAuthImage(state, action) {
      state.authImageState.data = action.payload;
    },
    addEditAuthImageFailure(state, action) {
      state.authImageState.loading = false;
      state.authImageState.error = action.payload;
    },
    fetchSingleAuthImageStart(state) {
      state.authImageState.loading = true;
      state.authImageState.error = null;
    },
    fetchSingleAuthImageSuccess(state, action) {
      state.authImageState.loading = false;
      state.authImageState.data = action.payload;
      state.authImageState.error = null;
    },
    fetchSingleAuthImageFailure(state, action) {
      state.authImageState.loading = false;
      state.authImageState.error = action.payload;
    },
    updateAuthImage(state, action) {
      const oldData = state.authImageState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.authImageState.data = newData;
      } else {
        state.authImageState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditAuthImageStart,
  addEditAuthImageSuccess,
  addEditAuthImageFailure,
  setAuthImage,
  updateAuthImage,
  fetchSingleAuthImageStart,
  fetchSingleAuthImageSuccess,
  fetchSingleAuthImageFailure
} = authImageSlice.actions;

export default authImageSlice.reducer;
