import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type IHoroscopeDetail = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  description?: {
    en?: string;
    hi?: string;
  };
  banner_image?: string;
  sequence?: number;
  active?: boolean;
  sign_id?:
    | string
    | {
        _id: string;
        title?: {
          en?: string;
          hi?: string;
        };
        slug?: string;
      };
};

export interface HoroscopeDetailState {
  horoscopeDetailList: PaginationState<IHoroscopeDetail[]>;
  singleHoroscopeDetailState: BaseState<IHoroscopeDetail | null>;
}

const initialState = {
  horoscopeDetailList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IHoroscopeDetail[]>,
  singleHoroscopeDetailState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IHoroscopeDetail | null>
};

export const addEditHoroscopeDetail = createAsyncThunk<
  any,
  any,
  { state: RootState }
>(
  'horoscopeDetail/addHoroscopeDetail',
  async (
    { entityId, horoscopesignId },
    { dispatch, rejectWithValue, getState }
  ) => {
    console.log('entity id is', entityId);
    try {
      const {
        horoscopeDetail: {
          singleHoroscopeDetailState: { data }
        }
      } = getState();
      dispatch(addEditHoroscopeDetailStart());

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
        description: clonedData.description
          ? JSON.stringify(clonedData.description)
          : undefined,
        banner_image: clonedData.banner_image,
        sign_id: horoscopesignId,
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
        console.log('add api called');
        response = await fetchApi('/horoscope/detail/create', {
          method: 'POST',
          body: formData
        });
      } else {
        console.log('update is called');
        response = await fetchApi(`/horoscope/detail/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditHoroscopeDetailSuccess());
        dispatch(fetchHoroscopeDetailList());
        toast.success(response?.message || 'Operation completed successfully');
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditHoroscopeDetailFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditHoroscopeDetailFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchHoroscopeDetailList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    horoscopesignId?: string;
    keyword?: string;
    field?: string;
    active?: string;
    exportData?: boolean;
  } | void,
  { state: RootState }
>(
  'HoroscopeDetail/fetchHoroscopeDetailList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        page,
        pageSize,
        horoscopesignId,
        keyword,
        field,
        active,
        exportData
      } = input || {};
      console.log('sign iof og atstsgsggh', horoscopesignId, pageSize);
      dispatch(fetchHoroscopeDetailListStart());
      const response = await fetchApi(
        `/horoscope/detail/all?page=${page || 1}&limit=${
          pageSize || 10
        }&field=${field || ''}&text=${keyword || ''}&active=${
          active || ''
        }&HoroscopeId=${
          horoscopesignId // Fixed: parameter name to match backend
        }&exportData=${exportData || false}`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchHoroscopeDetailListSuccess({
              data: response.horoscopeDetailList,
              totalCount: response.totalHoroscopeDetail
            })
          );
        } else {
          dispatch(fetchHoroscopeDetailListExportLoading(false));
        }

        return response;
      } else {
        throw new Error(response?.message || 'No Status Or Invalid Response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchHoroscopeDetailListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleHoroscopeDetail = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'horoscopeDetail/fetchSingleHoroscopeDetail',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleHoroscopeDetailStart());
      const response = await fetchApi(`/horoscope/detail/get/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleHoroscopeDetailSuccess(response?.detailData));
        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchSingleHoroscopeDetailFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleHoroscopeDetailFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteHoroscopeDetail = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('horoscopeDetail/deleteHoroscopeDetail', async (id, { dispatch }) => {
  dispatch(deleteHoroscopeDetailStart());
  try {
    const response = await fetchApi(`/horoscope/detail/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteHoroscopeDetailSuccess(id));
      dispatch(fetchHoroscopeDetailList());
      toast.success(
        response?.message || 'HoroscopeDetail deleted successfully'
      );
      return response;
    } else {
      let errorMsg = response?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteHoroscopeDetailFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteHoroscopeDetailFailure(
        error.message || 'Failed to delete horospoe detail'
      )
    );
    toast.error(error.message);
  }
});

export const fetchHoroscopeDetailForUser = createAsyncThunk<
  any,
  { selectedLanguage?: string; sign_id?: string } | void,
  { state: RootState }
>(
  'horoscopeDetail/fetchHoroscopeDetailForUser',
  async (input, { dispatch, rejectWithValue }) => {
    try {
      const { selectedLanguage, sign_id } = input || {};

      const response = await fetchApi(
        `/horoscope/detail/user/get?selectedLanguage=${
          selectedLanguage || 'en'
        }&sign_id=${sign_id || ''}`, // Fixed: endpoint path
        { method: 'GET' }
      );

      if (response?.success) {
        return response.data;
      } else {
        throw new Error(
          response?.message || 'Failed to fetch user Horoscope Detail'
        );
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      return rejectWithValue(errorMsg);
    }
  }
);

const horoscopeDetailSlice = createSlice({
  name: 'horoscopeDetail',
  initialState,
  reducers: {
    setHoroscopeDetailData(state, action) {
      state.singleHoroscopeDetailState.data = action.payload;
    },
    updateHoroscopeDetailData(state, action) {
      const oldData = state.singleHoroscopeDetailState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleHoroscopeDetailState.data = newData;
      } else {
        state.singleHoroscopeDetailState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    // Reset single horoscope Detail data
    resetHoroscopeDetailData(state) {
      state.singleHoroscopeDetailState.data = null;
      state.singleHoroscopeDetailState.loading = false;
      state.singleHoroscopeDetailState.error = null;
    },
    addEditHoroscopeDetailStart(state) {
      state.singleHoroscopeDetailState.loading = true;
      state.singleHoroscopeDetailState.error = null;
    },
    addEditHoroscopeDetailSuccess(state) {
      state.singleHoroscopeDetailState.loading = false;
      state.singleHoroscopeDetailState.error = null;
    },
    addEditHoroscopeDetailFailure(state, action) {
      state.singleHoroscopeDetailState.loading = false;
      state.singleHoroscopeDetailState.error = action.payload;
    },
    fetchHoroscopeDetailListStart(state) {
      state.horoscopeDetailList.loading = true;
      state.horoscopeDetailList.error = null;
    },
    fetchHoroscopeDetailListSuccess(state, action) {
      state.horoscopeDetailList.loading = false;
      const { data, totalCount } = action.payload;
      state.horoscopeDetailList.data = data;
      state.horoscopeDetailList.pagination.totalCount = totalCount;
      state.horoscopeDetailList.error = null;
    },
    fetchHoroscopeDetailListFailure(state, action) {
      state.horoscopeDetailList.loading = false;
      state.horoscopeDetailList.error = action.payload;
    },
    fetchSingleHoroscopeDetailStart(state) {
      state.singleHoroscopeDetailState.loading = true;
      state.singleHoroscopeDetailState.error = null;
    },
    fetchSingleHoroscopeDetailFailure(state, action) {
      state.singleHoroscopeDetailState.loading = false;
      state.singleHoroscopeDetailState.error = action.payload;
    },
    fetchSingleHoroscopeDetailSuccess(state, action) {
      state.singleHoroscopeDetailState.loading = false;
      state.singleHoroscopeDetailState.data = action.payload;
      state.singleHoroscopeDetailState.error = null;
    },
    deleteHoroscopeDetailStart(state) {
      state.singleHoroscopeDetailState.loading = true;
      state.singleHoroscopeDetailState.error = null;
    },
    deleteHoroscopeDetailSuccess(state, action) {
      state.singleHoroscopeDetailState.loading = false;
      // Remove deleted item from list if it exists
      state.horoscopeDetailList.data = state.horoscopeDetailList.data.filter(
        (item) => item._id !== action.payload
      );
    },
    deleteHoroscopeDetailFailure(state, action) {
      state.horoscopeDetailList.loading = false;
      state.horoscopeDetailList.error = action.payload;
    },
    fetchHoroscopeDetailListExportLoading(state, action) {
      state.horoscopeDetailList.loading = action.payload;
    },
    // Update pagination
    updatePagination(state, action) {
      state.horoscopeDetailList.pagination = {
        ...state.horoscopeDetailList.pagination,
        ...action.payload
      };
    }
  }
});

export const {
  setHoroscopeDetailData,
  fetchHoroscopeDetailListExportLoading,
  fetchHoroscopeDetailListFailure,
  fetchHoroscopeDetailListStart,
  fetchHoroscopeDetailListSuccess,
  fetchSingleHoroscopeDetailFailure,
  fetchSingleHoroscopeDetailStart,
  fetchSingleHoroscopeDetailSuccess,
  addEditHoroscopeDetailFailure,
  addEditHoroscopeDetailStart,
  addEditHoroscopeDetailSuccess,
  deleteHoroscopeDetailStart,
  deleteHoroscopeDetailSuccess,
  updateHoroscopeDetailData,
  deleteHoroscopeDetailFailure,
  resetHoroscopeDetailData,
  updatePagination
} = horoscopeDetailSlice.actions;

export default horoscopeDetailSlice.reducer;
