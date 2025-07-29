// import type { RootState } from '@/redux/store';
// import { fetchApi } from '@/services/utlis/fetchApi';
// import type { BaseModel, BaseState, PaginationState } from '@/types/globals';
// import { setNestedProperty } from '@/utils/SetNestedProperty';
// import { processNestedFields } from '@/utils/UploadNestedFiles';
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { cloneDeep } from 'lodash';
// import { toast } from 'sonner';

// export type IVibhorPackage = BaseModel & {
//   title?: {
//     en?: string;
//     hi?: string;
//   };
//   feature?: {
//     en?: string;
//     hi?: string;
//   };
//   mrp?: number;
//   salePrice?: number;
//   no_of_types?: 'week' | 'days' | 'month' | 'year';
//   no_of_values?: number;
//   sequence?: number;
//   active?: boolean;
//   discountPercentage?: number;
// };

// const initialState = {
//   vibhorPackageList: {
//     data: [],
//     loading: false,
//     error: null,
//     pagination: {
//       page: 1,
//       pageSize: 10,
//       totalCount: 0
//     }
//   } as PaginationState<IVibhorPackage[]>,
//   singleVibhorPackageState: {
//     data: null,
//     loading: false,
//     error: null
//   } as BaseState<IVibhorPackage | null>
// };

// export const addEditVibhorPackage = createAsyncThunk<
//   any,
//   string | null,
//   { state: RootState }
// >(
//   'vibhorPackage/addEditVibhorPackage',
//   async (entityId, { dispatch, rejectWithValue, getState }) => {
//     try {
//       const {
//         vibhorPackage: {
//           singleVibhorPackageState: { data }
//         }
//       } = getState();

//       dispatch(addEditVibhorPackageStart());

//       if (!data) {
//         return rejectWithValue('Please Provide Details');
//       }

//       let clonedData = cloneDeep(data);

//       if (clonedData) {
//         clonedData = await processNestedFields(clonedData);
//       }

//       const formData = new FormData();
//       const reqData: any = {
//         title: clonedData.title ? JSON.stringify(clonedData.title) : undefined,
//         feature: clonedData.feature
//           ? JSON.stringify(clonedData.feature)
//           : undefined,
//         mrp: clonedData.mrp,
//         salePrice: clonedData.salePrice,
//         no_of_types: clonedData.no_of_types,
//         no_of_values: clonedData.no_of_values,
//         sequence: clonedData.sequence,
//         active: clonedData.active
//       };

//       Object.entries(reqData).forEach(([key, value]) => {
//         if (value !== undefined && value !== null) {
//           formData.append(key, value as string | Blob);
//         }
//       });

//       let response;
//       if (!entityId) {
//         response = await fetchApi('/vibhor/vibhorpackage/create', {
//           method: 'POST',
//           body: formData
//         });
//       } else {
//         response = await fetchApi(`/vibhor/vibhorpackage/update/${entityId}`, {
//           method: 'PUT',
//           body: formData
//         });
//       }

//       if (response?.success) {
//         dispatch(addEditVibhorPackageSuccess());
//         dispatch(fetchVibhorPackageList());
//         toast.success(
//           entityId
//             ? 'Package updated successfully'
//             : 'Package created successfully'
//         );
//         return response;
//       } else {
//         const errorMsg = response?.message ?? 'Something Went Wrong!!';
//         dispatch(addEditVibhorPackageFailure(errorMsg));
//         toast.error(errorMsg);
//         return rejectWithValue(errorMsg);
//       }
//     } catch (error: any) {
//       const errorMsg = error?.message ?? 'Something Went Wrong!!';
//       dispatch(addEditVibhorPackageFailure(errorMsg));
//       toast.error(errorMsg);
//       return rejectWithValue(errorMsg);
//     }
//   }
// );

