import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';

export type ISales = BaseModel & {
  main_heading: string;
  main_description: string;
  left_image: File;
  left_image_title: string;
  left_image_description: string;
  left_image_link: string;
  mid_upper_image: File;
  mid_upper_image_title: string;
  mid_upper_image_description: string;
  mid_upper_image_link: string;
  mid_lower_image: File;
  mid_lower_image_title: string;
  mid_lower_image_description: string;
  mid_lower_image_link: string;
  right_image: File;
  right_image_title: string;
  right_image_description: string;
  right_image_link: string;
};

const initialState = {
  salesState: {
    data: {}, // Initial description as an empty string
    loading: false, // Represents whether the API call is in progress
    error: null // Stores any errors from API calls
  } as BaseState<ISales> // The state type is BaseState with a string as the data type
};

export const fetchSales = createAsyncThunk<any, void, { state: RootState }>(
  'sales/fetchData',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(fetchSingleSalesStart()); // Use a generic start action or create a new one

      const response = await fetchApi('/sales/all', {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleSalesSuccess(response)); // Assuming response contains `descriptionData`
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to fetch description';
        dispatch(fetchSingleSalesFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleSalesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditSales = createAsyncThunk<
  any,
  {
    main_heading: string;
    main_description: string;
    left_image: string;
    left_image_title: string;
    left_image_description: string;
    left_image_link: string;
    mid_upper_image: string;
    mid_upper_image_title: string;
    mid_upper_image_description: string;
    mid_upper_image_link: string;
    mid_lower_image: string;
    mid_lower_image_title: string;
    mid_lower_image_description: string;
    mid_lower_image_link: string;
    right_image: string;
    right_image_title: string;
    right_image_description: string;
    right_image_link: string;
  },
  { state: RootState }
>(
  'sales/addEditSales',
  async (
    {
      main_heading,
      main_description,
      left_image,
      left_image_title,
      left_image_description,
      left_image_link,
      mid_upper_image,
      mid_upper_image_title,
      mid_upper_image_description,
      mid_upper_image_link,
      mid_lower_image,
      mid_lower_image_title,
      mid_lower_image_description,
      mid_lower_image_link,
      right_image,
      right_image_title,
      right_image_description,
      right_image_link
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(addEditSalesStart()); // Use a generic start action or create a new one

     
      const formData = new FormData();
      formData.append('main_heading', main_heading);
      formData.append('main_description', main_description);
      formData.append('left_image', left_image);
      formData.append('left_image_title', left_image_title);
      formData.append('left_image_description', left_image_description);
      formData.append('left_image_link', left_image_link);
      formData.append('mid_upper_image', mid_upper_image);
      formData.append('mid_upper_image_title', mid_upper_image_title);
      formData.append(
        'mid_upper_image_description',
        mid_upper_image_description
      );
      formData.append('mid_upper_image_link', mid_upper_image_link);
      formData.append('mid_lower_image', mid_lower_image);
      formData.append('mid_lower_image_title', mid_lower_image_title);
      formData.append(
        'mid_lower_image_description',
        mid_lower_image_description
      );
      formData.append('mid_lower_image_link', mid_lower_image_link);
      formData.append('right_image', right_image);
      formData.append('right_image_title', right_image_title);
      formData.append('right_image_description', right_image_description);
      formData.append('right_image_link', right_image_link);

      // Single endpoint, but the backend will decide whether to create or update
      const endpoint = '/sales/new';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditSalesSuccess());
        toast.success(
          response?.isNew
            ? 'Sales created successfully'
            : 'Sales updated successfully'
        );

        dispatch(fetchSales()); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditSalesFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditSalesFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    fetchSalesStart(state) {
      state.salesState.loading = true;
      state.salesState.error = null;
    },

    addEditSalesStart(state) {
      state.salesState.loading = true;
      state.salesState.error = null;
    },
    addEditSalesSuccess(state) {
      state.salesState.loading = false;
      state.salesState.error = null;
    },
    addEditSalesFailure(state, action) {
      state.salesState.loading = false;
      state.salesState.error = action.payload;
    },
    fetchSingleSalesStart(state) {
      state.salesState.loading = true;
      state.salesState.error = null;
    },
    fetchSingleSalesSuccess(state, action) {
      state.salesState.loading = false;
      state.salesState.data = action.payload.SalesData;
      state.salesState.error = null;
    },
    fetchSingleSalesFailure(state, action) {
      state.salesState.loading = false;
      state.salesState.error = action.payload;
    }
  }
});

export const {
  addEditSalesStart,
  addEditSalesSuccess,
  addEditSalesFailure,

  fetchSingleSalesStart,
  fetchSingleSalesSuccess,
  fetchSingleSalesFailure
} = salesSlice.actions;

export default salesSlice.reducer;
