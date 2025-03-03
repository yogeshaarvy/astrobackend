import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';

export type ICities = BaseModel & {
  id?: string;
  name?: string;
  state_id?: string;
  state_code?: string;
  country_id?: string;
  country_code?: string;
  latitude?: string;
  longitude?: string;
  flag?: string;
  wikiDataId?: string;
};

const initialState = {
  CitiesListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<ICities[]>,
  singleCitiesState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ICities | null>,
  currentCitiesState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ICities | null>,
  changeCitiesPassword: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ICities | null>
};

export const fetchCitiesList = createAsyncThunk<
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
  'Cities/fetchCitiesList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize, keyword, field, exportData } = input || {};

      dispatch(fetchCitiesStart());
      const response = await fetchApi(
        `/Cities/all?page=${page || 1}&limit=${pageSize || 10}&text=${
          keyword || ''
        }&field=${field || ''}&export=${exportData}`,
        { method: 'GET' }
      );
      // Check if the API response is valid and has the expected data
      if (response?.success) {
        dispatch(
          fetchCitiesListSuccess({
            data: response.allCitiesList,
            totalCount: response.totalCount
          })
        );
      } else {
        // Handle response with no status or an error
        throw new Error('No status or invalid response');
      }
      return response;
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(fetchCitiesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const addEditCities = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  '/cities/createcity',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        Citiesdata: {
          singleCitiesState: { data }
        }
      } = getState();

      dispatch(addEditCitiesStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      const formData = new FormData();
      const reqData: any = {
        id: data.id,
        active: data.active,
        name: data.name,
        state_id: data.state_id,
        state_code: data.state_code,
        country_id: data.country_id,
        country_code: data.country_code,
        longitude: data.longitude,
        latitude: data.latitude,
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
        response = await fetchApi('/cities/createcity', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/cities/updatecity/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }
      if (response?.success) {
        dispatch(addEditCitiesSuccess());
        dispatch(fetchCitiesList());
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
        dispatch(addEditCitiesFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditCitiesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const fetchSingleCities = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('/cities/all', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    dispatch(fetchSingleCitiesStart());
    const response = await fetchApi(`/Cities/get/${entityId}`, {
      method: 'GET'
    });
    if (response?.success) {
      dispatch(fetchSingleCitiesSuccess(response?.Citiesdata));
      return response;
    } else {
      let errorMsg = response?.data?.message || 'Something Went Wrong';
      dispatch(fetchSingleCitiesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    let errorMsg = error?.message || 'Something Went Wrong';
    dispatch(fetchSingleCitiesFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

export const deleteCities = createAsyncThunk<any, string, { state: RootState }>(
  'Cities/delete',
  async (id, { dispatch }) => {
    dispatch(deleteCitiesStart());
    try {
      const response = await fetchApi(`/Cities/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        dispatch(deleteCitiesSuccess(id));
        dispatch(fetchCitiesList());
        toast.success('Cities deleted successfuly');
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        toast.error(errorMsg);
        dispatch(deleteCitiesFailure(errorMsg));
      }
    } catch (error: any) {
      dispatch(deleteCitiesFailure(error.message || 'Failed to delete Cities'));
      toast.error(error.message);
    }
  }
);

const CitiesSlice = createSlice({
  name: 'Cities',
  initialState,
  reducers: {
    fetchCitiesStart(state) {
      state.CitiesListState.loading = true;
      state.CitiesListState.error = null;
    },
    fetchCitiesListSuccess(state, action) {
      state.CitiesListState.loading = false;
      const { data, totalCount } = action.payload;
      state.CitiesListState.data = data;
      state.CitiesListState.pagination.totalCount = totalCount;
      state.CitiesListState.error = null;
    },
    fetchCitiesFailure(state, action) {
      state.CitiesListState.loading = false;
      state.CitiesListState.error = action.payload;
    },
    setCitiesData(state, action) {
      state.singleCitiesState.data = action.payload;
    },
    updateCitiesData(state, action) {
      const oldData = state.singleCitiesState.data;
      state.singleCitiesState.data = { ...oldData, ...action.payload };
    },
    addEditCitiesStart(state) {
      state.singleCitiesState.loading = true;
      state.singleCitiesState.error = null;
    },
    addEditCitiesSuccess(state) {
      state.singleCitiesState.loading = false;
      state.singleCitiesState.error = null;
    },
    addEditCitiesFailure(state, action) {
      state.singleCitiesState.loading = false;
      state.singleCitiesState.error = action.payload;
    },
    fetchSingleCitiesStart(state) {
      state.singleCitiesState.loading = true;
      state.singleCitiesState.error = null;
    },
    fetchSingleCitiesSuccess(state, action) {
      state.singleCitiesState.loading = false;
      state.singleCitiesState.data = action.payload;
      state.singleCitiesState.error = null;
    },
    fetchSingleCitiesFailure(state, action) {
      state.singleCitiesState.loading = false;
      state.singleCitiesState.error = action.payload;
    },
    deleteCitiesStart(state) {
      state.singleCitiesState.loading = true;
      state.singleCitiesState.error = null;
    },
    deleteCitiesSuccess(state, action) {
      state.singleCitiesState.loading = false;
    },
    deleteCitiesFailure(state, action) {
      state.singleCitiesState.loading = false;
      state.singleCitiesState.error = action.payload;
    }
  }
});

export const {
  fetchCitiesStart,
  fetchCitiesListSuccess,
  fetchCitiesFailure,
  addEditCitiesStart,
  addEditCitiesSuccess,
  addEditCitiesFailure,
  setCitiesData,
  updateCitiesData,
  fetchSingleCitiesStart,
  fetchSingleCitiesSuccess,
  fetchSingleCitiesFailure,
  deleteCitiesStart,
  deleteCitiesFailure,
  deleteCitiesSuccess
} = CitiesSlice.actions;

export default CitiesSlice.reducer;
