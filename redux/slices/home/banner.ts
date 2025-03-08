import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type IHomeBanner = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  description?: {
    en?: string;
    hi?: string;
  };
  readTitle?: {
    en?: string;
    hi?: string;
  };
  sequence?: number;
  active?: boolean;
  readStatus?: boolean;
  readLinks?: string;
};

const initialState = {
  homeBannerList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IHomeBanner[]>,
  singleHomeBannerState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IHomeBanner | null>
};

export const addEditHomeBannerList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'home/addEditHomeBannerList',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        homeBanner: {
          singleHomeBannerState: { data }
        }
      } = getState();

      dispatch(addEditHomeBannerListStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      console.log('this is a data banner 0', data);

      const formData = new FormData();
      const reqData: any = {
        title: data.title ? JSON.stringify(data.title) : undefined,
        description: data.description
          ? JSON.stringify(data.description)
          : undefined,
        readTitle: data.readTitle ? JSON.stringify(data.readTitle) : undefined,
        sequence: data.sequence,
        active: data.active,
        readStatus: data.readStatus,
        readLinks: data.readLinks
      };

      console.log('this is a data banner 1', reqData);
      console.log('start 1', reqData);
      Object.entries(reqData).forEach(([key, value]) => {
        console.log('start 2', key, value);
        if (value !== undefined && value !== null) {
          console.log('start 3', key, value);
          formData.append(key, value as string | Blob);
        }
        console.log('start 4', formData);
      });

      let response;
      console.log('lololo', entityId);
      if (!entityId) {
        response = await fetchApi('/home/homebanner/create', {
          method: 'POST',
          body: formData
        });
      } else {
        console.log('lololo 2');
        response = await fetchApi(`/home/homebanner/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditHomeBannerListSuccess());
        dispatch(fetchHomeBannerList());
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditHomeBannerListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditHomeBannerListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchHomeBannerList = createAsyncThunk<
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
  'home/fetchHomeBannerList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};

      dispatch(fetchHomeBannerListStart());

      const response = await fetchApi(
        `/home/homebanner/all??page=${page || 1}&limit=${pageSize || 5}&field=${
          field || ''
        }&text=${keyword || ''}&active=${active || ''}&exportData=${
          exportData || false
        }`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchHomeBannerListSuccess({
              data: response.homeBanner,
              totalCount: response.totalHomeBannerCount
            })
          );
        } else {
          dispatch(fetchHomeBannerExportLoading(false));
        }

        return response;
      } else {
        throw new Error('No Status Or Invalid Response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchHomeBannerListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleHomeBannerList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'home/fetchSingleHomeBanner',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleHomeBannerListStart());
      const response = await fetchApi(`/home/homebanner/get/${entityId}`, {
        method: 'GET'
      });
      console.log('resposkajbdcjab', response);
      if (response?.success) {
        dispatch(fetchSingleHomeBannerListSuccess(response?.homeBanner));

        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchSingleHomeBannerListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleHomeBannerListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

const homeBannerSlice = createSlice({
  name: 'homebanner',
  initialState,
  reducers: {
    setHomeBannerListData(state, action) {
      state.singleHomeBannerState.data = action.payload;
    },
    updateHomeBannerListData(state, action) {
      const oldData = state.singleHomeBannerState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleHomeBannerState.data = newData;
      } else {
        state.singleHomeBannerState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditHomeBannerListStart(state) {
      state.singleHomeBannerState.loading = true;
      state.singleHomeBannerState.error = null;
    },
    addEditHomeBannerListSuccess(state) {
      state.singleHomeBannerState.loading = false;
      state.singleHomeBannerState.error = null;
    },
    addEditHomeBannerListFailure(state, action) {
      state.singleHomeBannerState.loading = false;
      state.singleHomeBannerState.error = action.payload;
    },
    fetchHomeBannerListStart(state) {
      state.homeBannerList.loading = true;
      state.homeBannerList.error = null;
    },
    fetchHomeBannerListSuccess(state, action) {
      state.homeBannerList.loading = false;
      const { data, totalCount } = action.payload;
      state.homeBannerList.data = data;
      state.homeBannerList.pagination.totalCount = totalCount;
      state.homeBannerList.error = null;
    },
    fetchHomeBannerListFailure(state, action) {
      state.homeBannerList.loading = false;
      state.homeBannerList.error = action.payload;
    },
    fetchSingleHomeBannerListStart(state) {
      state.singleHomeBannerState.loading = true;
      state.singleHomeBannerState.error = null;
    },
    fetchSingleHomeBannerListFailure(state, action) {
      state.singleHomeBannerState.loading = false;
      state.singleHomeBannerState.data = action.payload;
    },
    fetchSingleHomeBannerListSuccess(state, action) {
      state.singleHomeBannerState.loading = false;
      state.singleHomeBannerState.data = action.payload;
      state.singleHomeBannerState.error = null;
    },
    fetchHomeBannerExportLoading(state, action) {
      state.homeBannerList.loading = action.payload;
    }
  }
});

export const {
  setHomeBannerListData,
  fetchHomeBannerExportLoading,
  fetchHomeBannerListFailure,
  fetchHomeBannerListStart,
  fetchHomeBannerListSuccess,
  fetchSingleHomeBannerListFailure,
  fetchSingleHomeBannerListStart,
  fetchSingleHomeBannerListSuccess,
  addEditHomeBannerListFailure,
  addEditHomeBannerListStart,
  addEditHomeBannerListSuccess,
  updateHomeBannerListData
} = homeBannerSlice.actions;

export default homeBannerSlice.reducer;
