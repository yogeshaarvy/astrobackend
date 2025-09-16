import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type IBlogConfig = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  title?: {
    en?: string;
    hi?: string;
  };
  backgroundColor?: string;
  banner_image?: {
    en?: string;
    hi?: string;
  };
  sequence?: number;
  active?: boolean;
  backgroundStatus?: boolean;
  textAlignment?: string;
  textColour?: string;
};

const initialState = {
  blogConfigState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IBlogConfig | null>
};

// export const addEditBlogConfigList = createAsyncThunk<
//   any,
//   string | null,
//   { state: RootState }
// >(
//   'home/addEditBlogConfigList',
//   async (entityId, { dispatch, rejectWithValue, getState }) => {
//     try {
//       const {
//         blogConfig: {
//             blogConfigState: { data }
//         }
//       } = getState();

//       dispatch(addEditBlogConfigListStart());

//       if (!data) {
//         return rejectWithValue('Please Provide Details');
//       }

//       let clonedData = cloneDeep(data);

//       if (clonedData) {
//         clonedData = await processNestedFields(clonedData);
//       }

//       const formData = new FormData();
//       const reqData: any = {
//         metaTitle: clonedData.metaTitle,
//         metaDescription: clonedData.metaDescription,
//         metaKeyword: clonedData.metaKeyword,
//         title: clonedData.title ? JSON.stringify(clonedData.title) : undefined,
//         banner_image: clonedData.banner_image,
//         backgroundColor: clonedData.backgroundColor,
//         backgroundStatus: clonedData.backgroundStatus,
//         textAlignment: clonedData.textAlignment,
//         textColour: clonedData.textColour,
//       };

//       Object.entries(reqData).forEach(([key, value]) => {
//         if (value !== undefined && value !== null) {
//           formData.append(key, value as string | Blob);
//         }
//       });

//       const response = await fetchApi('/blogs/config/createorupdate', {
//         method: 'POST',
//         body: formData
//       });

//       if (response?.success) {
//         dispatch(addEditBlogConfigListSuccess());
//         dispatch(fetchBlogConfigList());
//         return response;
//       } else {
//         const errorMsg = response?.message ?? 'Something Went Wrong!!';
//         dispatch(addEditBlogConfigListFailure(errorMsg));
//         return rejectWithValue(errorMsg);
//       }
//     } catch (error: any) {
//       const errorMsg = error?.message ?? 'Something Went Wrong!!';
//       dispatch(addEditBlogConfigListFailure(errorMsg));
//       return rejectWithValue(errorMsg);
//     }
//   }
// );

export const addEditBlog = createAsyncThunk<any, null, { state: RootState }>(
  'blogConfig/addEditBlog',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        blogConfig: {
          blogConfigState: { data }
        }
      } = getState();

      dispatch(addEditBlogStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      console.log('The data value in the slice is:', data);

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        metaTitle: clonedData.metaTitle,
        metaDescription: clonedData.metaDescription,
        metaKeyword: clonedData.metaKeyword,
        title: clonedData.title ? JSON.stringify(clonedData.title) : undefined,
        banner_image: clonedData.banner_image
          ? JSON.stringify(clonedData.banner_image)
          : undefined,
        backgroundColor: clonedData.backgroundColor,
        backgroundStatus: clonedData.backgroundStatus,
        textAlignment: clonedData.textAlignment,
        textColour: clonedData.textColour
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetchApi('/blogs/config/createorupdate', {
        method: 'POST',
        body: formData
      });

      if (response?.success) {
        dispatch(addEditBlogSuccess());
        dispatch(setBlog(null));
        dispatch(fetchBlog(null)); // Re-fetch to update the latest data
        return response;
      } else {
        const errorMsg = response?.message || 'Failed to save description';
        dispatch(addEditBlogFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditBlogFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchBlog = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('blogConfig/fetchData', async (_, { dispatch, rejectWithValue }) => {
  try {
    dispatch(fetchSingleBlogStart());

    const response = await fetchApi('/blogs/config/get', {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleBlogSuccess(response?.blogConfig));

      console.log('fecthaboutBlog', response);
      return response;
    } else {
      const errorMsg = response?.message || 'Failed to fetch description';
      dispatch(fetchSingleBlogFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleBlogFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

const blogSlice = createSlice({
  name: 'blogConfig',
  initialState,
  reducers: {
    fetchBlogAboutStart(state) {
      state.blogConfigState.loading = true;
      state.blogConfigState.error = null;
    },
    addEditBlogStart(state) {
      state.blogConfigState.loading = true;
      state.blogConfigState.error = null;
    },
    addEditBlogSuccess(state) {
      state.blogConfigState.loading = false;
      state.blogConfigState.error = null;
    },
    setBlog(state, action) {
      state.blogConfigState.data = action.payload;
    },
    addEditBlogFailure(state, action) {
      state.blogConfigState.loading = false;
      state.blogConfigState.error = action.payload;
    },
    fetchSingleBlogStart(state) {
      state.blogConfigState.loading = true;
      state.blogConfigState.error = null;
    },
    fetchSingleBlogSuccess(state, action) {
      state.blogConfigState.loading = false;
      state.blogConfigState.data = action.payload;
      state.blogConfigState.error = null;
    },
    fetchSingleBlogFailure(state, action) {
      state.blogConfigState.loading = false;
      state.blogConfigState.error = action.payload;
    },
    updateBlog(state, action) {
      const oldData = state.blogConfigState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.blogConfigState.data = newData;
      } else {
        state.blogConfigState.data = {
          ...oldData,
          ...action.payload
        };
      }
    }
  }
});

export const {
  addEditBlogStart,
  addEditBlogSuccess,
  addEditBlogFailure,
  setBlog,
  updateBlog,
  fetchSingleBlogStart,
  fetchSingleBlogSuccess,
  fetchSingleBlogFailure
} = blogSlice.actions;

export default blogSlice.reducer;
