import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { da } from 'date-fns/locale';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type IRequest = BaseModel & {
  _id?: string;
  name?: string;
  date_of_birth?: any;
  gender?: string;
  languages?: any[];
  skills?: any[];
  email?: string;
  phone?: string;
  password?: string;
  image?: any;
  status?: string;
  oldstatus?: string;
  active?: boolean;
  showinhome?: boolean;
  about?: {
    en?: string;
    hi?: string;
  };
  education?: any;
  expierience?: number;
  day?: string;
  title?: string;
  slotno?: any;
  startTime?: any;
  slottype?: any;
  sequence?: number;
};

const initialState = {
  astrologersListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IRequest[]>,
  singleRequestState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IRequest | null>,
  currentRequestState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IRequest | null>,
  changeRequestPassword: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IRequest | null>,
  slotsState: {
    data: [],
    loading: false,
    error: null,
    totalCount: 0
  },
  singleSlotState: {
    data: [],
    loading: false,
    error: null
  } as BaseState<any | null>,
  availabilityState: {
    data: [],
    loading: false,
    error: null,
    totalCount: 0
  },
  singleAvailabilityState: {
    data: [],
    loading: false,
    error: null
  } as BaseState<any | null>
};

export const fetchAstrologersList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field: string;
    status: string;
    exportData: string;
    active?: string;
  } | void,
  { state: RootState }
>(
  'request/fetchastrologersList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, status, exportData, active } =
        input || {};

      dispatch(fetchAstrologersStart());
      const response = await fetchApi(
        `/astrodetails/all?page=${page || 1}&limit=${pageSize || 10}&text=${
          keyword || ''
        }&field=${field || ''}&status=${status || ''}&export=${
          exportData || ''
        }&active=${active || ''}`,
        { method: 'GET' }
      );
      // Check if the API response is valid and has the expected data
      if (response?.success) {
        dispatch(
          fetchAstrologersListSuccess({
            data: response.astroDetial,
            totalCount: response.totalCount
          })
        );
      } else {
        // Handle response with no status or an error
        throw new Error('No status or invalid response');
      }
      return response;
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchAstrologersFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const addEditRequest = createAsyncThunk<
  any,
  any | null,
  { state: RootState }
>('request/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      astrologersData: {
        singleRequestState: { data }
      }
    } = getState();

    dispatch(addEditRequestStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    const formData = new FormData();
    const reqData: any = {
      name: data.name || '',
      date_of_birth: data.date_of_birth || '',
      gender: data.gender || '',
      // Ensure languages and skills are arrays of strings (IDs)
      languages: Array.isArray(data.languages)
        ? data.languages.map((l: any) =>
            typeof l === 'object' && l._id ? l._id : l
          )
        : [],
      skills: Array.isArray(data.skills)
        ? data.skills.map((s: any) =>
            typeof s === 'object' && s._id ? s._id : s
          )
        : [],
      pricing: [{ duration: 15, price: '' }],
      email: data.email || '',
      phone: data.phone || '',
      password: data.password || '',
      image: data.image || null,
      status: data.status || 'pending',
      active: data.active,
      showinhome: data.showinhome,
      education: data.education,
      about: data.about, // keep as object
      expierience: data.expierience,
      sequence: data.sequence
    };
    const oldstatus = data?.oldstatus;
    console.log('data is hhere inside the alsice is ', oldstatus);
    // Append only defined fields to FormData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'skills' || key === 'languages') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'about') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string | Blob);
        }
      }
    });

    let response;
    if (!entityId) {
      response = await fetchApi('/astrodetails/new', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/astrodetails/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }
    if (response?.success) {
      dispatch(addEditRequestSuccess());
      dispatch(
        fetchAstrologersList({
          status: oldstatus || '',
          field: '',
          exportData: ''
        })
      );
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
      dispatch(addEditRequestFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditRequestFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});
export const fetchSingleRequest = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  '/astrodetails/single',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleRequestStart());
      const response = await fetchApi(`/astrodetails/single/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleRequestSuccess(response?.astroDetial));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleRequestFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleRequestFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteRequest = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('request/delete', async (id, { dispatch }) => {
  dispatch(deleteRequestStart());
  try {
    const response = await fetchApi(`/promo/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteRequestSuccess(id));
      dispatch(fetchAstrologersList());
      toast.success('Request deleted successfuly');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteRequestFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(deleteRequestFailure(error.message || 'Failed to delete request'));
    toast.error(error.message);
  }
});
export const fetchSlotsList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    astroId?: string;
  } | void,
  { state: RootState }
