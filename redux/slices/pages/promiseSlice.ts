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

export type IRefundPolicy = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  description?: {
    en?: string;
    hi?: string;
  };
};

export type ICancellationPolicy = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  description?: {
    en?: string;
    hi?: string;
  };
};

export type IShippingPolicy = BaseModel & {
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
  } as BaseState<IPrivacyPolicy | null>,
  refundPolicyState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IRefundPolicy | null>,
  cancellationPolicyState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ICancellationPolicy | null>,
  shippingPolicyState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IShippingPolicy | null>
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
      console.log('not able to fetch');
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

export const addEditRefundPolicysPage = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'pages/refundPolicyspage',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        promise: {
          refundPolicyState: { data }
        }
      } = getState();

      dispatch(addEditRefundPolicysPageStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      console.log('refund', data);

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

      let response = await fetchApi('/pages/refundpolicy/create', {
        method: 'POST',
        body: formData
      });
      if (response?.success) {
        dispatch(addEditRefundPolicysPageSuccess());
        dispatch(setRefundPolicysPage(null));
        dispatch(fetchRefundPolicysPage(null));
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
        dispatch(addEditRefundPolicysPageSuccess(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditRefundPolicysPageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchRefundPolicysPage = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'pages/refundPolicyspage',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchPrivacyPolicysPageStart());
      const response = await fetchApi(`/pages/refundpolicy/get`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchRefundPolicysPageSuccess(response?.data));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchRefundPolicysPageFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchRefundPolicysPageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditCancellationPolicysPage = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'pages/cancellationPolicyspage',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        promise: {
          cancellationPolicyState: { data }
        }
      } = getState();

      dispatch(addEditCancellationPolicysPageStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      console.log('cancel', data);

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

      let response = await fetchApi('/pages/cancellationpolicy/create', {
        method: 'POST',
        body: formData
      });
      if (response?.success) {
        dispatch(addEditCancellationPolicysPageSuccess());
        dispatch(setCancellationPolicysPage(null));
        dispatch(fetchCancellationPolicysPage(null));
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
        dispatch(addEditCancellationPolicysPageSuccess(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditCancellationPolicysPageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchCancellationPolicysPage = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'pages/cancellationPolicyspage',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchCancellationPolicysPageStart());
      const response = await fetchApi(`/pages/cancellationpolicy/get`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchCancellationPolicysPageSuccess(response?.data));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchCancellationPolicysPageFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchCancellationPolicysPageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditShippingPolicysPage = createAsyncThunk<
  any,
  null,
  { state: RootState }
>(
  'pages/shippingPolicyspage',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        promise: {
          shippingPolicyState: { data }
        }
      } = getState();

      dispatch(addEditShippingPolicysPageStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      console.log('cancel', data);

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

      let response = await fetchApi('/pages/shippingpolicy/create', {
        method: 'POST',
        body: formData
      });
      if (response?.success) {
        dispatch(addEditShippingPolicysPageSuccess());
        dispatch(setShippingPolicysPage(null));
        dispatch(fetchShippingPolicysPage(null));
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
        dispatch(addEditShippingPolicysPageSuccess(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditShippingPolicysPageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchShippingPolicysPage = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'pages/shippingPolicyspage',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchShippingPolicysPageStart());
      const response = await fetchApi(`/pages/shippingpolicy/get`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchShippingPolicysPageSuccess(response?.data));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchShippingPolicysPageFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchShippingPolicysPageFailure(errorMsg));
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
    },

    fetchRefundPolicysPageStart(state) {
      state.refundPolicyState.loading = true;
      state.refundPolicyState.error = null;
    },
    fetchRefundPolicysPageSuccess(state, action) {
      state.refundPolicyState.loading = false;
      state.refundPolicyState.data = action.payload;
      state.refundPolicyState.error = null;
    },
    fetchRefundPolicysPageFailure(state, action) {
      state.refundPolicyState.loading = false;
      state.refundPolicyState.error = action.payload;
    },
    setRefundPolicysPage(state, action) {
      state.refundPolicyState.data = action.payload;
    },
    updateRefundPolicysPage(state, action) {
      const oldData = state.refundPolicyState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.refundPolicyState.data = newData;
      } else {
        state.refundPolicyState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditRefundPolicysPageStart(state) {
      state.refundPolicyState.loading = true;
      state.refundPolicyState.error = null;
    },
    addEditRefundPolicysPageSuccess(state) {
      state.refundPolicyState.loading = false;
      state.refundPolicyState.error = null;
    },
    addEditRefundPolicysPageFailure(state, action) {
      state.refundPolicyState.loading = false;
      state.refundPolicyState.error = action.payload;
    },

    fetchCancellationPolicysPageStart(state) {
      state.cancellationPolicyState.loading = true;
      state.cancellationPolicyState.error = null;
    },
    fetchCancellationPolicysPageSuccess(state, action) {
      state.cancellationPolicyState.loading = false;
      state.cancellationPolicyState.data = action.payload;
      state.cancellationPolicyState.error = null;
    },
    fetchCancellationPolicysPageFailure(state, action) {
      state.cancellationPolicyState.loading = false;
      state.cancellationPolicyState.error = action.payload;
    },
    setCancellationPolicysPage(state, action) {
      state.cancellationPolicyState.data = action.payload;
    },
    updateCancellationPolicysPage(state, action) {
      const oldData = state.cancellationPolicyState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.cancellationPolicyState.data = newData;
      } else {
        state.cancellationPolicyState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditCancellationPolicysPageStart(state) {
      state.cancellationPolicyState.loading = true;
      state.cancellationPolicyState.error = null;
    },
    addEditCancellationPolicysPageSuccess(state) {
      state.cancellationPolicyState.loading = false;
      state.cancellationPolicyState.error = null;
    },
    addEditCancellationPolicysPageFailure(state, action) {
      state.cancellationPolicyState.loading = false;
      state.cancellationPolicyState.error = action.payload;
    },

    fetchShippingPolicysPageStart(state) {
      state.shippingPolicyState.loading = true;
      state.shippingPolicyState.error = null;
    },
    fetchShippingPolicysPageSuccess(state, action) {
      state.shippingPolicyState.loading = false;
      state.shippingPolicyState.data = action.payload;
      state.shippingPolicyState.error = null;
    },
    fetchShippingPolicysPageFailure(state, action) {
      state.shippingPolicyState.loading = false;
      state.shippingPolicyState.error = action.payload;
    },
    setShippingPolicysPage(state, action) {
      state.shippingPolicyState.data = action.payload;
    },
    updateShippingPolicysPage(state, action) {
      const oldData = state.shippingPolicyState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.shippingPolicyState.data = newData;
      } else {
        state.shippingPolicyState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditShippingPolicysPageStart(state) {
      state.shippingPolicyState.loading = true;
      state.shippingPolicyState.error = null;
    },
    addEditShippingPolicysPageSuccess(state) {
      state.shippingPolicyState.loading = false;
      state.shippingPolicyState.error = null;
    },
    addEditShippingPolicysPageFailure(state, action) {
      state.shippingPolicyState.loading = false;
      state.shippingPolicyState.error = action.payload;
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
  updatePrivacyPolicysPage,

  addEditRefundPolicysPageFailure,
  addEditRefundPolicysPageStart,
  addEditRefundPolicysPageSuccess,
  fetchRefundPolicysPageFailure,
  fetchRefundPolicysPageStart,
  fetchRefundPolicysPageSuccess,
  setRefundPolicysPage,
  updateRefundPolicysPage,

  addEditCancellationPolicysPageFailure,
  addEditCancellationPolicysPageStart,
  addEditCancellationPolicysPageSuccess,
  fetchCancellationPolicysPageFailure,
  fetchCancellationPolicysPageStart,
  fetchCancellationPolicysPageSuccess,
  setCancellationPolicysPage,
  updateCancellationPolicysPage,

  addEditShippingPolicysPageFailure,
  addEditShippingPolicysPageStart,
  addEditShippingPolicysPageSuccess,
  fetchShippingPolicysPageFailure,
  fetchShippingPolicysPageStart,
  fetchShippingPolicysPageSuccess,
  setShippingPolicysPage,
  updateShippingPolicysPage
} = conditonSlice.actions;

export default conditonSlice.reducer;