// export const fetchVibhorPackageList = createAsyncThunk<
//   any,
//   {
//     page?: number;
//     pageSize?: number;
//     keyword?: string;
//     field?: string;
//     active?: string;
//     no_of_types?: string;
//     exportData?: boolean;
//   } | void,
//   { state: RootState }
// >(
//   'vibhorPackage/fetchVibhorPackageList',
//   async (input, { dispatch, rejectWithValue, getState }) => {
//     try {
//       const {
//         page,
//         pageSize,
//         keyword,
//         field,
//         active,
//         no_of_types,
//         exportData
//       } = input || {};
//       dispatch(fetchVibhorPackageListStart());

//       const queryParams = new URLSearchParams({
//         page: (page || 1).toString(),
//         limit: (pageSize || 10).toString(),
//         field: field || '',
//         text: keyword || '',
//         active: active || '',
//         no_of_types: no_of_types || '',
//         exportData: (exportData || false).toString()
//       });

//       const response = await fetchApi(
//         `/vibhor/vibhorpackage/all?${queryParams.toString()}`,
//         { method: 'GET' }
//       );

//       if (response?.success) {
//         if (!input?.exportData) {
//           dispatch(
//             fetchVibhorPackageListSuccess({
//               data: response.vibhorPackage,
//               totalCount: response.totalPackageCount
//             })
//           );
//         } else {
//           dispatch(fetchVibhorPackageExportLoading(false));
//         }

//         return response;
//       } else {
//         throw new Error('No Status Or Invalid Response');
//       }
//     } catch (error: any) {
//       const errorMsg = error?.message ?? 'Something Went Wrong!!';
//       dispatch(fetchVibhorPackageListFailure(errorMsg));
//       return rejectWithValue(errorMsg);
//     }
//   }
// );

// export const fetchSingleVibhorPackage = createAsyncThunk<
//   any,
//   string | null,
//   { state: RootState }
// >(
//   'vibhorPackage/fetchSingleVibhorPackage',
//   async (entityId, { dispatch, rejectWithValue, getState }) => {
//     try {
//       dispatch(fetchSingleVibhorPackageStart());
//       const response = await fetchApi(`/vibhor/vibhorpackage/get/${entityId}`, {
//         method: 'GET'
//       });
//       if (response?.success) {
//         dispatch(fetchSingleVibhorPackageSuccess(response?.vibhorPackage));
//         return response;
//       } else {
//         const errorMsg = response?.message || 'Something Went Wrong';
//         dispatch(fetchSingleVibhorPackageFailure(errorMsg));
//         return rejectWithValue(errorMsg);
//       }
//     } catch (error: any) {
//       const errorMsg = error?.message || 'Something Went Wrong';
//       dispatch(fetchSingleVibhorPackageFailure(errorMsg));
//       return rejectWithValue(errorMsg);
//     }
//   }
// );

// export const deleteVibhorPackage = createAsyncThunk<
//   any,
//   string,
//   { state: RootState }
// >('vibhorPackage/delete', async (id, { dispatch }) => {
//   dispatch(deleteVibhorPackageStart());
//   try {
//     const response = await fetchApi(`/vibhor/vibhorpackage/delete/${id}`, {
//       method: 'DELETE'
//     });
//     if (response.success) {
//       dispatch(deleteVibhorPackageSuccess(id));
//       dispatch(fetchVibhorPackageList());
//       toast.success('Package deleted successfully');
//       return response;
//     } else {
//       const errorMsg = response?.message || 'Something Went Wrong';
//       toast.error(errorMsg);
//       dispatch(deleteVibhorPackageFailure(errorMsg));
//     }
//   } catch (error: any) {
//     dispatch(
//       deleteVibhorPackageFailure(error.message || 'Failed to delete package')
//     );
//     toast.error(error.message);
//   }
// });

// const vibhorPackageSlice = createSlice({
//   name: 'vibhorPackage',
//   initialState,
//   reducers: {
//     setVibhorPackageData(state, action) {
//       state.singleVibhorPackageState.data = action.payload;
//     },
//     updateVibhorPackageData(state, action) {
//       const oldData = state.singleVibhorPackageState.data;
//       const keyFirst = Object.keys(action.payload)[0];