>('request/slots', async (input, { dispatch, rejectWithValue, getState }) => {
  try {
    const { page, pageSize, astroId } = input || {};
    dispatch(fetchSlotsStart());
    const response = await fetchApi(
      `/slots/all/${astroId}?page=${page || 1}&limit=${pageSize || 10}`,
      { method: 'GET' }
    );
    // Check if the API response is valid and has the expected data
    if (response?.success) {
      dispatch(
        fetchSlotsListSuccess({
          data: response?.astroSlots,
          totalCount: response.totalCount
        })
      );
    } else {
      // Handle response with no status or an error
      throw new Error('No status or invalid response');
    }
    return response;
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(fetchSlotsFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});
export const addEditSlot = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('request/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      astrologersData: {
        singleSlotState: { data }
      }
    } = getState();
    dispatch(addEditSlotsStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }
    const formData = new FormData();
    const reqData: any = {
      title: data?.title,
      astroId: data.astroId,
      price: data.price,
      duration: data.duration
    };
    // Append only defined fields to FormData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });
    let response;
    if (!entityId) {
      response = await fetchApi('/slots/add', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/slots/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }
    if (response?.success) {
      dispatch(addEditSlotsSuccess());
      dispatch(fetchSlotsList({ astroId: data.astroId }));
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
      dispatch(addEditSlotsFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditSlotsFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});
export const fetchSingleSlot = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('/slot/single', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    dispatch(fetchSingleSlotStart());
    const response = await fetchApi(`/slots/single/${entityId}`, {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleSlotSuccess(response?.astroDetial));
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      dispatch(fetchSingleSlotFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    let errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleSlotFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const deleteSlot = createAsyncThunk<any, string, { state: RootState }>(
  'slot/delete',
  async (id, { dispatch }) => {
    dispatch(deleteSlotStart());
    try {
      const response = await fetchApi(`/slots/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        dispatch(deleteSlotSuccess(id));
        dispatch(fetchSlotsList());
        toast.success('Slot deleted successfuly');
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        toast.error(errorMsg);
        dispatch(deleteSlotFailure(errorMsg));
      }
    } catch (error: any) {
      dispatch(deleteSlotFailure(error.message || 'Failed to delete request'));
      toast.error(error.message);
    }
  }
);
export const fetchAvailabilityList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    astroId?: string;
  } | void,
  { state: RootState }
>(
  'request/availability',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, astroId } = input || {};
      dispatch(fetchAvailabilityStart());
      const response = await fetchApi(
        `/availability/all/${astroId}?page=${page || 1}&limit=${
          pageSize || 10
        }`,
        { method: 'GET' }
      );
      // Check if the API response is valid and has the expected data
      if (response?.success) {
        dispatch(
          fetchAvailabilityListSuccess({
            data: response?.astroAvailability,
            totalCount: response.totalCount
          })
        );
      } else {
        // Handle response with no status or an error
        throw new Error('No status or invalid response');
      }
      return response;
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchAvailabilityFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const addEditAvailability = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'availability/add',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        astrologersData: {
          singleAvailabilityState: { data }
        }
      } = getState();
      dispatch(addEditAvailabilityStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }
      const formData = new FormData();
      const reqData: any = {
        day: data.day,
        startTime: data.startTime,
        slotno: data.slotno,
        slottype: data.slottype,
        astroId: data.astroId
      };
      // Append only defined fields to FormData
      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });
      let response;
      if (!entityId) {
        response = await fetchApi('/availability/add', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/availability/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }
      if (response?.success) {
        dispatch(addEditAvailabilitySuccess());
        dispatch(fetchAvailabilityList({ astroId: data.astroId }));
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
        dispatch(addEditAvailabilityFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditAvailabilityFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const fetchSingleAvailability = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  '/availability/single',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleAvailabilityStart());
      const response = await fetchApi(`/availability/single/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleAvailabilitySuccess(response?.astroDetial));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleAvailabilityFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleAvailabilityFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteAvailability = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('availability/delete', async (id, { dispatch }) => {
  dispatch(deleteAvailabilityStart());
  try {
    const response = await fetchApi(`/availability/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteAvailabilitySuccess(id));
      dispatch(fetchAvailabilityList());
      toast.success('Availability deleted successfuly');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteAvailabilityFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteAvailabilityFailure(error.message || 'Failed to delete request')
    );
    toast.error(error.message);
  }
});

export const updateAvailabilitySlot = createAsyncThunk<
  any,
  {
    slotId: string;
    availabilityId: string;
    active?: boolean;
    status?: boolean;
  },
  { state: RootState }
>(
  'availability/add',
  async (
    { slotId, availabilityId, active, status },
    { dispatch, rejectWithValue, getState }
  ) => {
    try {
      const reqData: any = {
        slotId,
        availabilityId,
        active,
        status
      };

      let response = await fetchApi(`/availability/updateslot`, {
        method: 'PUT',
        body: reqData
      });

      if (response?.success) {
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      return rejectWithValue(errorMsg);
    }
  }
);

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    fetchAstrologersStart(state) {
      state.astrologersListState.loading = true;
      state.astrologersListState.error = null;
    },
    fetchAstrologersListSuccess(state, action) {
      state.astrologersListState.loading = false;
      const { data, totalCount } = action.payload;
      state.astrologersListState.data = data;
      state.astrologersListState.pagination.totalCount = totalCount;
      state.astrologersListState.error = null;
    },
    fetchAstrologersFailure(state, action) {
      state.astrologersListState.loading = false;
      state.astrologersListState.error = action.payload;
    },
    setRequestData(state, action) {
      state.singleRequestState.data = action.payload;
    },
    updateRequestData(state, action) {
      const oldData = state.singleRequestState.data;
      const keyFirst = Object.keys(action.payload)[0];
      let merged: IRequest = {} as IRequest;
      if (keyFirst.includes('.')) {
        const newData: IRequest = { ...(oldData as IRequest) };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        merged = newData;
      } else {
        merged = { ...(oldData as IRequest), ...action.payload };
      }
      // Always coerce about to an object if it is a string or null
      if (merged.about === null || typeof merged.about === 'string') {
        merged.about = { en: merged.about || '' };
      }
      state.singleRequestState.data = merged;
    },
    addEditRequestStart(state) {
      state.singleRequestState.loading = true;
      state.singleRequestState.error = null;
    },
    addEditRequestSuccess(state) {
      state.singleRequestState.loading = false;
      state.singleRequestState.data = null;
      toast.success('Request Added/Updated Successfuly');
    },
    addEditRequestFailure(state, action) {
      state.singleRequestState.loading = false;
      state.singleRequestState.error = action.payload;
    },
    fetchSingleRequestStart(state) {
      state.singleRequestState.loading = true;
      state.singleRequestState.error = null;
    },
    fetchSingleRequestSuccess(state, action) {
      state.singleRequestState.loading = false;
      state.singleRequestState.data = action.payload;
      state.singleRequestState.error = null;
    },
    fetchSingleRequestFailure(state, action) {
      state.singleRequestState.loading = false;
      state.singleRequestState.error = action.payload;
    },
    deleteRequestStart(state) {
      state.singleRequestState.loading = true;
      state.singleRequestState.error = null;
    },
    deleteRequestSuccess(state, action) {
      state.singleRequestState.loading = false;
    },
    deleteRequestFailure(state, action) {
      state.singleRequestState.loading = false;
      state.singleRequestState.error = action.payload;
    },
    fetchSlotsStart(state) {
      state.slotsState.loading = true;
      state.slotsState.error = null;
    },
    fetchSlotsListSuccess(state, action) {
      state.slotsState.loading = false;
      const { data, totalCount } = action.payload;
      state.slotsState.data = data;
      state.slotsState.totalCount = totalCount;
      state.slotsState.error = null;
    },
    fetchSlotsFailure(state, action) {
      state.slotsState.loading = false;
      state.slotsState.error = action.payload;
    },
    setSlotsData(state, action) {
      state.singleSlotState.data = action.payload;
    },
    updateSlotsData(state, action) {
      const oldData = state.singleSlotState.data;
      state.singleSlotState.data = { ...oldData, ...action.payload };
    },
    addEditSlotsStart(state) {
      state.singleSlotState.loading = true;
      state.singleSlotState.error = null;
    },
    addEditSlotsSuccess(state) {
      state.singleSlotState.loading = false;
      state.singleSlotState.error = null;
    },
    addEditSlotsFailure(state, action) {
      state.singleSlotState.loading = false;
      state.singleSlotState.error = action.payload;
    },
    fetchSingleSlotStart(state) {
      state.singleSlotState.loading = true;
      state.singleSlotState.error = null;
    },
    fetchSingleSlotSuccess(state, action) {
      state.singleSlotState.loading = false;
      state.singleSlotState.data = action.payload;
      state.singleSlotState.error = null;
    },
    fetchSingleSlotFailure(state, action) {
      state.singleSlotState.loading = false;
      state.singleSlotState.error = action.payload;
    },
    deleteSlotStart(state) {
      state.singleSlotState.loading = true;
      state.singleSlotState.error = null;
    },
    deleteSlotSuccess(state, action) {
      state.singleSlotState.loading = false;
    },
    deleteSlotFailure(state, action) {
      state.singleSlotState.loading = false;
      state.singleSlotState.error = action.payload;
    },
    fetchAvailabilityStart(state) {
      state.availabilityState.loading = true;
      state.availabilityState.error = null;
    },
    fetchAvailabilityListSuccess(state, action) {
      state.availabilityState.loading = false;
      const { data, totalCount } = action.payload;
      state.availabilityState.data = data;
      state.availabilityState.totalCount = totalCount;
      state.availabilityState.error = null;
    },
    fetchAvailabilityFailure(state, action) {
      state.availabilityState.loading = false;
      state.availabilityState.error = action.payload;
    },
    setAvailabilityData(state, action) {
      state.singleAvailabilityState.data = action.payload;
    },
    updateAvailabilityData(state, action) {
      const oldData = state.singleAvailabilityState.data;
      state.singleAvailabilityState.data = { ...oldData, ...action.payload };
    },
    addEditAvailabilityStart(state) {
      state.singleAvailabilityState.loading = true;
      state.singleAvailabilityState.error = null;
    },
    addEditAvailabilitySuccess(state) {
      state.singleAvailabilityState.loading = false;
      state.singleAvailabilityState.error = null;
    },
    addEditAvailabilityFailure(state, action) {
      state.singleAvailabilityState.loading = false;
      state.singleAvailabilityState.error = action.payload;
    },
    fetchSingleAvailabilityStart(state) {
      state.singleAvailabilityState.loading = true;
      state.singleAvailabilityState.error = null;
    },
    fetchSingleAvailabilitySuccess(state, action) {
      state.singleAvailabilityState.loading = false;
      state.singleAvailabilityState.data = action.payload;
      state.singleAvailabilityState.error = null;
    },
    fetchSingleAvailabilityFailure(state, action) {
      state.singleAvailabilityState.loading = false;
      state.singleAvailabilityState.error = action.payload;
    },
    deleteAvailabilityStart(state) {
      state.singleAvailabilityState.loading = true;
      state.singleAvailabilityState.error = null;
    },
    deleteAvailabilitySuccess(state, action) {
      state.singleAvailabilityState.loading = false;
    },
    deleteAvailabilityFailure(state, action) {
      state.singleAvailabilityState.loading = false;
      state.singleAvailabilityState.error = action.payload;
    }
  }
});

export const {
  fetchAstrologersStart,
  fetchAstrologersListSuccess,
  fetchAstrologersFailure,
  addEditRequestStart,
  addEditRequestSuccess,
  addEditRequestFailure,
  setRequestData,
  updateRequestData,
  fetchSingleRequestStart,
  fetchSingleRequestSuccess,
  fetchSingleRequestFailure,
  deleteRequestStart,
  deleteRequestFailure,
  deleteRequestSuccess,
  fetchSlotsStart,
  fetchSlotsListSuccess,
  fetchSlotsFailure,
  addEditSlotsStart,
  addEditSlotsSuccess,
  addEditSlotsFailure,
  setSlotsData,
  updateSlotsData,
  fetchSingleSlotStart,
  fetchSingleSlotSuccess,
  fetchSingleSlotFailure,
  deleteSlotStart,
  deleteSlotFailure,
  deleteSlotSuccess,
  fetchAvailabilityStart,
  fetchAvailabilityListSuccess,
  fetchAvailabilityFailure,
  addEditAvailabilityStart,
  addEditAvailabilitySuccess,
  addEditAvailabilityFailure,
  setAvailabilityData,
  updateAvailabilityData,
  fetchSingleAvailabilityStart,
  fetchSingleAvailabilitySuccess,
  fetchSingleAvailabilityFailure,
  deleteAvailabilityStart,
  deleteAvailabilityFailure,
  deleteAvailabilitySuccess
} = requestSlice.actions;

export default requestSlice.reducer;
