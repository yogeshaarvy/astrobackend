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

// Define the IReview type
export type IReview = BaseModel & {
  rating?: number;
  review?: string;
  username?: string;
  status?: boolean;
};

// Initial state
const initialState = {
  reviewListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IReview[]>,
  singlereviewState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IReview | null>,
  currentReviewState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IReview | null>
};

export const fetchReviewList = createAsyncThunk<
  any,
  {
    astroId?: any;
    page?: number;
    pageSize?: number;
    keyword?: string;
    field?: string;

    exportData?: boolean;
  },
  { state: RootState }
>('reviews/get', async (input, { dispatch, rejectWithValue }) => {
  try {
    const {
      astroId,
      page = 1,
      pageSize = 10,
      keyword = '',
      field = '',

      exportData = false
    } = input || {};
    dispatch(fetchReviewStart());
    const response = await fetchApi(
      `/reviews/all/${astroId}?page=${page}&pageSize=${pageSize}&text=${keyword}&field=${field}&active=${status}&export=${exportData}`,
      { method: 'GET' }
    );
    console.log('response of reviews states....', response);
    if (response?.success) {
      dispatch(
        fetchReviewListSuccess({
          data: response.reviewsList,
          totalCount: response.totalCount
        })
      );
      return response.ReviewData;
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error: any) {
    dispatch(fetchReviewFailure(error?.message || 'Something went wrong'));
    return rejectWithValue(error?.message || 'Something went wrong');
  }
});

export const addEditReview = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('review/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      reviews: {
        singlereviewState: { data }
      }
    } = getState();

    dispatch(addEditReviewStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    const formData = new FormData();
    const reqData: any = {
      review: data.review,
      rating: data.rating,
      username: data.username
    };
    // Append only defined fields to FormData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    let response;
    if (!entityId) {
      response = await fetchApi('/reviews/add', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/reviews/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }
    if (response?.success) {
      dispatch(addEditReviewSuccess());
      dispatch(fetchReviewList({}));
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
      dispatch(addEditReviewFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditReviewFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

// Slice
const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    fetchReviewStart(state) {
      state.reviewListState.loading = true;
      state.reviewListState.error = null;
    },
    fetchReviewListSuccess(state, action) {
      const { data, totalCount } = action.payload;
      state.reviewListState.data = data;
      state.reviewListState.pagination.totalCount = totalCount;
      state.reviewListState.loading = false;
    },
    fetchReviewFailure(state, action) {
      state.reviewListState.loading = false;
      state.reviewListState.error = action.payload;
    },
    addEditReviewStart(state) {
      state.singlereviewState.loading = true;
      state.singlereviewState.error = null;
    },
    addEditReviewSuccess(state) {
      state.singlereviewState.loading = false;
    },
    addEditReviewFailure(state, action) {
      state.singlereviewState.loading = false;
      state.singlereviewState.error = action.payload;
    },
    updateReviewData(state, action) {
      const oldData = state.singlereviewState.data;
      state.singlereviewState.data = { ...oldData, ...action.payload };
    }
  }
});

export const {
  fetchReviewStart,
  fetchReviewListSuccess,
  fetchReviewFailure,
  addEditReviewStart,
  addEditReviewSuccess,
  addEditReviewFailure,
  updateReviewData
} = reviewSlice.actions;

export default reviewSlice.reducer;
