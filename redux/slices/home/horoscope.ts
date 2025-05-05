import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type IHoroscope = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  slug?: string;
  icon_image?: string;
  sequence?: number;
  active?: boolean;
  starting_date?: {
    month: String;
    date: String;
  };
  ending_date?: {
    month: String;
    date: String;
  };
};

const initialState = {
  horoscopeList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IHoroscope[]>,
  singleHoroscopeState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IHoroscope | null>
};

export const addEditHoroscopeList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'home/addEditHoroscopeList',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        horoscope: {
          singleHoroscopeState: { data }
        }
      } = getState();

      dispatch(addEditHoroscopeListStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        title: clonedData.title ? JSON.stringify(clonedData.title) : undefined,
        icon_image: clonedData.icon_image,
        slug: clonedData.slug,
        sequence: clonedData.sequence,
        active: clonedData.active
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/home/horoscope/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/home/horoscope/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditHoroscopeListSuccess());
        dispatch(fetchHoroscopeList());
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditHoroscopeListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditHoroscopeListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchHoroscopeList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field?: string;
    active?: string;
    exportData?: boolean;
  } | void,
  { state: RootState }
>(
  'home/fetchHoroscopeList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};
      dispatch(fetchHoroscopeListStart());

      const response = await fetchApi(
        `/home/Horoscope/all?page=${page || 1}&limit=${pageSize || 10}&field=${
          field || ''
        }&text=${keyword || ''}&active=${active || ''}&exportData=${
          exportData || false
        }`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchHoroscopeListSuccess({
              data: response.horoscope,
              totalCount: response.totalHoroscopeCount
            })
          );
        } else {
          dispatch(fetchHoroscopeExportLoading(false));
        }

        return response;
      } else {
        throw new Error('No Status Or Invalid Response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchHoroscopeListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleHoroscopeList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'home/fetchSingleHoroscope',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleHoroscopeListStart());
      const response = await fetchApi(`/home/horoscope/get/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleHoroscopeListSuccess(response?.horoscope));

        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchSingleHoroscopeListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleHoroscopeListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteHoroscope = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('brand/delete', async (id, { dispatch }) => {
  dispatch(deleteHoroscopeStart());
  try {
    const response = await fetchApi(`/home/horoscope/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteHoroscopeSuccess(id));
      dispatch(fetchHoroscopeList());
      toast.success('Slider deleted successfuly');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteHoroscopeFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteHoroscopeFailure(error.message || 'Failed to delete slider')
    );
    toast.error(error.message);
  }
});

const horoscopeSlice = createSlice({
  name: 'horoscope',
  initialState,
  reducers: {
    setHoroscopeListData(state, action) {
      state.singleHoroscopeState.data = action.payload;
    },
    updateHoroscopeListData(state, action) {
      const oldData = state.singleHoroscopeState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleHoroscopeState.data = newData;
      } else {
        state.singleHoroscopeState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditHoroscopeListStart(state) {
      state.singleHoroscopeState.loading = true;
      state.singleHoroscopeState.error = null;
    },
    addEditHoroscopeListSuccess(state) {
      state.singleHoroscopeState.loading = false;
      state.singleHoroscopeState.error = null;
    },
    addEditHoroscopeListFailure(state, action) {
      state.singleHoroscopeState.loading = false;
      state.singleHoroscopeState.error = action.payload;
    },
    fetchHoroscopeListStart(state) {
      state.horoscopeList.loading = true;
      state.horoscopeList.error = null;
    },
    fetchHoroscopeListSuccess(state, action) {
      state.horoscopeList.loading = false;
      const { data, totalCount } = action.payload;
      state.horoscopeList.data = data;
      state.horoscopeList.pagination.totalCount = totalCount;
      state.horoscopeList.error = null;
    },
    fetchHoroscopeListFailure(state, action) {
      state.horoscopeList.loading = false;
      state.horoscopeList.error = action.payload;
    },
    fetchSingleHoroscopeListStart(state) {
      state.singleHoroscopeState.loading = true;
      state.singleHoroscopeState.error = null;
    },
    fetchSingleHoroscopeListFailure(state, action) {
      state.singleHoroscopeState.loading = false;
      state.singleHoroscopeState.data = action.payload;
    },
    fetchSingleHoroscopeListSuccess(state, action) {
      state.singleHoroscopeState.loading = false;
      state.singleHoroscopeState.data = action.payload;
      state.singleHoroscopeState.error = null;
    },
    deleteHoroscopeStart(state) {
      state.singleHoroscopeState.loading = true;
      state.singleHoroscopeState.error = null;
    },
    deleteHoroscopeSuccess(state, action) {
      state.singleHoroscopeState.loading = false;
    },
    deleteHoroscopeFailure(state, action) {
      state.singleHoroscopeState.loading = false;
      state.singleHoroscopeState.error = action.payload;
    },
    fetchHoroscopeExportLoading(state, action) {
      state.horoscopeList.loading = action.payload;
    }
  }
});

export const {
  setHoroscopeListData,
  fetchHoroscopeExportLoading,
  fetchHoroscopeListFailure,
  fetchHoroscopeListStart,
  fetchHoroscopeListSuccess,
  fetchSingleHoroscopeListFailure,
  fetchSingleHoroscopeListStart,
  fetchSingleHoroscopeListSuccess,
  addEditHoroscopeListFailure,
  addEditHoroscopeListStart,
  addEditHoroscopeListSuccess,
  deleteHoroscopeStart,
  deleteHoroscopeSuccess,
  updateHoroscopeListData,
  deleteHoroscopeFailure
} = horoscopeSlice.actions;

export default horoscopeSlice.reducer;
