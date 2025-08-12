import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState } from '@/types/globals';
import { toast } from 'sonner';

export type IAboutusIntro = BaseModel & {
  image1: string;
  image2: string;
  image3: string;

  heading: string;
  description: string;
};

const initialState = {
  aboutusIntroState: {
    data: {}, // Initial data as an empty object
    loading: false, // Represents whether the API call is in progress
    error: null // Stores any errors from API calls
  } as BaseState<IAboutusIntro>
};

export const fetchAboutusIntro = createAsyncThunk<
  any,
  void,
  { state: RootState }
>('midbanner/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleAboutusIntroStart());

    const response = await fetchApi('/aboutus_intro/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleAboutusIntroSuccess(response));
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleAboutusIntroFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleAboutusIntroFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const addEditAboutusIntro = createAsyncThunk<
  any,
  {
    image1: any;
    image2: any;
    image3: any;
    heading: string;
    description: string;
  },
  { state: RootState }
>(
  'midbanner/addEditAboutusIntro',
  async (
    {
      image1,
      image2,
      image3,

      heading,
      description
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(addEditAboutusIntroStart());

      const formData = new FormData();
      formData.append('image1', image1);
      formData.append('image2', image2);
      formData.append('image3', image3);

      formData.append('heading', heading);
      formData.append('description', description);

      const endpoint = '/aboutus_intro/create';
      const method = 'POST';

      const response = await fetchApi(endpoint, {
        method,
        body: formData
      });

      if (response?.success) {
        dispatch(addEditAboutusIntroSuccess());
        toast.success(
          response?.isNew
            ? 'About Intro created successfully'
            : 'About Intro updated successfully'
        );

        dispatch(fetchAboutusIntro()); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditAboutusIntroFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditAboutusIntroFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const aboutusintroSlice = createSlice({
  name: 'aboutus_intro',
  initialState,
  reducers: {
    fetchMidbannerStart(state) {
      state.aboutusIntroState.loading = true;
      state.aboutusIntroState.error = null;
    },
    addEditAboutusIntroStart(state) {
      state.aboutusIntroState.loading = true;
      state.aboutusIntroState.error = null;
    },
    addEditAboutusIntroSuccess(state) {
      state.aboutusIntroState.loading = false;
      state.aboutusIntroState.error = null;
    },
    addEditAboutusIntroFailure(state, action) {
      state.aboutusIntroState.loading = false;
      state.aboutusIntroState.error = action.payload;
    },
    fetchSingleAboutusIntroStart(state) {
      state.aboutusIntroState.loading = true;
      state.aboutusIntroState.error = null;
    },
    fetchSingleAboutusIntroSuccess(state, action) {
      state.aboutusIntroState.loading = false;
      state.aboutusIntroState.data = action.payload;
      state.aboutusIntroState.error = null;
    },
    fetchSingleAboutusIntroFailure(state, action) {
      state.aboutusIntroState.loading = false;
      state.aboutusIntroState.error = action.payload;
    }
  }
});

export const {
  addEditAboutusIntroStart,
  addEditAboutusIntroSuccess,
  addEditAboutusIntroFailure,
  fetchSingleAboutusIntroStart,
  fetchSingleAboutusIntroSuccess,
  fetchSingleAboutusIntroFailure
} = aboutusintroSlice.actions;

export default aboutusintroSlice.reducer;
