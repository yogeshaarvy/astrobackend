import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type IWallpaper = BaseModel & {
  _id?: string;
  thumbnail_image?: File[];
  payment_type?: string;
  category?: string;
  files?: File[];
};

const initialState = {
  wallpaperListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IWallpaper[]>,
  singleWallpaperState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IWallpaper | null>,
  currentWallpaperState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IWallpaper | null>
};

export const fetchWallpaperList = createAsyncThunk<
  any,
  { page?: number; pageSize?: number; department?: string } | void,
  { state: RootState }
>(
  'wallpaper/fetchWallList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize } = input || {};
      dispatch(fetchWallpaperStart());
      const response = await fetchApi(`/wallpapers`, { method: 'GET' });

      if (response?.success) {
        dispatch(
          fetchWallpaperListSuccess({
            data: response.wallpapers,
            totalCount: response.totalCount
          })
        );
      } else {
        throw new Error('No Status or invalid response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something went Wrong !!';
      dispatch(fetchWallpaperFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditWallpaper = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'wallpaper/add',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        wallpaper: {
          singleWallpaperState: { data }
        }
      } = getState();

      dispatch(addEditWallpaperStart());

      if (!data) {
        return rejectWithValue('Please provide all required details.');
      }

      let formData = new FormData();

      // Add regular fields
      const reqData: any = {
        payment_type: data.payment_type,
        category: data.category
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      // Add thumbnail_image (single file)
      if (data.thumbnail_image && Array.isArray(data.thumbnail_image)) {
        data.thumbnail_image.forEach((file) => {
          formData.append('thumbnail_image', file);
        });
      }

      // Add files (multiple files)
      if (data.files && Array.isArray(data.files)) {
        data.files.forEach((fileField: FileField) => {
          if (fileField.file) {
            formData.append('files', fileField.file);
          }
        });
      }

      // Debugging the FormData
      // for (const [key, value] of formData.entries()) {

      // }

      let response;
      if (!entityId) {
        response = await fetchApi('/wallpaper/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/wallpaper/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditWallpaperSuccess());
        dispatch(fetchWallpaperList());
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something went wrong!';
        dispatch(addEditWallpaperFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something went wrong!';
      dispatch(addEditWallpaperFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleWallpaper = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'wallpaper/getsingleeallpaper',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleWallpaperStart());
      const response = await fetchApi(`/wallpaper/${entityId}`, {
        method: 'GET'
      });

      if (response?.success) {
        response.wallpaper = response.wallpaper._id;
        dispatch(fetchSingleWallpaperSuccess(response.wallpaper));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleWallpaperFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleWallpaperFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

const wallpaperSlice = createSlice({
  name: 'wallpaper',
  initialState,
  reducers: {
    fetchWallpaperStart(state) {
      state.wallpaperListState.loading = true;
      state.wallpaperListState.error = null;
    },
    fetchWallpaperListSuccess(state, action) {
      state.wallpaperListState.loading = false;
      const { data, totalCount } = action.payload;
      state.wallpaperListState.data = data;
      state.wallpaperListState.pagination.totalCount = totalCount;
      state.wallpaperListState.error = null;
    },
    fetchWallpaperFailure(state, action) {
      (state.wallpaperListState.loading = false),
        (state.wallpaperListState.error = action.payload);
    },
    setWallpaperData(state, action) {
      state.singleWallpaperState.data = action.payload;
    },
    updateWallpaperData(state, action) {
      const oldData = state.singleWallpaperState.data;
      state.singleWallpaperState.data = { ...oldData, ...action.payload };
    },
    addEditWallpaperStart(state) {
      state.singleWallpaperState.loading = true;
      state.singleWallpaperState.error = null;
    },
    addEditWallpaperSuccess(state) {
      state.singleWallpaperState.loading = false;
      state.singleWallpaperState.error = null;
    },
    addEditWallpaperFailure(state, action) {
      state.singleWallpaperState.loading = false;
      state.singleWallpaperState.error = action.payload;
    },
    fetchSingleWallpaperStart(state) {
      state.singleWallpaperState.loading = true;
      state.singleWallpaperState.error = null;
    },
    fetchSingleWallpaperSuccess(state, action) {
      state.singleWallpaperState.loading = false;
      state.singleWallpaperState.data = action.payload;
      state.singleWallpaperState.error = null;
    },
    fetchSingleWallpaperFailure(state, action) {
      state.singleWallpaperState.loading = false;
      state.singleWallpaperState.error = null;
    }
  }
});

export const {
  fetchWallpaperFailure,
  fetchWallpaperListSuccess,
  fetchWallpaperStart,
  updateWallpaperData,
  addEditWallpaperFailure,
  addEditWallpaperStart,
  addEditWallpaperSuccess,
  setWallpaperData,
  fetchSingleWallpaperFailure,
  fetchSingleWallpaperStart,
  fetchSingleWallpaperSuccess
} = wallpaperSlice.actions;

export default wallpaperSlice.reducer;
