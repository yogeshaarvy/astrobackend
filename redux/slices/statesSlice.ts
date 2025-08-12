import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';

export type IState = BaseModel & {
  id?: string;
  name?: string;
  iso2?: string;
  country_id?: string;
  country_code?: string;
  fips_code?: string;
  flag?: string;
  wikiDataId?: string;
};

const initialState = {
  StateListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IState[]>,
  singleStateState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IState | null>,
  currentStateState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IState | null>,
  changeStatePassword: {
    data: null,
    loading: null,
    error: null
  } as BaseState<IState | null>
};

export const fetchStateList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field: string;
    // status: string;
    exportData: string;
  } | void,
  { state: RootState }
>(
  'State/fetchStateList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, exportData } = input || {};

      dispatch(fetchStateStart());
      const response = await fetchApi(
        `/state/all?page=${page || 1}&limit=${pageSize || 10}&text=${
          keyword || ''
        }&field=${field || ''}&export=${exportData}`,
        { method: 'GET' }
      );
      // Check if the API response is valid and has the expected data
      if (response?.success) {
        dispatch(
          fetchStateListSuccess({
            data: response.allStateList,
            totalCount: response.totalCount
          })
        );
      } else {
        // Handle response with no Stateus or an error
        throw new Error('No Stateus or invalid response');
      }
      return response;
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchStateFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const addEditState = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('state/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      statesdata: {
        singleStateState: { data }
      }
    } = getState();

    dispatch(addEditStateStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    const formData = new FormData();
    const reqData: any = {
      id: data.id,
      name: data.name,
      active: data.active,
      iso2: data.iso2,
      country_id: data.country_id,
      country_code: data.country_code,
      fips_code: data.fips_code,
      flag: data.flag,
      wikiDataId: data.wikiDataId
    };
    // Append only defined fields to FormData
    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    let response;
    if (!entityId) {
      response = await fetchApi('/state/create', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/state/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }
    if (response?.success) {
      dispatch(addEditStateSeuccess());
      dispatch(fetchStateList());
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
      dispatch(addEditStateFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditStateFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});
export const fetchSingleState = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'State/getsingleState',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleStateStart());
      const response = await fetchApi(`/state/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleStateSeuccess(response?.state));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleStateFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleStateFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteState = createAsyncThunk<any, string, { state: RootState }>(
  'State/delete',
  async (id, { dispatch }) => {
    dispatch(deleteStateStart());
    try {
      const response = await fetchApi(`/State/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        dispatch(deleteStateSeuccess(id));
        dispatch(fetchStateList());
        toast.success('State deleted successfuly');
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        toast.error(errorMsg);
        dispatch(deleteStateFailure(errorMsg));
      }
    } catch (error: any) {
      dispatch(deleteStateFailure(error.message || 'Failed to delete State'));
      toast.error(error.message);
    }
  }
);

const Statelice = createSlice({
  name: 'State',
  initialState,
  reducers: {
    fetchStateStart(State) {
      State.StateListState.loading = true;
      State.StateListState.error = null;
    },
    fetchStateListSuccess(State, action) {
      State.StateListState.loading = false;
      const { data, totalCount } = action.payload;
      State.StateListState.data = data;
      State.StateListState.pagination.totalCount = totalCount;
      State.StateListState.error = null;
    },
    fetchStateFailure(State, action) {
      State.StateListState.loading = false;
      State.StateListState.error = action.payload;
    },
    setStateData(State, action) {
      State.singleStateState.data = action.payload;
    },
    updateStateData(State, action) {
      const oldData = State.singleStateState.data;
      State.singleStateState.data = { ...oldData, ...action.payload };
    },
    addEditStateStart(State) {
      State.singleStateState.loading = true;
      State.singleStateState.error = null;
    },
    addEditStateSeuccess(State) {
      State.singleStateState.loading = false;
      State.singleStateState.error = null;
    },
    addEditStateFailure(State, action) {
      State.singleStateState.loading = false;
      State.singleStateState.error = action.payload;
    },
    fetchSingleStateStart(State) {
      State.singleStateState.loading = true;
      State.singleStateState.error = null;
    },
    fetchSingleStateSeuccess(State, action) {
      State.singleStateState.loading = false;
      State.singleStateState.data = action.payload;
      State.singleStateState.error = null;
    },
    fetchSingleStateFailure(State, action) {
      State.singleStateState.loading = false;
      State.singleStateState.error = action.payload;
    },
    deleteStateStart(State) {
      State.singleStateState.loading = true;
      State.singleStateState.error = null;
    },
    deleteStateSeuccess(State, action) {
      State.singleStateState.loading = false;
    },
    deleteStateFailure(State, action) {
      State.singleStateState.loading = false;
      State.singleStateState.error = action.payload;
    }
  }
});

export const {
  fetchStateStart,
  fetchStateListSuccess,
  fetchStateFailure,
  addEditStateStart,
  addEditStateSeuccess,
  addEditStateFailure,
  setStateData,
  updateStateData,
  fetchSingleStateStart,
  fetchSingleStateSeuccess,
  fetchSingleStateFailure,
  deleteStateStart,
  deleteStateFailure,
  deleteStateSeuccess
} = Statelice.actions;

export default Statelice.reducer;
