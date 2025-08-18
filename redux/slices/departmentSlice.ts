import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

export type IDepartment = BaseModel & {
  _id?: string;
  name?: string;
  modulePermissionsList?: ModulePermission[],
  contentPermissions?: ContentPermission;
}
export type ContentPermission = {
  app?: boolean,
  web?: boolean,
  seo?: boolean,
}

export type ModulePermission = {
  add?: boolean;
  view?: boolean;
  edit?: boolean;
  delete?: boolean;
  download?: boolean;
};

const initialState = {
  departmentListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0,
    }
  } as PaginationState<IDepartment[]>,
  singleDepartmentState: {
    data: { name: '', modulePermissionsList: [], contentPermissions: {} as ContentPermission },
    loading: null,
    error: null,
    modulePermissions: []
  } as BaseState<IDepartment | null>,
}

export const fetchDepartmentList = createAsyncThunk<any, { page?: number, pageSize?: number } | void, { state: RootState }>(
  'department/fetchDepartmentList', async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize } = input || {};
      dispatch(fetchDepartmentListStart());
      const response = await fetchApi(`/department/all?page=${page}&limit=${pageSize}`, { method: "GET" });
      if (response?.success) {
        dispatch(fetchDepartmentListSuccess({ data: response.allDepartmentList, totalCount: response.totalDepartment }))
      } else {
        throw new Error("No status or invalid response");
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? "Something Went Wrong!!";
      dispatch(fetchDepartmentListFailure(errorMsg));
      return rejectWithValue(errorMsg)
    }
  }
)

export const addEditDepartment = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'department/addedit',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        department: {
          singleDepartmentState: { data }
        }
      } = getState();

      dispatch(addEditDepartmentStart());
      if (!data) {
        return rejectWithValue("Please Provide Details");
      }
      let response;
      if (!entityId) {
        response = await fetchApi('/department/create', { method: "POST", body: data })
      } else {
        response = await fetchApi(`/department/update/${entityId}`, { method: "PUT", body: data })
      }

      if (response?.success) {
        dispatch(addEditDepartmentSuccess());
        dispatch(fetchDepartmentList());
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong';
        dispatch(addEditDepartmentFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(addEditDepartmentFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleDepartment = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'department/getsingledepartment',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleDepartmentStart());
      const response = await fetchApi(`/department/get/${entityId}`, { method: "GET" });
      if (response?.success) {
        dispatch(fetchSingleDepartmentSuccess(response.departmentData));
        return response;
      } else {
        let errorMsg = response?.data?.message || "Something Went Wrong";
        dispatch(fetchSingleDepartmentFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleDepartmentFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    fetchDepartmentListStart(state) {
      state.departmentListState.loading = true;
      state.departmentListState.error = null;
    },
    fetchDepartmentListSuccess(state, action) {
      state.departmentListState.loading = false;
      const { data, totalCount } = action.payload;
      state.departmentListState.data = data;
      state.departmentListState.pagination.totalCount = totalCount;
      state.departmentListState.error = null;
    },
    fetchDepartmentListFailure(state, action) {
      state.departmentListState.loading = false;
      state.departmentListState.error = action.payload
    },
    // For HandleInput Change
    setDepartmentData(state, action) {
      state.singleDepartmentState.data = action.payload;
    },
    updateDepartmentData(state, action) {
      const oldData = state.singleDepartmentState.data;
      state.singleDepartmentState.data = { ...oldData, ...action.payload }
    },
    addEditDepartmentStart(state) {
      state.singleDepartmentState.loading = true;
      state.singleDepartmentState.error = null;
    },
    addEditDepartmentSuccess(state) {
      state.singleDepartmentState.loading = false;
      state.singleDepartmentState.error = null;
    },
    addEditDepartmentFailure(state, action) {
      state.singleDepartmentState.loading = false;
      state.singleDepartmentState.error = action.payload;
    },
    fetchSingleDepartmentStart(state) {
      state.singleDepartmentState.loading = true;
      state.singleDepartmentState.error = null;
    },
    fetchSingleDepartmentSuccess(state, action) {
      state.singleDepartmentState.loading = false;
      state.singleDepartmentState.data = action.payload;
      state.singleDepartmentState.error = null;
    },
    fetchSingleDepartmentFailure(state, action) {
      state.singleDepartmentState.loading = false;
      state.singleDepartmentState.error = action.payload;
    },
  }
})

export const {
  fetchDepartmentListStart,
  fetchDepartmentListSuccess,
  fetchDepartmentListFailure,
  setDepartmentData,
  updateDepartmentData,
  addEditDepartmentStart,
  addEditDepartmentSuccess,
  addEditDepartmentFailure,
  fetchSingleDepartmentStart,
  fetchSingleDepartmentSuccess,
  fetchSingleDepartmentFailure
} = departmentSlice.actions;
export default departmentSlice.reducer;
