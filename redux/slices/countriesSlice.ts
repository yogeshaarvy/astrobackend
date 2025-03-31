import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';

export type ICountries = BaseModel & {
  id?: string;
  name?: string;
  iso3?: string;
  iso2?: string;
  phonecode?: string;
  capital?: string;
  currency?: string;
  native?: string;
  emoji?: string;
  emojiU?: string;
  flag?: string;
  wikiDataId?: string;
};

const initialState = {
  countriesListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<ICountries[]>,
  singleCountriesState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ICountries | null>,
  currentCountriesState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ICountries | null>,
  changeTypesPassword: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ICountries | null>
};

export const fetchCountriesList = createAsyncThunk<
  any,
  {
    page?: number;
    pageSize?: number;
    keyword?: string;
    field?: string;
    status?: string;
    exportData?: string;
  } | void,
  { state: RootState }
>('/countries/all', async (input, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      page,
      pageSize,
      keyword,
      field,
      status,
      exportData = false
    } = input || {};

    dispatch(fetchCountriesStart());
    const response = await fetchApi(
      `/store/country/all?page=${page || 1}&pageSize=${pageSize || 10}&text=${
        keyword || ''
      }&field=${field || ''}&active=${status || ''}&export=${exportData}`,
      { method: 'GET' }
    );
    // Check if the API response is valid and has the expected data
    if (response?.success) {
      dispatch(
        fetchTypesListSuccess({
          data: response.allCountryList,
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
    dispatch(fetchTypesFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});
export const addEditCountries = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'countries/add',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    {
    }
    try {
      const {
        countries: {
          singleCountriesState: { data }
        }
      } = getState();

      dispatch(addEditCountriesStart());

      if (!data) {
        return rejectWithValue('Please Provide Details');
      }

      const formData = new FormData();
      const reqData: any = {
        name: data.name,
        iso3: data.iso3,
        iso2: data.iso2,
        currency: data.currency,
        capital: data.capital,
        phonecode: data.phonecode,
        native: data.native
      };
      // Append only defined fields to FormData
      Object.entries(reqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      });

      let response;
      if (!entityId) {
        response = await fetchApi('/store/country/create', {
          method: 'POST',
          body: formData
        });
      } else {
        response = await fetchApi(`/store/country/update/${entityId}`, {
          method: 'PUT',
          body: formData
        });
      }
      if (response?.success) {
        dispatch(addEditCountriesSuccess());
        dispatch(fetchCountriesList());
        return response;
      } else {
        const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
        dispatch(addEditCountriesFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something Went Wrong!!';
      dispatch(addEditCountriesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);
export const fetchSingleCountries = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>(
  'types/getsinglecountry',
  async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(fetchSingleTypesStart());
      const response = await fetchApi(`/filtertypes/single/${entityId}`, {
        method: 'GET'
      });
      if (response?.success) {
        dispatch(fetchSingleTypesSuccess(response?.filterTypesdata));
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        dispatch(fetchSingleTypesFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      let errorMsg = error?.message || 'Something Went Wrong';
      dispatch(fetchSingleTypesFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteTypes = createAsyncThunk<any, string, { state: RootState }>(
  'types/delete',
  async (id, { dispatch }) => {
    dispatch(deleteTypesStart());
    try {
      const response = await fetchApi(`/filtertypes/delete/${id}`, {
        method: 'DELETE'
      });
      if (response.success) {
        dispatch(deleteTypesSuccess(id));
        dispatch(fetchCountriesList());
        toast.success('Types deleted successfuly');
        return response;
      } else {
        let errorMsg = response?.data?.message || 'Something Went Wrong';
        toast.error(errorMsg);
        dispatch(deleteTypesFailure(errorMsg));
      }
    } catch (error: any) {
      dispatch(deleteTypesFailure(error.message || 'Failed to delete types'));
      toast.error(error.message);
    }
  }
);

const countriesSlice = createSlice({
  name: 'contries',
  initialState,
  reducers: {
    fetchCountriesStart(state) {
      state.countriesListState.loading = true;
      state.countriesListState.error = null;
    },
    fetchTypesListSuccess(state, action) {
      state.countriesListState.loading = false;
      const { data, totalCount } = action.payload;
      state.countriesListState.data = data;
      state.countriesListState.pagination.totalCount = totalCount;
      state.countriesListState.error = null;
    },
    fetchTypesFailure(state, action) {
      state.countriesListState.loading = false;
      state.countriesListState.error = action.payload;
    },
    setTypesData(state, action) {
      state.singleCountriesState.data = action.payload;
    },
    updateCountriesData(state, action) {
      const oldData = state.singleCountriesState.data;
      state.singleCountriesState.data = { ...oldData, ...action.payload };
    },
    addEditCountriesStart(state) {
      state.singleCountriesState.loading = true;
      state.singleCountriesState.error = null;
    },
    addEditCountriesSuccess(state) {
      state.singleCountriesState.loading = false;
      state.singleCountriesState.error = null;
    },
    addEditCountriesFailure(state, action) {
      state.singleCountriesState.loading = false;
      state.singleCountriesState.error = action.payload;
    },
    fetchSingleTypesStart(state) {
      state.singleCountriesState.loading = true;
      state.singleCountriesState.error = null;
    },
    fetchSingleTypesSuccess(state, action) {
      state.singleCountriesState.loading = false;
      state.singleCountriesState.data = action.payload;
      state.singleCountriesState.error = null;
    },
    fetchSingleTypesFailure(state, action) {
      state.singleCountriesState.loading = false;
      state.singleCountriesState.error = action.payload;
    },
    deleteTypesStart(state) {
      state.singleCountriesState.loading = true;
      state.singleCountriesState.error = null;
    },
    deleteTypesSuccess(state, action) {
      state.singleCountriesState.loading = false;
    },
    deleteTypesFailure(state, action) {
      state.singleCountriesState.loading = false;
      state.singleCountriesState.error = action.payload;
    }
  }
});

export const {
  fetchCountriesStart,
  fetchTypesListSuccess,
  fetchTypesFailure,
  addEditCountriesStart,
  addEditCountriesSuccess,
  addEditCountriesFailure,
  setTypesData,
  updateCountriesData,
  fetchSingleTypesStart,
  fetchSingleTypesSuccess,
  fetchSingleTypesFailure,
  deleteTypesStart,
  deleteTypesFailure,
  deleteTypesSuccess
} = countriesSlice.actions;

export default countriesSlice.reducer;
