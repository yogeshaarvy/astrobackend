import { BaseModel, BaseState } from '@/types/globals';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { fetchApi } from '@/services/utlis/fetchApi';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type ITermConditions = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  description?: {
    en?: string;
    hi?: string;
  };
};

export type IPrivacyPolicy = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  description?: {
    en?: string;
    hi?: string;
  };
};

const initialState = {
  termConditionsState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ITermConditions | null>,
  privayPolicyState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IPrivacyPolicy | null>
};

export const addEditTermConditionsPage = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'pages/termConditions',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        promise: {
          termConditionsState: { data }
        }
      } = getState();

      dispatch(addEditTermConditionsPageStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      console.log('kasbckabsc', data);
      const clonedData = cloneDeep(data);

      const formData = new FormData();
      const reqData: any = {
        title: clonedData.title ? JSON.stringify(clonedData.title) : undefined,
        description: clonedData.description
          ? JSON.stringify(clonedData.description)
          : undefined
      };

      console.log('web clonedData data', reqData);
      console.log('pop1');
      Object.entries(reqData).forEach(([key, value]) => {
        console.log('pop2', key, value);
        if (value !== undefined && value !== null) {
          console.log('pop3');
          formData.append(key, value as string | Blob);
        }
        console.log('pop4');
      });

      console.log('ljcnan', formData);

      let response = await fetchApi('/pages/termconditions/create', {
        method: 'POST',
        body: formData
      });
      if (response?.success) {
        dispatch(addEditTermConditionsPageSuccess());
        dispatch(setTermConditionsPage(null));
        dispatch(fetchTermConditionsPage(null));
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
        dispatch(addEditTermConditionsPageSuccess(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditTermConditionsPageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchTermConditionsPage = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'pages/TermConditionspage',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchTermConditionsPageStart());
      const response = await fetchApi(`/pages/termconditions/get`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchTermConditionsPageSuccess(response?.data));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchTermConditionsPageFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchTermConditionsPageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditPrivacyPolicysPage = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'pages/privacyPolicyspage',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        promise: {
          privayPolicyState: { data }
        }
      } = getState();

      dispatch(addEditPrivacyPolicysPageStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      console.log('kdbdkddvnkn', data);

      const clonedData = cloneDeep(data);

      const formData = new FormData();
      const reqData: any = {
        title: clonedData.title ? JSON.stringify(clonedData.title) : undefined,
        description: clonedData.description
          ? JSON.stringify(clonedData.description)
          : undefined
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response = await fetchApi('/pages/privacypolicy/create', {
        method: 'POST',
        body: formData
      });
      if (response?.success) {
        dispatch(addEditPrivacyPolicysPageSuccess());
        dispatch(setPrivacyPolicysPage(null));
        dispatch(fetchPrivacyPolicysPage(null));
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
        dispatch(addEditPrivacyPolicysPageSuccess(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditPrivacyPolicysPageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchPrivacyPolicysPage = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'pages/privacyPolicyspage',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchPrivacyPolicysPageStart());
      const response = await fetchApi(`/pages/privacypolicy/get`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchPrivacyPolicysPageSuccess(response?.data));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchPrivacyPolicysPageFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchPrivacyPolicysPageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

const conditonSlice = createSlice({
  name: 'condtion',
  initialState,
  reducers: {
    fetchTermConditionsPageStart(state) {
      state.termConditionsState.loading = true;
      state.termConditionsState.error = null;
    },
    fetchTermConditionsPageSuccess(state, action) {
      state.termConditionsState.loading = false;
      state.termConditionsState.data = action.payload;
      state.termConditionsState.error = null;
    },
    fetchTermConditionsPageFailure(state, action) {
      state.termConditionsState.loading = false;
      state.termConditionsState.error = action.payload;
    },
    setTermConditionsPage(state, action) {
      state.termConditionsState.data = action.payload;
    },
    updateTermConditionsPage(state, action) {
      const oldData = state.termConditionsState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.termConditionsState.data = newData;
      } else {
        state.termConditionsState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditTermConditionsPageStart(state) {
      state.termConditionsState.loading = true;
      state.termConditionsState.error = null;
    },
    addEditTermConditionsPageSuccess(state) {
      state.termConditionsState.loading = false;
      state.termConditionsState.error = null;
    },
    addEditTermConditionsPageFailure(state, action) {
      state.termConditionsState.loading = false;
      state.termConditionsState.error = action.payload;
    },

    fetchPrivacyPolicysPageStart(state) {
      state.privayPolicyState.loading = true;
      state.privayPolicyState.error = null;
    },
    fetchPrivacyPolicysPageSuccess(state, action) {
      state.privayPolicyState.loading = false;
      state.privayPolicyState.data = action.payload;
      state.privayPolicyState.error = null;
    },
    fetchPrivacyPolicysPageFailure(state, action) {
      state.privayPolicyState.loading = false;
      state.privayPolicyState.error = action.payload;
    },
    setPrivacyPolicysPage(state, action) {
      state.privayPolicyState.data = action.payload;
    },
    updatePrivacyPolicysPage(state, action) {
      const oldData = state.privayPolicyState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.privayPolicyState.data = newData;
      } else {
        state.privayPolicyState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditPrivacyPolicysPageStart(state) {
      state.privayPolicyState.loading = true;
      state.privayPolicyState.error = null;
    },
    addEditPrivacyPolicysPageSuccess(state) {
      state.privayPolicyState.loading = false;
      state.privayPolicyState.error = null;
    },
    addEditPrivacyPolicysPageFailure(state, action) {
      state.privayPolicyState.loading = false;
      state.privayPolicyState.error = action.payload;
    }
  }
});

export const {
  addEditTermConditionsPageFailure,
  addEditTermConditionsPageStart,
  addEditTermConditionsPageSuccess,
  fetchTermConditionsPageFailure,
  fetchTermConditionsPageStart,
  fetchTermConditionsPageSuccess,
  setTermConditionsPage,
  updateTermConditionsPage,

  addEditPrivacyPolicysPageFailure,
  addEditPrivacyPolicysPageStart,
  addEditPrivacyPolicysPageSuccess,
  fetchPrivacyPolicysPageFailure,
  fetchPrivacyPolicysPageStart,
  fetchPrivacyPolicysPageSuccess,
  setPrivacyPolicysPage,
  updatePrivacyPolicysPage
} = conditonSlice.actions;

export default conditonSlice.reducer;