//       if (keyFirst.includes('.')) {
//         const newData = { ...oldData };
//         setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
//         state.singleVibhorPackageState.data = newData;
//       } else {
//         state.singleVibhorPackageState.data = {
//           ...oldData,
//           ...action.payload
//         };
//       }
//     },
//     clearVibhorPackageData(state) {
//       state.singleVibhorPackageState.data = null;
//       state.singleVibhorPackageState.error = null;
//     },
//     addEditVibhorPackageStart(state) {
//       state.singleVibhorPackageState.loading = true;
//       state.singleVibhorPackageState.error = null;
//     },
//     addEditVibhorPackageSuccess(state) {
//       state.singleVibhorPackageState.loading = false;
//       state.singleVibhorPackageState.error = null;
//     },
//     addEditVibhorPackageFailure(state, action) {
//       state.singleVibhorPackageState.loading = false;
//       state.singleVibhorPackageState.error = action.payload;
//     },
//     fetchVibhorPackageListStart(state) {
//       state.vibhorPackageList.loading = true;
//       state.vibhorPackageList.error = null;
//     },
//     fetchVibhorPackageListSuccess(state, action) {
//       state.vibhorPackageList.loading = false;
//       const { data, totalCount } = action.payload;
//       state.vibhorPackageList.data = data;
//       state.vibhorPackageList.pagination.totalCount = totalCount;
//       state.vibhorPackageList.error = null;
//     },
//     fetchVibhorPackageListFailure(state, action) {
//       state.vibhorPackageList.loading = false;
//       state.vibhorPackageList.error = action.payload;
//     },
//     fetchSingleVibhorPackageStart(state) {
//       state.singleVibhorPackageState.loading = true;
//       state.singleVibhorPackageState.error = null;
//     },
//     fetchSingleVibhorPackageFailure(state, action) {
//       state.singleVibhorPackageState.loading = false;
//       state.singleVibhorPackageState.error = action.payload;
//     },
//     fetchSingleVibhorPackageSuccess(state, action) {
//       state.singleVibhorPackageState.loading = false;
//       state.singleVibhorPackageState.data = action.payload;
//       state.singleVibhorPackageState.error = null;
//     },
//     deleteVibhorPackageStart(state) {
//       state.singleVibhorPackageState.loading = true;
//       state.singleVibhorPackageState.error = null;
//     },
//     deleteVibhorPackageSuccess(state, action) {
//       state.singleVibhorPackageState.loading = false;
//       // Remove deleted item from list
//       state.vibhorPackageList.data = state.vibhorPackageList.data.filter(
//         (item: IVibhorPackage) => item._id !== action.payload
//       );
//     },
//     deleteVibhorPackageFailure(state, action) {
//       state.singleVibhorPackageState.loading = false;
//       state.singleVibhorPackageState.error = action.payload;
//     },
//     fetchVibhorPackageExportLoading(state, action) {
//       state.vibhorPackageList.loading = action.payload;
//     },
//     updatePagination(state, action) {
//       state.vibhorPackageList.pagination = {
//         ...state.vibhorPackageList.pagination,
//         ...action.payload
//       };
//     }
//   }
// });

// export const {
//   setVibhorPackageData,
//   updateVibhorPackageData,
//   clearVibhorPackageData,
//   fetchVibhorPackageExportLoading,
//   fetchVibhorPackageListFailure,
//   fetchVibhorPackageListStart,
//   fetchVibhorPackageListSuccess,
//   fetchSingleVibhorPackageFailure,
//   fetchSingleVibhorPackageStart,
//   fetchSingleVibhorPackageSuccess,
//   addEditVibhorPackageFailure,
//   addEditVibhorPackageStart,
//   addEditVibhorPackageSuccess,
//   deleteVibhorPackageStart,
//   deleteVibhorPackageSuccess,
//   deleteVibhorPackageFailure,
//   updatePagination
// } = vibhorPackageSlice.actions;

// export default vibhorPackageSlice.reducer;

