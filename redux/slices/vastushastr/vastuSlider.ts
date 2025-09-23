import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type IVastuSlider = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  short_description?: {
    en?: string;
    hi?: string;
  };
  banner_image?: {
    en?: string;
    hi?: string;
  };
  sequence?: number;
  active?: boolean;
};

const initialState = {
  vastuSliderList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IVastuSlider[]>,
  singleVastuSliderState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IVastuSlider | null>
};

export const addEditVastuSliderList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'home/addEditVastuSliderList',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        vastuSlider: {
          singleVastuSliderState: { data }
        }
      } = getState();

      dispatch(addEditVastuSliderListStart());

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
        banner_image: clonedData.banner_image
          ? JSON.stringify(clonedData.banner_image)
          : undefined,
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
        response = await fetchApi('/vastu_shastr/slider/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/vastu_shastr/slider/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditVastuSliderListSuccess());
        dispatch(fetchVastuSliderList());
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditVastuSliderListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditVastuSliderListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchVastuSliderList = createAsyncThunk<
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
  'home/fetchVastuSliderList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};
      dispatch(fetchVastuSliderListStart());

      const response = await fetchApi(
        `/vastu_shastr/slider/all?page=${page || 1}&limit=${
          pageSize || 10
        }&field=${field || ''}&text=${keyword || ''}&active=${
          active || ''
        }&exportData=${exportData || false}`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchVastuSliderListSuccess({
              data: response.vastuSlider,
              totalCount: response.totalVastuSliderCount
            })
          );
        } else {
          dispatch(fetchVastuSliderExportLoading(false));
        }

        return response;
      } else {
        throw new Error('No Status Or Invalid Response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchVastuSliderListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleVastuSliderList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'home/fetchSingleVastuSlider',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleVastuSliderListStart());
      const response = await fetchApi(`/vastu_shastr/slider/get/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleVastuSliderListSuccess(response?.vastuSlider));

        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchSingleVastuSliderListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleVastuSliderListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteVastuSlider = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('brand/delete', async (id, { dispatch }) => {
  dispatch(deleteVastuSliderStart());
  try {
    const response = await fetchApi(`/vastu_shastr/slider/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteVastuSliderSuccess(id));
      dispatch(fetchVastuSliderList());
      toast.success('Banner deleted successfully');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteVastuSliderFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteVastuSliderFailure(error.message || 'Failed to delete banner')
    );
    toast.error(error.message);
  }
});

const vastuSliderSlice = createSlice({
  name: 'vastuSlider',
  initialState,
  reducers: {
    setVastuSliderListData(state, action) {
      state.singleVastuSliderState.data = action.payload;
    },
    updateVastuSliderListData(state, action) {
      const oldData = state.singleVastuSliderState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleVastuSliderState.data = newData;
      } else {
        state.singleVastuSliderState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditVastuSliderListStart(state) {
      state.singleVastuSliderState.loading = true;
      state.singleVastuSliderState.error = null;
    },
    addEditVastuSliderListSuccess(state) {
      state.singleVastuSliderState.loading = false;
      state.singleVastuSliderState.error = null;
    },
    addEditVastuSliderListFailure(state, action) {
      state.singleVastuSliderState.loading = false;
      state.singleVastuSliderState.error = action.payload;
    },
    fetchVastuSliderListStart(state) {
      state.vastuSliderList.loading = true;
      state.vastuSliderList.error = null;
    },
    fetchVastuSliderListSuccess(state, action) {
      state.vastuSliderList.loading = false;
      const { data, totalCount } = action.payload;
      state.vastuSliderList.data = data;
      state.vastuSliderList.pagination.totalCount = totalCount;
      state.vastuSliderList.error = null;
    },
    fetchVastuSliderListFailure(state, action) {
      state.vastuSliderList.loading = false;
      state.vastuSliderList.error = action.payload;
    },
    fetchSingleVastuSliderListStart(state) {
      state.singleVastuSliderState.loading = true;
      state.singleVastuSliderState.error = null;
    },
    fetchSingleVastuSliderListFailure(state, action) {
      state.singleVastuSliderState.loading = false;
      state.singleVastuSliderState.data = action.payload;
    },
    fetchSingleVastuSliderListSuccess(state, action) {
      state.singleVastuSliderState.loading = false;
      state.singleVastuSliderState.data = action.payload;
      state.singleVastuSliderState.error = null;
    },
    deleteVastuSliderStart(state) {
      state.singleVastuSliderState.loading = true;
      state.singleVastuSliderState.error = null;
    },
    deleteVastuSliderSuccess(state, action) {
      state.singleVastuSliderState.loading = false;
    },
    deleteVastuSliderFailure(state, action) {
      state.singleVastuSliderState.loading = false;
      state.singleVastuSliderState.error = action.payload;
    },
    fetchVastuSliderExportLoading(state, action) {
      state.vastuSliderList.loading = action.payload;
    }
  }
});

export const {
  setVastuSliderListData,
  fetchVastuSliderExportLoading,
  fetchVastuSliderListFailure,
  fetchVastuSliderListStart,
  fetchVastuSliderListSuccess,
  fetchSingleVastuSliderListFailure,
  fetchSingleVastuSliderListStart,
  fetchSingleVastuSliderListSuccess,
  addEditVastuSliderListFailure,
  addEditVastuSliderListStart,
  addEditVastuSliderListSuccess,
  deleteVastuSliderStart,
  deleteVastuSliderSuccess,
  updateVastuSliderListData,
  deleteVastuSliderFailure
} = vastuSliderSlice.actions;

export default vastuSliderSlice.reducer;
