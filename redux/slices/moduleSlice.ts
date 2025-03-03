import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

export type IModule = BaseModel & {
  name?: string;
};

const initialState = {
  moduleListState: {
    data: [] as IModule[],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IModule[]>,
  singleModuleState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IModule | null>,
  currentModuleState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IModule | null>
};

export const fetchModuleList = createAsyncThunk<
  any,
  { page?: number; pageSize?: number } | void,
  { state: RootState }
>(
  'module/fetchModuleList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
        dispatch(fetchModuleListStart());
        const response = await fetchApi("/module/all", { method: "GET" });
        if (response?.success) {
            dispatch(fetchModuleListSuccess({ data: response.allModuleList, totalCount: response.totalCount }));
            return response?.allModuleList;
        } else {
            throw new Error("No status or Invalid Response");
        }
    } catch (error: any) {
      let errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchModuleListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditModule = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'module/addEdit',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        module: {
          singleModuleState: { data }
        }
      } = getState();

      dispatch(addEditModuleStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      // let formData = new FormData();

      // const reqData: any = {
      //     name: data.name,
      // }

            // formData.append('data', JSON.stringify(reqData));
            let response;
            if (!entityId) {
                response = await fetchApi('/module/create', {
                    method: 'POST', body: data
                })
            } else {
                response = await fetchApi(`/module/update/${entityId}`, {
                    method: "PUT",
                    body: data
                })
            }

      if (response?.success) {
        dispatch(addEditModuleSuccess());
        dispatch(fetchModuleList());
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong!!';
        dispatch(addEditModuleFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditModuleFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const getSingleModule = createAsyncThunk<any, string | void, { state: RootState }>(
    "module/getsinglemodule", async (entityId, { dispatch, rejectWithValue, getState }) => {
        try {
            dispatch(fetchSingleModuleStart());
            const response = await fetchApi(`/module/${entityId}`, { method: 'GET' });
            dispatch(fetchSingleModuleSuccess(response.module));
            return response;
        } catch (error: any) {
            let errorMsg = error?.message || "Something Went Wrong";
            dispatch(fetchSingleModuleFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
)

const moduleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {
    fetchModuleListStart(state) {
      state.moduleListState.loading = true;
      state.moduleListState.error = null;
    },
    fetchModuleListSuccess(state, action) {
      state.moduleListState.loading = false;
      const { data, totalCount } = action.payload;
      state.moduleListState.data = data;
      state.moduleListState.pagination.totalCount = totalCount;
      state.moduleListState.error = null;
    },
    fetchModuleListFailure(state, action) {
      state.moduleListState.loading = false;
      state.moduleListState.error = action.payload;
    },
    setModuleData(state, action) {
      state.singleModuleState.data = action.payload;
    },
    updateModuleData(state, action) {
      const oldData = state.singleModuleState.data;
      state.singleModuleState.data = { ...oldData, ...action.payload };
    },
    addEditModuleStart(state) {
      state.singleModuleState.loading = true;
      state.singleModuleState.error = null;
    },
    addEditModuleSuccess(state) {
      state.singleModuleState.loading = false;
      state.singleModuleState.error = null;
    },
    addEditModuleFailure(state, action) {
      state.singleModuleState.loading = false;
      state.singleModuleState.error = action.payload;
    },
    fetchSingleModuleStart(state) {
      state.singleModuleState.loading = true;
      state.singleModuleState.error = null;
    },
    fetchSingleModuleSuccess(state, action) {
      state.singleModuleState.loading = false;
      state.singleModuleState.data = action.payload;
      state.singleModuleState.error = null;
    },
    fetchSingleModuleFailure(state, action) {
      state.singleModuleState.loading = false;
      state.singleModuleState.error = action.payload;
    }
  }
});

export const {
  fetchModuleListStart,
  fetchModuleListSuccess,
  fetchModuleListFailure,
  setModuleData,
  updateModuleData,
  addEditModuleStart,
  addEditModuleSuccess,
  addEditModuleFailure,
  fetchSingleModuleStart,
  fetchSingleModuleSuccess,
  fetchSingleModuleFailure
} = moduleSlice.actions;

export default moduleSlice.reducer;
