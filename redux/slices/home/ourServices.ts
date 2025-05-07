import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type IOurServices = BaseModel & {
  title?: {
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
  icon_image?: string;
  sequence?: number;
  active?: boolean;
  readStatus?: boolean;
  readLinks?: string;
  textColor?: string;
  readTextColor?: string;
};

const initialState = {
  ourServicesList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IOurServices[]>,
  singleOurServicesState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IOurServices | null>
};

export const addEditOurServicesList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'home/addEditOurServicesList',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        ourService: {
          singleOurServicesState: { data }
        }
      } = getState();

      dispatch(addEditOurServicesListStart());

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
        short_description: clonedData.short_description
          ? JSON.stringify(clonedData.short_description)
          : undefined,
        readTitle: clonedData.readTitle
          ? JSON.stringify(clonedData.readTitle)
          : undefined,
        icon_image: clonedData.icon_image,
        backgroundColor: clonedData.backgroundColor,
        sequence: clonedData.sequence,
        active: clonedData.active,
        readStatus: clonedData.readStatus,
        readLinks: clonedData.readLinks,
        textColor: clonedData.textColor,
        readTextColor: clonedData.readTextColor
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/home/ourservices/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/home/ourservices/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditOurServicesListSuccess());
        dispatch(fetchOurServicesList());
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditOurServicesListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditOurServicesListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchOurServicesList = createAsyncThunk<
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
  'home/fetchOurServicesList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};
      dispatch(fetchOurServicesListStart());

      const response = await fetchApi(
        `/home/ourServices/all?page=${page || 1}&limit=${
          pageSize || 10
        }&field=${field || ''}&text=${keyword || ''}&active=${
          active || ''
        }&exportData=${exportData || false}`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchOurServicesListSuccess({
              data: response.ourServices,
              totalCount: response.totalOurServicesCount
            })
          );
        } else {
          dispatch(fetchOurServicesExportLoading(false));
        }

        return response;
      } else {
        throw new Error('No Status Or Invalid Response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchOurServicesListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleOurServicesList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'home/fetchSingleOurServices',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleOurServicesListStart());
      const response = await fetchApi(`/home/ourservices/get/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleOurServicesListSuccess(response?.ourServices));

        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchSingleOurServicesListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleOurServicesListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteOurServices = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('brand/delete', async (id, { dispatch }) => {
  dispatch(deleteOurServicesStart());
  try {
    const response = await fetchApi(`/home/ourservices/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteOurServicesSuccess(id));
      dispatch(fetchOurServicesList());
      toast.success('Slider deleted successfuly');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteOurServicesFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteOurServicesFailure(error.message || 'Failed to delete slider')
    );
    toast.error(error.message);
  }
});

const ourServicesSlice = createSlice({
  name: 'ourServices',
  initialState,
  reducers: {
    setOurServicesListData(state, action) {
      state.singleOurServicesState.data = action.payload;
    },
    updateOurServicesListData(state, action) {
      const oldData = state.singleOurServicesState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleOurServicesState.data = newData;
      } else {
        state.singleOurServicesState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditOurServicesListStart(state) {
      state.singleOurServicesState.loading = true;
      state.singleOurServicesState.error = null;
    },
    addEditOurServicesListSuccess(state) {
      state.singleOurServicesState.loading = false;
      state.singleOurServicesState.error = null;
    },
    addEditOurServicesListFailure(state, action) {
      state.singleOurServicesState.loading = false;
      state.singleOurServicesState.error = action.payload;
    },
    fetchOurServicesListStart(state) {
      state.ourServicesList.loading = true;
      state.ourServicesList.error = null;
    },
    fetchOurServicesListSuccess(state, action) {
      state.ourServicesList.loading = false;
      const { data, totalCount } = action.payload;
      state.ourServicesList.data = data;
      state.ourServicesList.pagination.totalCount = totalCount;
      state.ourServicesList.error = null;
    },
    fetchOurServicesListFailure(state, action) {
      state.ourServicesList.loading = false;
      state.ourServicesList.error = action.payload;
    },
    fetchSingleOurServicesListStart(state) {
      state.singleOurServicesState.loading = true;
      state.singleOurServicesState.error = null;
    },
    fetchSingleOurServicesListFailure(state, action) {
      state.singleOurServicesState.loading = false;
      state.singleOurServicesState.data = action.payload;
    },
    fetchSingleOurServicesListSuccess(state, action) {
      state.singleOurServicesState.loading = false;
      state.singleOurServicesState.data = action.payload;
      state.singleOurServicesState.error = null;
    },
    deleteOurServicesStart(state) {
      state.singleOurServicesState.loading = true;
      state.singleOurServicesState.error = null;
    },
    deleteOurServicesSuccess(state, action) {
      state.singleOurServicesState.loading = false;
    },
    deleteOurServicesFailure(state, action) {
      state.singleOurServicesState.loading = false;
      state.singleOurServicesState.error = action.payload;
    },
    fetchOurServicesExportLoading(state, action) {
      state.ourServicesList.loading = action.payload;
    }
  }
});

export const {
  setOurServicesListData,
  fetchOurServicesExportLoading,
  fetchOurServicesListFailure,
  fetchOurServicesListStart,
  fetchOurServicesListSuccess,
  fetchSingleOurServicesListFailure,
  fetchSingleOurServicesListStart,
  fetchSingleOurServicesListSuccess,
  addEditOurServicesListFailure,
  addEditOurServicesListStart,
  addEditOurServicesListSuccess,
  deleteOurServicesStart,
  deleteOurServicesSuccess,
  updateOurServicesListData,
  deleteOurServicesFailure
} = ourServicesSlice.actions;

export default ourServicesSlice.reducer;
