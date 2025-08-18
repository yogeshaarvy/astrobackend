import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type IVastushastrList = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  short_description?: {
    en?: string;
    hi?: string;
  };
  description?: {
    en?: string;
    hi?: string;
  };
  cssid?: string;
  icon?: string;
  sequence?: number;
  active?: boolean;
};

const initialState = {
  vastushastrList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IVastushastrList[]>,
  singleVastushastrListState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IVastushastrList | null>
};

export const addEditVastushastrList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'vastushastr/addEditVastushastrList',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        vastushastrList: {
          singleVastushastrListState: { data }
        }
      } = getState();

      dispatch(addEditVastushastrListStart());

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
        short_description: clonedData.short_description
          ? JSON.stringify(clonedData.short_description)
          : undefined,
        icon: clonedData.icon,
        cssid: clonedData.cssid,
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
        response = await fetchApi('/vastu_shastr/list/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/vastu_shastr/list/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditVastushastrListSuccess());
        dispatch(fetchVastushastrList());
        toast.success(response?.message || 'Operation completed successfully');
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditVastushastrListFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditVastushastrListFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchVastushastrList = createAsyncThunk<
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
  'astropooja/fetchVastushastrList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, active, exportData } =
        input || {};
      dispatch(fetchVastushastrListStart());
      const response = await fetchApi(
        `/vastu_shastr/list/all?page=${page || 1}&limit=${
          pageSize || 10
        }&field=${field || ''}&text=${keyword || ''}&active=${
          active || ''
        }&exportData=${exportData || false}`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchVastushastrListSuccess({
              data: response.vastushastrList,
              totalCount: response.totalVastushastrListCount
            })
          );
        } else {
          dispatch(fetchVastushastrListExportLoading(false));
        }

        return response;
      } else {
        throw new Error(response?.message || 'No Status Or Invalid Response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchVastushastrListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleVastushastrList = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'astropooja/fetchSingleVastushastrList',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleVastushastrListStart());
      const response = await fetchApi(`/vastu_shastr/list/get/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleVastushastrListSuccess(response?.vastushastrList));
        return response;
      } else {
        let errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchSingleVastushastrListFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleVastushastrListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteVastushastrList = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('astropooja/deleteVastushastrList', async (id, { dispatch }) => {
  dispatch(deleteVastushastrListStart());
  try {
    const response = await fetchApi(`/vastu_shastr/list/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteVastushastrListSuccess(id));
      dispatch(fetchVastushastrList());
      toast.success(
        response?.message || 'VastushastrList deleted successfully'
      );
      return response;
    } else {
      let errorMsg = response?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteVastushastrListFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteVastushastrListFailure(
        error.message || 'Failed to delete Vastushastr List'
      )
    );
    toast.error(error.message);
  }
});

// export const fetchVastushastrListForUser = createAsyncThunk<
//   any,
//   { selectedLanguage?: string } | void,
//   { state: RootState }
// >(
//   'astropooja/fetchVastushastrListForUser',
//   async (input, { dispatch, rejectWithValue }) => {
//     try {
//       const { selectedLanguage } = input || {};

//       const response = await fetchApi(
//         `/vastu_shastr/list/user?selectedLanguage=${selectedLanguage || 'en'}`,
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

const vastushastrSlice = createSlice({
  name: 'vastushastr',
  initialState,
  reducers: {
    setVastushastrListData(state, action) {
      state.singleVastushastrListState.data = action.payload;
    },
    updateVastushastrListData(state, action) {
      const oldData = state.singleVastushastrListState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleVastushastrListState.data = newData;
      } else {
        state.singleVastushastrListState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    addEditVastushastrListStart(state) {
      state.singleVastushastrListState.loading = true;
      state.singleVastushastrListState.error = null;
    },
    addEditVastushastrListSuccess(state) {
      state.singleVastushastrListState.loading = false;
      state.singleVastushastrListState.error = null;
    },
    addEditVastushastrListFailure(state, action) {
      state.singleVastushastrListState.loading = false;
      state.singleVastushastrListState.error = action.payload;
    },
    fetchVastushastrListStart(state) {
      state.vastushastrList.loading = true;
      state.vastushastrList.error = null;
    },
    fetchVastushastrListSuccess(state, action) {
      state.vastushastrList.loading = false;
      const { data, totalCount } = action.payload;
      state.vastushastrList.data = data;
      state.vastushastrList.pagination.totalCount = totalCount;
      state.vastushastrList.error = null;
    },
    fetchVastushastrListFailure(state, action) {
      state.vastushastrList.loading = false;
      state.vastushastrList.error = action.payload;
    },
    fetchSingleVastushastrListStart(state) {
      state.singleVastushastrListState.loading = true;
      state.singleVastushastrListState.error = null;
    },
    fetchSingleVastushastrListFailure(state, action) {
      state.singleVastushastrListState.loading = false;
      state.singleVastushastrListState.error = action.payload;
    },
    fetchSingleVastushastrListSuccess(state, action) {
      state.singleVastushastrListState.loading = false;
      state.singleVastushastrListState.data = action.payload;
      state.singleVastushastrListState.error = null;
    },
    deleteVastushastrListStart(state) {
      state.singleVastushastrListState.loading = true;
      state.singleVastushastrListState.error = null;
    },
    deleteVastushastrListSuccess(state, action) {
      state.singleVastushastrListState.loading = false;
    },
    deleteVastushastrListFailure(state, action) {
      state.singleVastushastrListState.loading = false;
      state.singleVastushastrListState.error = action.payload;
    },
    fetchVastushastrListExportLoading(state, action) {
      state.vastushastrList.loading = action.payload;
    }
  }
});

export const {
  setVastushastrListData,
  fetchVastushastrListExportLoading,
  fetchVastushastrListFailure,
  fetchVastushastrListStart,
  fetchVastushastrListSuccess,
  fetchSingleVastushastrListFailure,
  fetchSingleVastushastrListStart,
  fetchSingleVastushastrListSuccess,
  addEditVastushastrListFailure,
  addEditVastushastrListStart,
  addEditVastushastrListSuccess,
  deleteVastushastrListStart,
  deleteVastushastrListSuccess,
  updateVastushastrListData,
  deleteVastushastrListFailure
} = vastushastrSlice.actions;

export default vastushastrSlice.reducer;