import type { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import type { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { processNestedFields } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cloneDeep } from 'lodash';
import { toast } from 'sonner';

export type IVibhorPackage = BaseModel & {
  title?: {
    en?: string;
    hi?: string;
  };
  feature?: {
    en?: string;
    hi?: string;
  };
  mrp?: number;
  salePrice?: number;
  no_of_types?: 'minutes';
  no_of_values?: number;
  sequence?: number;
  active?: boolean;
  discountPercentage?: number;
};

const initialState = {
  vibhorPackageList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IVibhorPackage[]>,
  singleVibhorPackageState: {
    data: null,
    loading: false,
    error: null
  } as BaseState<IVibhorPackage | null>
};

export const addEditVibhorPackage = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'vibhorPackage/addEditVibhorPackage',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        vibhorPackage: {
          singleVibhorPackageState: { data }
        }
      } = getState();

      dispatch(addEditVibhorPackageStart());

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
        feature: clonedData.feature
          ? JSON.stringify(clonedData.feature)
          : undefined,
        mrp: clonedData.mrp,
        salePrice: clonedData.salePrice,
        no_of_types: clonedData.no_of_types,
        no_of_values: clonedData.no_of_values,
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
        response = await fetchApi('/vibhor/vibhorpackage/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/vibhor/vibhorpackage/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }

      if (response?.success) {
        dispatch(addEditVibhorPackageSuccess());
        dispatch(fetchVibhorPackageList());
        toast.success(
          entityId
            ? 'Package updated successfully'
            : 'Package created successfully'
        );
        return response;
      } else {
        const errorMsg = response?.message ?? 'Something Went Wrong!!';
        dispatch(addEditVibhorPackageFailure(errorMsg));
        toast.error(errorMsg);
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditVibhorPackageFailure(errorMsg));
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchVibhorPackageList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field?: string;
    active?: string;
    no_of_types?: string;
    exportData?: boolean;
  } | void,
  { state: RootState }
