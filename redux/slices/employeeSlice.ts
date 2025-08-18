import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { IDepartment, ModulePermission } from './departmentSlice';
import { IModule } from './moduleSlice';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';

export type IEmployee = BaseModel & {
  _id?: string;
  name?: string;
  phone?: string;
  countryCode?: string;
  email?: string;
  department?: string | IDepartment;
  image?: File[];
  password?: string;
  role?: string;
  isVerified?: Boolean;
  bio?: string;
  status?: Boolean;
  permissionType?: string;
  last_login?: Date;
  createdBy?: IEmployee;
  // permissions,
  modulePermissionList?: ModulePermission[];
};

export type ICurrentModulePermission = BaseModel & {
  permission: ModulePermission,
  employeeId: IEmployee,
  moduleId: IModule,
}

const initialState = {
  employeeListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IEmployee[]>,
  singleEmployeeState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IEmployee | null>,
  currentEmployeeState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IEmployee | null>,
  changeEmployeePassword: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IEmployee | null>,
  currentModulePermissionState: {
    data: null,
    loading: null,
    error: null,
  } as BaseState<ICurrentModulePermission | null>
};

export const fetchEmployeeList = createAsyncThunk<
  any,
  { page?: number; pageSize?: number; department?: string } | void,
  { state: RootState }
>(
  'employee/fetchEmployeeList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize } = input || {};
      dispatch(fetchEmployeeStart());
      const response = await fetchApi(`/employee/all?page=${page}&limit=${pageSize}`, { method: 'GET' });


      // Check if the API response is valid and has the expected data
      if (response?.success) {

        dispatch(
          fetchEmployeeListSuccess({
            data: response.allEmployees,
            totalCount: response.totalCount
          })
        );
      } else {
        // Handle response with no status or an error
        throw new Error('No status or invalid response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchEmployeeFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditEmployee = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('employee/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      employee: {
        singleEmployeeState: { data }
      }
    } = getState();

    dispatch(addEditEmployeeStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    const formData = new FormData();
    // Prepare the request data, omitting undefined fields dynamically
    const reqData: any = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      countryCode: data.countryCode,
      image: data.image,
      password: data.password,
      department:
        typeof data?.department === 'object' && data?.department !== null
          ? data.department?._id
          : data.department,
      role: data.role,
      bio: data.bio,
      permissionType: data.permissionType,
      active: data.active,
      modulePermissionsList:
        data.permissionType === 'custom'
          ? JSON.stringify(data.modulePermissionList)
          : undefined,
    };

    // Append only defined fields to FormData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    let response;
    if (!entityId) {
      response = await fetchApi('/employee/create', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/employee/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }

    if (response?.success) {
      dispatch(addEditEmployeeSuccess());
      dispatch(fetchEmployeeList());
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong!!';
      dispatch(addEditEmployeeFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditEmployeeFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});


export const fetchSingleEmployee = createAsyncThunk<any, string | null, { state: RootState }>('employee/getsingleemployee', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    dispatch(fetchSingleEmployeeStart());
    const response = await fetchApi(`/employee/get/${entityId}`, { method: 'GET' });

    if (response?.success) {
      response.employee.departmentId = response.employee.department._id;
      dispatch(fetchSingleEmployeeSuccess(response.employee));
      return response;
    } else {
      let errorMsg = response?.data?.message || "Something Went Wrong";
      dispatch(fetchSingleEmployeeFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }

  } catch (error: any) {
    let errorMsg = error?.message || "Something Went Wrong";
    dispatch(fetchSingleEmployeeFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
})

export const fetchCurrentModulePermission = createAsyncThunk<any, string | null, { state: RootState }>('employee/modulepermission', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    dispatch(fetchModulePermissionStart());
    const response = await fetchApi(`/employee/permission/${entityId}`, { method: 'GET' });
    dispatch(fetchModulePermissionSuccess(response));
    return response;
  } catch (error: any) {
    let errorMsg = error.message || "Something Went Wrong";
    dispatch(fetchModulePermissionFailure(errorMsg));
    return rejectWithValue(errorMsg);

  }
})

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    fetchEmployeeStart(state) {
      state.employeeListState.loading = true;
      state.employeeListState.error = null;
    },
    fetchEmployeeListSuccess(state, action) {
      state.employeeListState.loading = false;
      const { data, totalCount } = action.payload;
      state.employeeListState.data = data;
      state.employeeListState.pagination.totalCount = totalCount;
      state.employeeListState.error = null;
    },
    fetchEmployeeFailure(state, action) {
      state.employeeListState.loading = false;
      state.employeeListState.error = action.payload;
    },
    setEmployeeData(state, action) {
      state.singleEmployeeState.data = action.payload;
    },
    updateEmployeeData(state, action) {
      const oldData = state.singleEmployeeState.data;
      state.singleEmployeeState.data = { ...oldData, ...action.payload };
    },
    addEditEmployeeStart(state) {
      state.singleEmployeeState.loading = true;
      state.singleEmployeeState.error = null;
    },
    addEditEmployeeSuccess(state) {
      state.singleEmployeeState.loading = false;
      state.singleEmployeeState.error = null;
    },
    addEditEmployeeFailure(state, action) {
      state.singleEmployeeState.loading = false;
      state.singleEmployeeState.error = action.payload;
    },
    fetchSingleEmployeeStart(state) {
      state.singleEmployeeState.loading = true;
      state.singleEmployeeState.error = null;
    },
    fetchSingleEmployeeSuccess(state, action) {
      state.singleEmployeeState.loading = false;
      state.singleEmployeeState.data = action.payload;
      state.singleEmployeeState.error = null;
    },
    fetchSingleEmployeeFailure(state, action) {
      state.singleEmployeeState.loading = false;
      state.singleEmployeeState.error = action.payload;
    },
    fetchModulePermissionStart(state) {
      state.currentModulePermissionState.loading = true;
      state.currentModulePermissionState.error = null;
    },
    fetchModulePermissionSuccess(state, action) {
      state.currentModulePermissionState.loading = false;
      const { employeePermission, success, message } = action.payload;
      state.currentModulePermissionState.data = employeePermission;
      state.currentModulePermissionState.error = null;
    },
    fetchModulePermissionFailure(state, action) {
      state.currentModulePermissionState.loading = false;
      state.currentModulePermissionState.error = action.payload;
    }
  }
});

export const {
  fetchEmployeeStart,
  fetchEmployeeListSuccess,
  fetchEmployeeFailure,
  addEditEmployeeStart,
  addEditEmployeeSuccess,
  addEditEmployeeFailure,
  setEmployeeData,
  updateEmployeeData,
  fetchSingleEmployeeStart,
  fetchSingleEmployeeSuccess,
  fetchSingleEmployeeFailure,
  fetchModulePermissionStart,
  fetchModulePermissionSuccess,
  fetchModulePermissionFailure
} = employeeSlice.actions;

export default employeeSlice.reducer;
