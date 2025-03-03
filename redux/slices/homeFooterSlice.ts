import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';

export type IhomeFooter = BaseModel & {
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
  homeFooterState: {
    data: {}, // Initial description as an empty string
    loading: false, // Represents whether the API call is in progress
    error: null // Stores any errors from API calls
  } as BaseState<IhomeFooter> // The state type is BaseState with a string as the data type
};

export const fetchhomeFooter = createAsyncThunk<
  any,
  void,
  { state: RootState }
>('homeFooter/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSinglehomeFooterStart()); // Use a generic start action or create a new one

    const response = await fetchApi('/home_footer/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSinglehomeFooterSuccess(response)); // Assuming response contains `descriptionData`
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSinglehomeFooterFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSinglehomeFooterFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEdithomeFooter = createAsyncThunk<
  any,
  {
    logo: File;
    description: string;
    social_icon1: File;
    social_icon1_link: string;
    social_icon2: File;
    social_icon2_link: string;
    social_icon3: File;
    social_icon3_link: string;
    social_icon4: File;
    social_icon4_link: string;
    social_icon5: File;
    social_icon5_link: string;
    title1: string;
    title1_subtitle: string;
    title1_link1_heading: string;
    title1_link1: string;
    title1_link2_heading: string;
    title1_link2: string;
    title1_link3_heading: string;
    title1_link3: string;
    title1_link4_heading: string;
    title1_link4: string;
    title1_link5_heading: string;
    title1_link5: string;
    title1_link6_heading: string;
    title1_link6: string;
    title2: string;
    title2_subtitle: string;
    title2_link1_heading: string;
    title2_link1: string;
    title2_link2_heading: string;
    title2_link2: string;
    title2_link3_heading: string;
    title2_link3: string;
    title2_link4_heading: string;
    title2_link4: string;
    title3: string;
    title3_subtitle: string;
    title3_link1_heading: string;
    title3_link1: string;
    title3_link2_heading: string;
    title3_link2: string;
    title3_link3_heading: string;
    title3_link3: string;
    title3_link4_heading: string;
    title3_link4: string;
  },
  { state: RootState }
>(
  'homeFooter/addEdithomeFooter',
  async (
    {
      logo,
      description,
      social_icon1,
      social_icon1_link,
      social_icon2,
      social_icon2_link,
      social_icon3,
      social_icon3_link,
      social_icon4,
      social_icon4_link,
      social_icon5,
      social_icon5_link,
      title1,
      title1_subtitle,
      title1_link1_heading,
      title1_link1,
      title1_link2_heading,
      title1_link2,
      title1_link3_heading,
      title1_link3,
      title1_link4_heading,
      title1_link4,
      title1_link5_heading,
      title1_link5,
      title1_link6_heading,
      title1_link6,
      title2,
      title2_subtitle,
      title2_link1_heading,
      title2_link1,
      title2_link2_heading,
      title2_link2,
      title2_link3_heading,
      title2_link3,
      title2_link4_heading,
      title2_link4,
      title3,
      title3_subtitle,
      title3_link1_heading,
      title3_link1,
      title3_link2_heading,
      title3_link2,
      title3_link3_heading,
      title3_link3,
      title3_link4_heading,
      title3_link4
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(addEdithomeFooterStart()); // Use a generic start action or create a new one

      const formData = new FormData();
      formData.append('logo', logo);
      formData.append('description', description);
      formData.append('social_icon1', social_icon1);
      formData.append('social_icon1_link', social_icon1_link);
      formData.append('social_icon2', social_icon2);
      formData.append('social_icon2_link', social_icon2_link);
      formData.append('social_icon3', social_icon3);
      formData.append('social_icon3_link', social_icon3_link);
      formData.append('social_icon4', social_icon4);
      formData.append('social_icon4_link', social_icon4_link);
      formData.append('social_icon5', social_icon5);
      formData.append('social_icon5_link', social_icon5_link);
      formData.append('title1', title1);
      formData.append('title1_subtitle', title1_subtitle);
      formData.append('title1_link1_heading', title1_link1_heading);
      formData.append('title1_link1', title1_link1);
      formData.append('title1-link2_heading', title1_link2_heading);
      formData.append('title1_link2', title1_link2);
      formData.append('title1_link3_heading', title1_link3_heading);
      formData.append('title1_link3', title1_link3);
      formData.append('title1_link4_heading', title1_link4_heading);
      formData.append('title1_link4', title1_link4);
      formData.append('title1_link5_heading', title1_link5_heading);
      formData.append('title1_link5', title1_link5);
      formData.append('title1_link6_heading', title1_link6_heading);
      formData.append('title1_link6', title1_link6);
      formData.append('title2', title2);
      formData.append('title2_subtitle', title2_subtitle);
      formData.append('title2_link1_heading', title2_link1_heading);
      formData.append('title2_link1', title2_link1);
      formData.append('title2_link2_heading', title2_link2_heading);
      formData.append('title2_link2', title2_link2);
      formData.append('title2_link3_heading', title2_link3_heading);
      formData.append('title2_link3', title2_link3);
      formData.append('title2_link4_heading', title1_link4_heading);
      formData.append('title2_link4', title2_link4);
      formData.append('title3', title3);
      formData.append('title3_subtitle', title3_subtitle);
      formData.append('title3_link1_heading', title3_link1_heading);
      formData.append('title3_link1', title3_link1);
      formData.append('title3_link2_heading', title3_link2_heading);
      formData.append('title3_link2', title3_link2);
      formData.append('title3_link3_heading', title3_link3_heading);
      formData.append('title3_link3', title3_link3);
      formData.append('title3_link4_heading', title3_link4_heading);
      formData.append('title3_link4', title3_link4);

      // Single endpoint, but the backend will decide whether to create or update
      const endpoint = '/home_footer/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEdithomeFooterSuccess());
        toast.success(
          response?.isNew
            ? 'homeFooter created successfully'
            : 'homeFooter updated successfully'
        );

        dispatch(fetchhomeFooter()); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEdithomeFooterFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEdithomeFooterFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const homeFooterSlice = createSlice({
  name: 'homeFooter',
  initialState,
  reducers: {
    fetchhomeFooterStart(state) {
      state.homeFooterState.loading = true;
      state.homeFooterState.error = null;
    },

    addEdithomeFooterStart(state) {
      state.homeFooterState.loading = true;
      state.homeFooterState.error = null;
    },
    addEdithomeFooterSuccess(state) {
      state.homeFooterState.loading = false;
      state.homeFooterState.error = null;
    },
    addEdithomeFooterFailure(state, action) {
      state.homeFooterState.loading = false;
      state.homeFooterState.error = action.payload;
    },
    fetchSinglehomeFooterStart(state) {
      state.homeFooterState.loading = true;
      state.homeFooterState.error = null;
    },
    fetchSinglehomeFooterSuccess(state, action) {
      state.homeFooterState.loading = false;
      state.homeFooterState.data = action.payload.homeFooterData;
      state.homeFooterState.error = null;
    },
    fetchSinglehomeFooterFailure(state, action) {
      state.homeFooterState.loading = false;
      state.homeFooterState.error = action.payload;
    }
  }
});

export const {
  addEdithomeFooterStart,
  addEdithomeFooterSuccess,
  addEdithomeFooterFailure,

  fetchSinglehomeFooterStart,
  fetchSinglehomeFooterSuccess,
  fetchSinglehomeFooterFailure
} = homeFooterSlice.actions;

export default homeFooterSlice.reducer;