>(
  'vibhorPackage/fetchVibhorPackageList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        page,
        pageSize,
        keyword,
        field,
        active,
        no_of_types,
        exportData
      } = input || {};
      dispatch(fetchVibhorPackageListStart());

      const queryParams = new URLSearchParams({
        page: (page || 1).toString(),
        limit: (pageSize || 10).toString(),
        field: field || '',
        text: keyword || '',
        active: active || '',
        no_of_types: no_of_types || '',
        exportData: (exportData || false).toString()
      });

      const response = await fetchApi(
        `/vibhor/vibhorpackage/all?${queryParams.toString()}`,
        { method: 'GET' }
      );

      if (response?.success) {
        if (!input?.exportData) {
          dispatch(
            fetchVibhorPackageListSuccess({
              data: response.vibhorPackage,
              totalCount: response.totalPackageCount
            })
          );
        } else {
          dispatch(fetchVibhorPackageExportLoading(false));
        }

        return response;
      } else {
        throw new Error('No Status Or Invalid Response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchVibhorPackageListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchSingleVibhorPackage = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'vibhorPackage/fetchSingleVibhorPackage',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleVibhorPackageStart());
      const response = await fetchApi(`/vibhor/vibhorpackage/get/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleVibhorPackageSuccess(response?.vibhorPackage));
        return response;
      } else {
        const errorMsg = response?.message || 'Something Went Wrong';
        dispatch(fetchSingleVibhorPackageFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleVibhorPackageFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteVibhorPackage = createAsyncThunk<
  any,
  string,
  { state: RootState }
>('vibhorPackage/delete', async (id, { dispatch }) => {
  dispatch(deleteVibhorPackageStart());
  try {
    const response = await fetchApi(`/vibhor/vibhorpackage/delete/${id}`, {
      method: 'DELETE'
    });
    if (response.success) {
      dispatch(deleteVibhorPackageSuccess(id));
      dispatch(fetchVibhorPackageList());
      toast.success('Package deleted successfully');
      return response;
    } else {
      const errorMsg = response?.message || 'Something Went Wrong';
      toast.error(errorMsg);
      dispatch(deleteVibhorPackageFailure(errorMsg));
    }
  } catch (error: any) {
    dispatch(
      deleteVibhorPackageFailure(error.message || 'Failed to delete package')
    );
    toast.error(error.message);
  }
});

const vibhorPackageSlice = createSlice({
  name: 'vibhorPackage',
  initialState,
  reducers: {
    setVibhorPackageData(state, action) {
      state.singleVibhorPackageState.data = action.payload;
    },
    updateVibhorPackageData(state, action) {
      const oldData = state.singleVibhorPackageState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleVibhorPackageState.data = newData;
      } else {
        state.singleVibhorPackageState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    clearVibhorPackageData(state) {
      state.singleVibhorPackageState.data = null;
      state.singleVibhorPackageState.error = null;
    },
    addEditVibhorPackageStart(state) {
      state.singleVibhorPackageState.loading = true;
      state.singleVibhorPackageState.error = null;
    },
    addEditVibhorPackageSuccess(state) {
      state.singleVibhorPackageState.loading = false;
      state.singleVibhorPackageState.error = null;
    },
    addEditVibhorPackageFailure(state, action) {
      state.singleVibhorPackageState.loading = false;
      state.singleVibhorPackageState.error = action.payload;
    },
    fetchVibhorPackageListStart(state) {
      state.vibhorPackageList.loading = true;
      state.vibhorPackageList.error = null;
    },
    fetchVibhorPackageListSuccess(state, action) {
      state.vibhorPackageList.loading = false;
      const { data, totalCount } = action.payload;
      state.vibhorPackageList.data = data;
      state.vibhorPackageList.pagination.totalCount = totalCount;
      state.vibhorPackageList.error = null;
    },
    fetchVibhorPackageListFailure(state, action) {
      state.vibhorPackageList.loading = false;
      state.vibhorPackageList.error = action.payload;
    },
    fetchSingleVibhorPackageStart(state) {
      state.singleVibhorPackageState.loading = true;
      state.singleVibhorPackageState.error = null;
    },
    fetchSingleVibhorPackageFailure(state, action) {
      state.singleVibhorPackageState.loading = false;
      state.singleVibhorPackageState.error = action.payload;
    },
    fetchSingleVibhorPackageSuccess(state, action) {
      state.singleVibhorPackageState.loading = false;
      state.singleVibhorPackageState.data = action.payload;
      state.singleVibhorPackageState.error = null;
    },
    deleteVibhorPackageStart(state) {
      state.singleVibhorPackageState.loading = true;
      state.singleVibhorPackageState.error = null;
    },
    deleteVibhorPackageSuccess(state, action) {
      state.singleVibhorPackageState.loading = false;
      // Remove deleted item from list
      state.vibhorPackageList.data = state.vibhorPackageList.data.filter(
        (item: IVibhorPackage) => item._id !== action.payload
      );
    },
    deleteVibhorPackageFailure(state, action) {
      state.singleVibhorPackageState.loading = false;
      state.singleVibhorPackageState.error = action.payload;
    },
    fetchVibhorPackageExportLoading(state, action) {
      state.vibhorPackageList.loading = action.payload;
    },
    updatePagination(state, action) {
      state.vibhorPackageList.pagination = {
        ...state.vibhorPackageList.pagination,
        ...action.payload
      };
    }
  }
});

export const {
  setVibhorPackageData,
  updateVibhorPackageData,
  clearVibhorPackageData,
  fetchVibhorPackageExportLoading,
  fetchVibhorPackageListFailure,
  fetchVibhorPackageListStart,
  fetchVibhorPackageListSuccess,
  fetchSingleVibhorPackageFailure,
  fetchSingleVibhorPackageStart,
  fetchSingleVibhorPackageSuccess,
  addEditVibhorPackageFailure,
  addEditVibhorPackageStart,
  addEditVibhorPackageSuccess,
  deleteVibhorPackageStart,
  deleteVibhorPackageSuccess,
  deleteVibhorPackageFailure,
  updatePagination
} = vibhorPackageSlice.actions;

export default vibhorPackageSlice.reducer;
