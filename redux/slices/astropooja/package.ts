import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

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
  sequence?: number;
  active?: boolean;
  pooja_id?:
    | string
    | {
        _id: string;
        title?: {
          en?: string;
          hi?: string;
        };
        slug?: string;
      };
};

export interface AstroPackageState {
  astroPackageList: PaginationState<IAstroPackage[]>;
  singleAstroPackageState: BaseState<IAstroPackage | null>;
}

const initialState = {
  astroPackageList: {
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

export const addEditAstroPackage = createAsyncThunk<
  any,
  any,
  { state: RootState }
>(
  'astroPackage/addEditAstroPackage',
  async (
    { entityId, astropoojaId },
    { dispatch, rejectWithValue, getState }
  ) => {
    try {
      const {
        astroPackage: {
          singleAstroPackageState: { data }
        }
      } = getState();
      dispatch(addEditAstroPackageStart());

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
        price: clonedData.price,
        pooja_id: astropoojaId,
        sequence: clonedData.sequence,
        active: clonedData.active
      };

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
        response = await fetchApi(`/astro-pooja/package/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }
      if (response?.success) {
        dispatch(addEditAstroPackageSuccess());
        dispatch(fetchAstroPackageList());
        toast.success(response?.message || 'Operation completed successfully');
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditAstroPackageFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditAstroPackageFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchAstroPackageList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    astropoojaId?: string; // Fixed: changed from astropoojalistid to astropoojaListId
    keyword?: string;
    field?: string;
    active?: string;
    exportData?: boolean;
  } | void,
  { state: RootState }
>(
  'astroPackage/fetchAstroPackageList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        page,
        pageSize,
        astropoojaId,
        keyword,
        field,
        active,
        exportData
      } = input || {};
      console.log('pooja iof og atstsgsggh', astropoojaId, pageSize);
      dispatch(fetchAstroPackageListStart());
      const response = await fetchApi(
        `/astro-pooja/package/all?page=${page || 1}&limit=${
          pageSize || 10
        }&field=${field || ''}&text=${keyword || ''}&active=${
          active || ''
        }&astropoojaListId=${
          astropoojaId // Fixed: parameter name to match backend
        }&exportData=${exportData || false}`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchAstroPackageListSuccess({
              data: response.astroPackageList,
              totalCount: response.totalAstroPackage
            })
          );
        } else {
          dispatch(fetchAstroPackageListExportLoading(false));
        }

        return response;
      } else {
        throw new Error(response?.message || 'No Status Or Invalid Response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchAstroPackageListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleAstroPackage = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'astroPackage/fetchSingleAstroPackage',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleAstroPackageStart());
      const response = await fetchApi(`/astro-pooja/package/get/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleAstroPackageSuccess(response?.packageData));
        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
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

export const deleteAstroPackage = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('astroPackage/deleteAstroPackage', async (entityId, { dispatch }) => {
  dispatch(deleteAstroPackageStart());
  try {
    const response = await fetchApi(`/astro-pooja/package/delete/${entityId}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteAstroPackageSuccess(entityId));
      dispatch(fetchAstroPackageList());
      toast.success(response?.message || 'AstroPackage deleted successfully');
      return response;
    } else {
      let errorMsg = response?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteAstroPackageFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteAstroPackageFailure(
        error.message || 'Failed to delete astro package'
      )
    );
    toast.error(error.message);
  }
});

export const fetchAstroPackageForUser = createAsyncThunk<
  any,
  { selectedLanguage?: string; pooja_id?: string } | void,
  { state: RootState }
>(
  'astroPackage/fetchAstroPackageForUser',
  async (input, { dispatch, rejectWithValue }) => {
    try {
      const { selectedLanguage, pooja_id } = input || {};

      const response = await fetchApi(
        `/astro-pooja/package/user/get?selectedLanguage=${
          selectedLanguage || 'en'
        }&pooja_id=${pooja_id || ''}`, // Fixed: endpoint path
        { method: 'GET' }
      );

      if (response?.success) {
        return response.data;
      } else {
        throw new Error(
          response?.message || 'Failed to fetch user astro packages'
        );
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      return rejectWithValue(errorMsg);
    }
  }
);

const astroPackageSlice = createSlice({
  name: 'astroPackage',
  initialState,
  reducers: {
    setAstroPackageData(state, action) {
      state.singleAstroPackageState.data = action.payload;
    },
    updateAstroPackageData(state, action) {
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
    // Reset single astro package data
    resetAstroPackageData(state) {
      state.singleAstroPackageState.data = null;
      state.singleAstroPackageState.loading = false;
      state.singleAstroPackageState.error = null;
    },
    addEditAstroPackageStart(state) {
      state.singleAstroPackageState.loading = true;
      state.singleAstroPackageState.error = null;
    },
    addEditAstroPackageSuccess(state) {
      state.singleAstroPackageState.loading = false;
      state.singleAstroPackageState.error = null;
    },
    addEditAstroPackageFailure(state, action) {
      state.singleAstroPackageState.loading = false;
      state.singleAstroPackageState.error = action.payload;
    },
    fetchAstroPackageListStart(state) {
      state.astroPackageList.loading = true;
      state.astroPackageList.error = null;
    },
    fetchAstroPackageListSuccess(state, action) {
      state.astroPackageList.loading = false;
      const { data, totalCount } = action.payload;
      state.astroPackageList.data = data;
      state.astroPackageList.pagination.totalCount = totalCount;
      state.astroPackageList.error = null;
    },
    fetchAstroPackageListFailure(state, action) {
      state.astroPackageList.loading = false;
      state.astroPackageList.error = action.payload;
    },
    fetchSingleAstroPackageStart(state) {
      state.singleAstroPackageState.loading = true;
      state.singleAstroPackageState.error = null;
    },
    fetchSingleAstroPackageFailure(state, action) {
      state.singleAstroPackageState.loading = false;
      state.singleAstroPackageState.error = action.payload;
    },
    fetchSingleAstroPackageSuccess(state, action) {
      state.singleAstroPackageState.loading = false;
      state.singleAstroPackageState.data = action.payload;
      state.singleAstroPackageState.error = null;
    },
    deleteAstroPackageStart(state) {
      state.singleAstroPackageState.loading = true;
      state.singleAstroPackageState.error = null;
    },
    deleteAstroPackageSuccess(state, action) {
      state.singleAstroPackageState.loading = false;
      // Remove deleted item from list if it exists
      state.astroPackageList.data =
        state?.astroPackageList?.data &&
        state?.astroPackageList?.data.filter(
          (item) => item._id !== action.payload
        );
    },
    deleteAstroPackageFailure(state, action) {
      state.singleAstroPackageState.loading = false;
      state.singleAstroPackageState.error = action.payload;
    },
    fetchAstroPackageListExportLoading(state, action) {
      state.astroPackageList.loading = action.payload;
    },
    // Update pagination
    updatePagination(state, action) {
      state.astroPackageList.pagination = {
        ...state.astroPackageList.pagination,
        ...action.payload
      };
    }
  }
});

export const {
  setAstroPackageData,
  fetchAstroPackageListExportLoading,
  fetchAstroPackageListFailure,
  fetchAstroPackageListStart,
  fetchAstroPackageListSuccess,
  fetchSingleAstroPackageFailure,
  fetchSingleAstroPackageStart,
  fetchSingleAstroPackageSuccess,
  addEditAstroPackageFailure,
  addEditAstroPackageStart,
  addEditAstroPackageSuccess,
  deleteAstroPackageStart,
  deleteAstroPackageSuccess,
  updateAstroPackageData,
  deleteAstroPackageFailure,
  resetAstroPackageData,
  updatePagination
} = astroPackageSlice.actions;

export default astroPackageSlice.reducer;
