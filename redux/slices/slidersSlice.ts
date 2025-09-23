import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

export type ISliders = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  description?: {
    en?: string;
    hi?: string;
  };
  buttonTitle?: {
    en?: string;
    hi?: string;
  };
  sequence?: number;
  banner_image?: {
    en?: string;
    hi?: string;
  };
  buttonStatus?: boolean;
  button_link?: string;
  active?: boolean;
  banner_type?: string;
};

// Initial state
const initialState = {
  slidersListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<ISliders[]>,
  singleSliderState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ISliders | null>
};

// Thunks
export const fetchSlidersList = createAsyncThunk<
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
>('sliders/fetchSlidersList', async (input, { dispatch, rejectWithValue }) => {
  try {
    const { page, pageSize, keyword, field, active, exportData } = input || {};
    dispatch(fetchSlidersStart());

    const response = await fetchApi(
      `/store/sliders/all?page=${page || 1}&pageSize=${pageSize || 5}&text=${
        keyword || ''
      }&field=${field || ''}&active=${active || ''}&export=${
        exportData || false
      }`,
      { method: 'GET' }
    );
    if (response?.success) {
      if (!input?.exportData) {
        dispatch(
          fetchSlidersListSuccess({
            data: response.slider,
            totalCount: response.totalSliderCount
          })
        );
      } else {
        dispatch(fetchSlidersExportLoading(false));
      }

      return response;
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error: any) {
    dispatch(fetchSlidersFailure(error?.message || 'Something went wrong'));
    return rejectWithValue(error?.message || 'Something went wrong');
  }
});

export const addEditSliders = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('sliders/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      slider: {
        singleSliderState: { data }
      }
    } = getState();

    dispatch(addEditSlidersStart());

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
      buttonTitle: clonedData.buttonTitle
        ? JSON.stringify(clonedData.buttonTitle)
        : undefined,
      sequence: clonedData.sequence,
      // banner_image: clonedData.banner_image,
      banner_image: clonedData.banner_image
        ? JSON.stringify(clonedData.banner_image)
        : undefined,
      buttonStatus: clonedData.buttonStatus,
      button_link: clonedData.button_link,
      active: clonedData.active,
      banner_type: clonedData.banner_type
    };
    // Append only defined fields to FormData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    let response;
    if (!entityId) {
      response = await fetchApi('/store/sliders/new', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/store/sliders/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }
    if (response?.success) {
      dispatch(addEditSlidersSuccess());
      dispatch(fetchSlidersList());
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
      dispatch(addEditSlidersFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditSlidersFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const fetchSingleSlider = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'types/getsingletypes',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleSliderStart());
      const response = await fetchApi(`/store/sliders/single/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleSliderSuccess(response?.sliderdata));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleSliderFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleSliderFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteSlider = createAsyncThunk<any, string, { state: RootState }>(
  'brand/delete',
  async (id, { dispatch }) => {
    dispatch(deleteSliderStart());
    try {
      const response = await fetchApi(`/store/sliders/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        dispatch(deleteSliderSuccess(id));
        dispatch(fetchSlidersList());
        toast.success('Slider deleted successfuly');
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        toast.error(errorMsg);
        dispatch(deleteSliderFailure(errorMsg));
      }
    } catch (error: any) {
      dispatch(deleteSliderFailure(error.message || 'Failed to delete slider'));
      toast.error(error.message);
    }
  }
);

// Slice
const slidersSlice = createSlice({
  name: 'sliders',
  initialState,
  reducers: {
    setSliderData(state, action) {
      state.singleSliderState.data = action.payload;
    },
    fetchSlidersStart(state) {
      state.slidersListState.loading = true;
      state.slidersListState.error = null;
    },
    fetchSlidersListSuccess(state, action) {
      const { data, totalCount } = action.payload;
      state.slidersListState.data = data;
      state.slidersListState.pagination.totalCount = totalCount;
      state.slidersListState.loading = false;
    },
    fetchSlidersFailure(state, action) {
      state.slidersListState.loading = false;
      state.slidersListState.error = action.payload;
    },
    addEditSlidersStart(state) {
      state.singleSliderState.loading = true;
      state.singleSliderState.error = null;
    },
    addEditSlidersSuccess(state) {
      state.singleSliderState.loading = false;
    },
    addEditSlidersFailure(state, action) {
      state.singleSliderState.loading = false;
      state.singleSliderState.error = action.payload;
    },
    updateSlidersData(state, action) {
      const oldData = state.singleSliderState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleSliderState.data = newData;
      } else {
        state.singleSliderState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    fetchSingleSliderStart(state) {
      state.singleSliderState.loading = true;
      state.singleSliderState.error = null;
    },
    fetchSingleSliderSuccess(state, action) {
      state.singleSliderState.loading = false;
      state.singleSliderState.data = action.payload;
      state.singleSliderState.error = null;
    },
    fetchSingleSliderFailure(state, action) {
      state.singleSliderState.loading = false;
      state.singleSliderState.error = action.payload;
    },
    deleteSliderStart(state) {
      state.singleSliderState.loading = true;
      state.singleSliderState.error = null;
    },
    deleteSliderSuccess(state, action) {
      state.singleSliderState.loading = false;
    },
    deleteSliderFailure(state, action) {
      state.singleSliderState.loading = false;
      state.singleSliderState.error = action.payload;
    },
    fetchSlidersExportLoading(state, action) {
      state.slidersListState.loading = action.payload;
    }
  }
});

export const {
  fetchSlidersStart,
  fetchSlidersListSuccess,
  fetchSlidersFailure,
  addEditSlidersStart,
  addEditSlidersSuccess,
  addEditSlidersFailure,
  updateSlidersData,
  setSliderData,
  fetchSingleSliderStart,
  fetchSingleSliderSuccess,
  fetchSingleSliderFailure,
  deleteSliderStart,
  deleteSliderSuccess,
  fetchSlidersExportLoading,
  deleteSliderFailure
} = slidersSlice.actions;

export default slidersSlice.reducer;
