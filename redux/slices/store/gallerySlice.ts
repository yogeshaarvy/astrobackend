import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../store';

// Define the ShopPurposesRootState type to include shopPurposes
export interface GalleryImagesRootState {
  galleryImages: typeof initialState;
}
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';

// Define the IShopPurposes type
export type IGalleryImages = BaseModel & {
  title?: string;
  sequence?: number;
  gallery_image?: string;
  active?: boolean;
};

// Initial state
const initialState = {
  galleryImagesListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IGalleryImages[]>,
  singleGalleryImageState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IGalleryImages | null>
};

// Thunks
export const fetchGalleryImagesList = createAsyncThunk<
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
  'galleryImages/fetchGalleryImagesList',
  async (input, { dispatch, rejectWithValue }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};
      dispatch(fetchGalleryImagesStart());

      const response = await fetchApi(
        `/store/galleryimage/all?page=${page || 1}&pageSize=${
          pageSize || 5
        }&text=${keyword || ''}&field=${field || ''}&active=${
          active || ''
        }&export=${exportData || false}`,
        { method: 'GET' }
      );
      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchGalleryImagesListSuccess({
              data: response.galleryimage,
              totalCount: response.totalGalleryImagesCount
            })
          );
        } else {
          dispatch(fetchGalleryImagesExportLoading(false));
        }

        return response;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error: any) {
      dispatch(
        fetchGalleryImagesFailure(error?.message || 'Something went wrong')
      );
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

export const addEditGalleryImages = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'galleryImages/add',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        galleryImage: {
          singleGalleryImageState: { data }
        }
      } = getState();

      dispatch(addEditGalleryImagesStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        title: clonedData.title ? clonedData.title : undefined,
        sequence: clonedData.sequence,
        gallery_image: clonedData.gallery_image,
        active: clonedData.active
      };

      // Append only defined fields to FormData
      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/store/galleryimage/new', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/store/galleryimage/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }
      if (response?.success) {
        dispatch(addEditGalleryImagesSuccess());
        dispatch(fetchGalleryImagesList());
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
        dispatch(addEditGalleryImagesFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditGalleryImagesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleGalleryImage = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'types/getsingletypes',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleGalleryImageStart());
      const response = await fetchApi(
        `/store/galleryimage/single/${entityId}`,
        {
          method: 'GET'
        }
      );
      if (response?.success) {
        dispatch(fetchSingleGalleryImageSuccess(response?.galleryimage));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleGalleryImageFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleGalleryImageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteGalleryImage = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('brand/delete', async (id, { dispatch }) => {
  dispatch(deleteGalleryImageStart());
  try {
    const response = await fetchApi(`/store/galleryimage/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteGalleryImageSuccess(id));
      dispatch(fetchGalleryImagesList());
      toast.success('Gallery Image deleted successfuly');
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteGalleryImageFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteGalleryImageFailure(
        error.message || 'Failed to delete Gallery Image'
      )
    );
    toast.error(error.message);
  }
});

// Slice
const galleryImagesSlice = createSlice({
  name: 'GalleryImage',
  initialState,
  reducers: {
    setGalleryImagesData(state, action) {
      state.singleGalleryImageState.data = action.payload;
    },
    fetchGalleryImagesStart(state) {
      state.galleryImagesListState.loading = true;
      state.galleryImagesListState.error = null;
    },
    fetchGalleryImagesListSuccess(state, action) {
      const { data, totalCount } = action.payload;
      state.galleryImagesListState.data = data;
      state.galleryImagesListState.pagination.totalCount = totalCount;
      state.galleryImagesListState.loading = false;
    },
    fetchGalleryImagesFailure(state, action) {
      state.galleryImagesListState.loading = false;
      state.galleryImagesListState.error = action.payload;
    },
    addEditGalleryImagesStart(state) {
      state.singleGalleryImageState.loading = true;
      state.singleGalleryImageState.error = null;
    },
    addEditGalleryImagesSuccess(state) {
      state.singleGalleryImageState.loading = false;
    },
    addEditGalleryImagesFailure(state, action) {
      state.singleGalleryImageState.loading = false;
      state.singleGalleryImageState.error = action.payload;
    },
    updateGalleryImagesData(state, action) {
      const oldData = state.singleGalleryImageState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleGalleryImageState.data = newData;
      } else {
        state.singleGalleryImageState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    fetchSingleGalleryImageStart(state) {
      state.singleGalleryImageState.loading = true;
      state.singleGalleryImageState.error = null;
    },
    fetchSingleGalleryImageSuccess(state, action) {
      state.singleGalleryImageState.loading = false;
      state.singleGalleryImageState.data = action.payload;
      state.singleGalleryImageState.error = null;
    },
    fetchSingleGalleryImageFailure(state, action) {
      state.singleGalleryImageState.loading = false;
      state.singleGalleryImageState.error = action.payload;
    },
    deleteGalleryImageStart(state) {
      state.singleGalleryImageState.loading = true;
      state.singleGalleryImageState.error = null;
    },
    deleteGalleryImageSuccess(state, action) {
      state.singleGalleryImageState.loading = false;
    },
    deleteGalleryImageFailure(state, action) {
      state.singleGalleryImageState.loading = false;
      state.singleGalleryImageState.error = action.payload;
    },
    fetchGalleryImagesExportLoading(state, action) {
      state.galleryImagesListState.loading = action.payload;
    }
  }
});

export const {
  fetchGalleryImagesStart,
  fetchGalleryImagesListSuccess,
  fetchGalleryImagesFailure,
  addEditGalleryImagesStart,
  fetchGalleryImagesExportLoading,
  addEditGalleryImagesSuccess,
  setGalleryImagesData,
  addEditGalleryImagesFailure,
  updateGalleryImagesData,
  fetchSingleGalleryImageStart,
  fetchSingleGalleryImageSuccess,
  fetchSingleGalleryImageFailure,
  deleteGalleryImageStart,
  deleteGalleryImageSuccess,
  deleteGalleryImageFailure
} = galleryImagesSlice.actions;

export default galleryImagesSlice.reducer;
