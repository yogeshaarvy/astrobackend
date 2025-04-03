import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { cloneDeep } from 'lodash';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';

export type IAstroPackage = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  description?: {
    en?: string;
    hi?: string;
  };
  price?: number;
};

// Initial state
const initialState = {
  astroPackageListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IAstroPackage[]>,
  singleAstroPackageState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IAstroPackage | null>
};

// Thunks
export const fetchAstroPackagesList = createAsyncThunk<
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
  'astroPackage/fetchAstroPackagesList',
  async (input, { dispatch, rejectWithValue }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};
      dispatch(fetchAstroPackagesStart());

      const response = await fetchApi(
        `/astro-pooja/package/all?page=${page || 1}&pageSize=${
          pageSize || 5
        }&text=${keyword || ''}&field=${field || ''}&active=${
          active || ''
        }&export=${exportData || false}`,
        { method: 'GET' }
      );
      console.log('response of all pack', response);
      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchAstroPackagesListSuccess({
              data: response.astroPackageList,
              totalCount: response.totalAstroPackageCount
            })
          );
        } else {
          dispatch(fetchAstroPackagesExportLoading(false));
        }

        return response;
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error: any) {
      dispatch(
        fetchAstroPackagesFailure(error?.message || 'Something went wrong')
      );
      return rejectWithValue(error?.message || 'Something went wrong');
    }
  }
);

export const addEditAstroPackages = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'astroPackages/add',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        astroPackage: {
          singleAstroPackageState: { data }
        }
      } = getState();

      dispatch(addEditAstroPackagesStart());

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
        price: clonedData.price
      };
      // Append only defined fields to FormData
      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/astro-pooja/package/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/astro-pooja/package/update/:${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }
      if (response?.success) {
        dispatch(addEditAstroPackagesSuccess());
        dispatch(fetchAstroPackagesList());
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
        dispatch(addEditAstroPackagesFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditAstroPackagesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleAstroPackage = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'types/getsingletypes',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleAstroPackageStart());
      const response = await fetchApi(`/astro-pooja/package/get/:${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleAstroPackageSuccess(response?.astroPackagedata));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleAstroPackageFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleAstroPackageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

const astroPackagesSlice = createSlice({
  name: 'astroPackages',
  initialState,
  reducers: {
    setAstroPackageData(state, action) {
      state.singleAstroPackageState.data = action.payload;
    },
    fetchAstroPackagesStart(state) {
      state.astroPackageListState.loading = true;
      state.astroPackageListState.error = null;
    },
    fetchAstroPackagesListSuccess(state, action) {
      const { data, totalCount } = action.payload;
      state.astroPackageListState.data = data;
      state.astroPackageListState.pagination.totalCount = totalCount;
      state.astroPackageListState.loading = false;
    },
    fetchAstroPackagesFailure(state, action) {
      state.astroPackageListState.loading = false;
      state.astroPackageListState.error = action.payload;
    },
    addEditAstroPackagesStart(state) {
      state.singleAstroPackageState.loading = true;
      state.singleAstroPackageState.error = null;
    },
    addEditAstroPackagesSuccess(state) {
      state.singleAstroPackageState.loading = false;
    },
    addEditAstroPackagesFailure(state, action) {
      state.singleAstroPackageState.loading = false;
      state.singleAstroPackageState.error = action.payload;
    },
    updateAstroPackagesData(state, action) {
      const oldData = state.singleAstroPackageState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleAstroPackageState.data = newData;
      } else {
        state.singleAstroPackageState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    fetchSingleAstroPackageStart(state) {
      state.singleAstroPackageState.loading = true;
      state.singleAstroPackageState.error = null;
    },
    fetchSingleAstroPackageSuccess(state, action) {
      state.singleAstroPackageState.loading = false;
      state.singleAstroPackageState.data = action.payload;
      state.singleAstroPackageState.error = null;
    },
    fetchSingleAstroPackageFailure(state, action) {
      state.singleAstroPackageState.loading = false;
      state.singleAstroPackageState.error = action.payload;
    },
    deleteAstroPackageStart(state) {
      state.singleAstroPackageState.loading = true;
      state.singleAstroPackageState.error = null;
    },
    deleteAstroPackageSuccess(state, action) {
      state.singleAstroPackageState.loading = false;
    },
    deleteAstroPackageFailure(state, action) {
      state.singleAstroPackageState.loading = false;
      state.singleAstroPackageState.error = action.payload;
    },
    fetchAstroPackagesExportLoading(state, action) {
      state.astroPackageListState.loading = action.payload;
    }
  }
});

export const {
  fetchAstroPackagesStart,
  fetchAstroPackagesListSuccess,
  fetchAstroPackagesFailure,
  addEditAstroPackagesStart,
  addEditAstroPackagesSuccess,
  addEditAstroPackagesFailure,
  updateAstroPackagesData,
  setAstroPackageData,
  fetchSingleAstroPackageStart,
  fetchSingleAstroPackageSuccess,
  fetchSingleAstroPackageFailure,
  deleteAstroPackageStart,
  deleteAstroPackageSuccess,
  fetchAstroPackagesExportLoading,
  deleteAstroPackageFailure
} = astroPackagesSlice.actions;

export default astroPackagesSlice.reducer;
