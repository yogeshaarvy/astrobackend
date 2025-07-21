import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import {
  processNestedAWSFields,
  processNestedFields
} from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type IAstropoojaList = BaseModel & {
  metaTitle?: string;
  metaDescription?: string;
  metaKeyword?: string;
  title?: {
    en?: string;
    hi?: string;
  };
  description?: {
    en?: string;
    hi?: string;
  };
  slug?: string;
  thumbnail_image?: string;
  sequence?: number;
  active?: boolean;
  popular?: boolean;
};

const initialState = {
  astropoojaList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IAstropoojaList[]>,
  singleAstropoojaListState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IAstropoojaList | null>
};

export const addEditAstropoojaList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'astropooja/addEditAstropoojaList',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        astropoojaList: {
          singleAstropoojaListState: { data }
        }
      } = getState();

      dispatch(addEditAstropoojaListStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      let clonedData = cloneDeep(data);

      if (clonedData) {
        clonedData = await processNestedAWSFields(clonedData);
      }

      const formData = new FormData();
      const reqData: any = {
        metaTitle: clonedData.metaTitle,
        metaDescription: clonedData.metaDescription,
        metaKeyword: clonedData.metaKeyword,
        title: clonedData.title ? JSON.stringify(clonedData.title) : undefined,
        description: clonedData.description
          ? JSON.stringify(clonedData.description)
          : undefined,
        thumbnail_image: clonedData.thumbnail_image,
        slug: clonedData.slug,
        sequence: clonedData.sequence,
        active: clonedData.active,
        popular: clonedData.popular
      };

      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/astro-pooja/list/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/astro-pooja/list/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditAstropoojaListSuccess());
        dispatch(fetchAstropoojaList());
        toast.success(response?.message || 'Operation completed successfully');
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditAstropoojaListFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditAstropoojaListFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchAstropoojaList = createAsyncThunk<
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
  'astropooja/fetchAstropoojaList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};
      dispatch(fetchAstropoojaListStart());
      const response = await fetchApi(
        `/astro-pooja/list/all?page=${page || 1}&limit=${
          pageSize || 10
        }&field=${field || ''}&text=${keyword || ''}&active=${
          active || ''
        }&exportData=${exportData || false}`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchAstropoojaListSuccess({
              data: response.astropoojaList,
              totalCount: response.totalAstropoojaListCount
            })
          );
        } else {
          dispatch(fetchAstropoojaListExportLoading(false));
        }

        return response;
      } else {
        throw new Error(response?.message || 'No Status Or Invalid Response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchAstropoojaListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleAstropoojaList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'astropooja/fetchSingleAstropoojaList',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleAstropoojaListStart());
      const response = await fetchApi(`/astro-pooja/list/get/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleAstropoojaListSuccess(response?.astropoojaList));
        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchSingleAstropoojaListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleAstropoojaListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteAstropoojaList = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('astropooja/deleteAstropoojaList', async (id, { dispatch }) => {
  dispatch(deleteAstropoojaListStart());
  try {
    const response = await fetchApi(`/astro-pooja/list/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteAstropoojaListSuccess(id));
      dispatch(fetchAstropoojaList());
      toast.success(response?.message || 'AstropoojaList deleted successfully');
      return response;
    } else {
      let errorMsg = response?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteAstropoojaListFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteAstropoojaListFailure(
        error.message || 'Failed to delete astropooja list'
      )
    );
    toast.error(error.message);
  }
});

// export const fetchAstropoojaListForUser = createAsyncThunk<
//   any,
//   { selectedLanguage?: string } | void,
//   { state: RootState }
// >(
//   'astropooja/fetchAstropoojaListForUser',
//   async (input, { dispatch, rejectWithValue }) => {
//     try {
//       const { selectedLanguage } = input || {};

//       const response = await fetchApi(
//         `/astro-pooja/list/user?selectedLanguage=${selectedLanguage || 'en'}`,
//         { method: 'GET' }
//       );

//       if (response?.success) {
//         return response.data;
//       } else {
//         throw new Error(
//           response?.message || 'Failed to fetch user astropooja list'
//         );
//       }
//     } catch (error: any) {
//       const errorMsg = error?.message ?? 'Something Went Wrong!!';
//       return rejectWithValue(errorMsg);
//     }
//   }
// );

const astropoojaSlice = createSlice({
  name: 'astropooja',
  initialState,
  reducers: {
    setAstropoojaListData(state, action) {
      state.singleAstropoojaListState.data = action.payload;
    },
    updateAstropoojaListData(state, action) {
      const oldData = state.singleAstropoojaListState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleAstropoojaListState.data = newData;
      } else {
        state.singleAstropoojaListState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditAstropoojaListStart(state) {
      state.singleAstropoojaListState.loading = true;
      state.singleAstropoojaListState.error = null;
    },
    addEditAstropoojaListSuccess(state) {
      state.singleAstropoojaListState.loading = false;
      state.singleAstropoojaListState.error = null;
    },
    addEditAstropoojaListFailure(state, action) {
      state.singleAstropoojaListState.loading = false;
      state.singleAstropoojaListState.error = action.payload;
    },
    fetchAstropoojaListStart(state) {
      state.astropoojaList.loading = true;
      state.astropoojaList.error = null;
    },
    fetchAstropoojaListSuccess(state, action) {
      state.astropoojaList.loading = false;
      const { data, totalCount } = action.payload;
      state.astropoojaList.data = data;
      state.astropoojaList.pagination.totalCount = totalCount;
      state.astropoojaList.error = null;
    },
    fetchAstropoojaListFailure(state, action) {
      state.astropoojaList.loading = false;
      state.astropoojaList.error = action.payload;
    },
    fetchSingleAstropoojaListStart(state) {
      state.singleAstropoojaListState.loading = true;
      state.singleAstropoojaListState.error = null;
    },
    fetchSingleAstropoojaListFailure(state, action) {
      state.singleAstropoojaListState.loading = false;
      state.singleAstropoojaListState.error = action.payload;
    },
    fetchSingleAstropoojaListSuccess(state, action) {
      state.singleAstropoojaListState.loading = false;
      state.singleAstropoojaListState.data = action.payload;
      state.singleAstropoojaListState.error = null;
    },
    deleteAstropoojaListStart(state) {
      state.singleAstropoojaListState.loading = true;
      state.singleAstropoojaListState.error = null;
    },
    deleteAstropoojaListSuccess(state, action) {
      state.singleAstropoojaListState.loading = false;
    },
    deleteAstropoojaListFailure(state, action) {
      state.singleAstropoojaListState.loading = false;
      state.singleAstropoojaListState.error = action.payload;
    },
    fetchAstropoojaListExportLoading(state, action) {
      state.astropoojaList.loading = action.payload;
    }
  }
});

export const {
  setAstropoojaListData,
  fetchAstropoojaListExportLoading,
  fetchAstropoojaListFailure,
  fetchAstropoojaListStart,
  fetchAstropoojaListSuccess,
  fetchSingleAstropoojaListFailure,
  fetchSingleAstropoojaListStart,
  fetchSingleAstropoojaListSuccess,
  addEditAstropoojaListFailure,
  addEditAstropoojaListStart,
  addEditAstropoojaListSuccess,
  deleteAstropoojaListStart,
  deleteAstropoojaListSuccess,
  updateAstropoojaListData,
  deleteAstropoojaListFailure
} = astropoojaSlice.actions;

export default astropoojaSlice.reducer;
