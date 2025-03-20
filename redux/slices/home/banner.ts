import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type IHomeBanner = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  description?: {
    en?: string;
    hi?: string;
  };
  short_description?: {
    en?: string;
    hi?: string;
  };
  readTitle?: {
    en?: string;
    hi?: string;
  };
  backgroundColor?: string;
  banner_image?: string;
  sequence?: number;
  active?: boolean;
  readStatus?: boolean;
  backgroundStatus?: boolean;
  readLinks?: string;
  textAlignment?: string;
  textColour?: string;
  readBackgroundcolor?: string;
  readTextColor?: string;
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
        short_description: clonedData.short_description
          ? JSON.stringify(clonedData.short_description)
          : undefined,
        readTitle: clonedData.readTitle
          ? JSON.stringify(clonedData.readTitle)
          : undefined,
        banner_image: clonedData.banner_image,
        backgroundColor: clonedData.backgroundColor,
        sequence: clonedData.sequence,
        active: clonedData.active,
        backgroundStatus: clonedData.backgroundStatus,
        readStatus: clonedData.readStatus,
        readLinks: clonedData.readLinks,
        textAlignment: clonedData.textAlignment,
        textColour: clonedData.textColour,
        readBackgroundcolor: clonedData.readBackgroundcolor,
        readTextColor: clonedData.readTextColor
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/home/homebanner/create', {
          method: 'POST',
          body: formData
        });
      } else {
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
        `/home/homebanner/all?page=${page || 1}&limit=${pageSize || 10}&field=${
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

export const deleteHomeBanner = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('brand/delete', async (id, { dispatch }) => {
  dispatch(deleteHomeBannerStart());
  try {
    const response = await fetchApi(`/home/homebanner/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteHomeBannerSuccess(id));
      dispatch(fetchHomeBannerList());
      toast.success('Slider deleted successfuly');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteHomeBannerFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteHomeBannerFailure(error.message || 'Failed to delete slider')
    );
    toast.error(error.message);
  }
});

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
    deleteHomeBannerStart(state) {
      state.singleHomeBannerState.loading = true;
      state.singleHomeBannerState.error = null;
    },
    deleteHomeBannerSuccess(state, action) {
      state.singleHomeBannerState.loading = false;
    },
    deleteHomeBannerFailure(state, action) {
      state.singleHomeBannerState.loading = false;
      state.singleHomeBannerState.error = action.payload;
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
  deleteHomeBannerStart,
  deleteHomeBannerSuccess,
  updateHomeBannerListData,
  deleteHomeBannerFailure
} = homeBannerSlice.actions;

export default homeBannerSlice.reducer;
