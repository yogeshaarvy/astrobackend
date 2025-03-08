import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the SlidersRootState type to include sliders
export interface SlidersRootState {
  sliders: typeof initialState;
}
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { title } from 'process';

// Define the ISliders type
export type ISliders = BaseModel & {
  sequence?: number;
  banner_image?: string;
  title?: string;
  description?: string;
  button?: boolean;
  button_name?: string;
  button_link?: string;
  status?: boolean;
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
  } as BaseState<ISliders | null>,
  currentSliderState: {
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
    status?: string;
    exportData?: boolean;
  } | void,
  { state: RootState }
>('sliders/fetchSlidersList', async (input, { dispatch, rejectWithValue }) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      keyword = '',
      field = '',
      status = '',
      exportData = false
    } = input || {};
    dispatch(fetchSlidersStart());
    const response = await fetchApi(
      `/store/sliders/all?page=${page}&pageSize=${pageSize}&text=${keyword}&field=${field}&active=${status}&export=${exportData}`,
      { method: 'GET' }
    );
    if (response?.success) {
      dispatch(
        fetchSlidersListSuccess({
          data: response.SlidersData,
          totalCount: response.totalCount
        })
      );
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

    const formData = new FormData();
    const reqData: any = {
      sequence: data.sequence,
      banner_image: data.banner_image,
      title: data.title,
      description: data.description,
      button: data.button,
      button_name: data.button_name,
      button_link: data.button_link,
      status: data.status
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
      state.singleSliderState.data = { ...oldData, ...action.payload };
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
  fetchSingleSliderStart,
  fetchSingleSliderSuccess,
  fetchSingleSliderFailure,
  deleteSliderStart,
  deleteSliderSuccess,
  deleteSliderFailure
} = slidersSlice.actions;

export default slidersSlice.reducer;
