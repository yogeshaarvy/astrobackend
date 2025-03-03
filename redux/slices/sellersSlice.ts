import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';

export type ISeller = BaseModel & {
    _id?: string;
    name?: string;
    active?: boolean;
};

const initialState = {
    sellerListState: {
        data: [],
        loading: false,
        error: null,
        pagination: {
            page: 1,
            pageSize: 10,
            totalCount: 0
        }
    } as PaginationState<ISeller[]>,
    singleSellerState: {
        data: null,
        loading: null,
        error: null
    } as BaseState<ISeller | null>,
    currentSellerState: {
        data: null,
        loading: null,
        error: null
    } as BaseState<ISeller | null>,
    changeSellerPassword: {
        data: null,
        loading: null,
        error: null
    } as BaseState<ISeller | null>
};

export const fetchSellerList = createAsyncThunk<
    any,
    {
        page?: number;
        pageSize?: number;
        keyword?: string;
        field: string;
        status: string;
        exportData: string;
    } | void,
    { state: RootState }
>(
    'seller/fetchSellerList',
    async (input, { dispatch, rejectWithValue, getState }) => {
        try {
            const { page, pageSize, keyword, field, status, exportData } =
                input || {};

            dispatch(fetchSellerStart());
            const response = await fetchApi(
                `/sellers/all?page=${page || 1}&limit=${pageSize || 10}&text=${keyword || ''
                }&field=${field || ''}&active=${status || ''}&export=${exportData}`,
                { method: 'GET' }
            );
            // Check if the API response is valid and has the expected data
            if (response?.success) {
                dispatch(
                    fetchSellerListSuccess({
                        data: response.SellersData,
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
            dispatch(fetchSellerFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);
export const addEditSeller = createAsyncThunk<
    any,
    string | null,
    { state: RootState }
>('seller/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
        const {
            sellers: {
                singleSellerState: { data }
            }
        } = getState();

        dispatch(addEditSellerStart());

        if (!data) {
            return rejectWithValue('Please Provide Details');
        }

        const formData = new FormData();
        const reqData: any = {
            name: data.name,
            active: data.active
        };
        // Append only defined fields to FormData
        Object.entries(reqData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value as string | Blob);
            }
        });

        let response;
        if (!entityId) {
            response = await fetchApi('/sellers/new', {
                method: 'POST',
                body: formData
            });
        } else {
            response = await fetchApi(`/sellers/update/${entityId}`, {
                method: 'PUT',
                body: formData
            });
        }
        if (response?.success) {
            dispatch(addEditSellerSuccess());
            dispatch(fetchSellerList());
            return response;
        } else {
            const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
            dispatch(addEditSellerFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    } catch (error: any) {
        const errorMsg = error?.message ?? 'Something Went Wrong!!';
        dispatch(addEditSellerFailure(errorMsg));
        return rejectWithValue(errorMsg);
    }
});
export const fetchSingleSeller = createAsyncThunk<
    any,
    string | null,
    { state: RootState }
>(
    'sellers/getsingleseller',
    async (entityId, { dispatch, rejectWithValue, getState }) => {
        try {
            dispatch(fetchSingleSellerStart());
            const response = await fetchApi(`/sellers/single/${entityId}`, {
                method: 'GET'
            });
            if (response?.success) {
                dispatch(fetchSingleSellerSuccess(response?.sellerdata));
                return response;
            } else {
                let errorMsg = response?.data?.message || 'Something Went Wrong';
                dispatch(fetchSingleSellerFailure(errorMsg));
                return rejectWithValue(errorMsg);
            }
        } catch (error: any) {
            let errorMsg = error?.message || 'Something Went Wrong';
            dispatch(fetchSingleSellerFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);

export const deleteSeller = createAsyncThunk<any, string, { state: RootState }>(
    'seller/delete',
    async (id, { dispatch }) => {
        dispatch(deleteSellerStart());
        try {
            const response = await fetchApi(`/sellers/delete/${id}`, {
                method: 'DELETE'
            });
            if (response.success) {
                dispatch(deleteSellerSuccess(id));
                dispatch(fetchSellerList());
                toast.success('Seller deleted successfuly');
                return response;
            } else {
                let errorMsg = response?.data?.message || 'Something Went Wrong';
                toast.error(errorMsg);
                dispatch(deleteSellerFailure(errorMsg));
            }
        } catch (error: any) {
            dispatch(deleteSellerFailure(error.message || 'Failed to delete seller'));
            toast.error(error.message);
        }
    }
);

const sellerSlice = createSlice({
    name: 'sellers',
    initialState,
    reducers: {
        fetchSellerStart(state) {
            state.sellerListState.loading = true;
            state.sellerListState.error = null;
        },
        fetchSellerListSuccess(state, action) {
            state.sellerListState.loading = false;
            const { data, totalCount } = action.payload;
            state.sellerListState.data = data;
            state.sellerListState.pagination.totalCount = totalCount;
            state.sellerListState.error = null;
        },
        fetchSellerFailure(state, action) {
            state.sellerListState.loading = false;
            state.sellerListState.error = action.payload;
        },
        setSellerData(state, action) {
            state.singleSellerState.data = action.payload;
        },
        updateSellerData(state, action) {
            const oldData = state.singleSellerState.data;
            state.singleSellerState.data = { ...oldData, ...action.payload };
        },
        addEditSellerStart(state) {
            state.singleSellerState.loading = true;
            state.singleSellerState.error = null;
        },
        addEditSellerSuccess(state) {
            state.singleSellerState.loading = false;
            state.singleSellerState.error = null;
        },
        addEditSellerFailure(state, action) {
            state.singleSellerState.loading = false;
            state.singleSellerState.error = action.payload;
        },
        fetchSingleSellerStart(state) {
            state.singleSellerState.loading = true;
            state.singleSellerState.error = null;
        },
        fetchSingleSellerSuccess(state, action) {
            state.singleSellerState.loading = false;
            state.singleSellerState.data = action.payload;
            state.singleSellerState.error = null;
        },
        fetchSingleSellerFailure(state, action) {
            state.singleSellerState.loading = false;
            state.singleSellerState.error = action.payload;
        },
        deleteSellerStart(state) {
            state.singleSellerState.loading = true;
            state.singleSellerState.error = null;
        },
        deleteSellerSuccess(state, action) {
            state.singleSellerState.loading = false;
        },
        deleteSellerFailure(state, action) {
            state.singleSellerState.loading = false;
            state.singleSellerState.error = action.payload;
        }
    }
});

export const {
    fetchSellerStart,
    fetchSellerListSuccess,
    fetchSellerFailure,
    addEditSellerStart,
    addEditSellerSuccess,
    addEditSellerFailure,
    setSellerData,
    updateSellerData,
    fetchSingleSellerStart,
    fetchSingleSellerSuccess,
    fetchSingleSellerFailure,
    deleteSellerStart,
    deleteSellerFailure,
    deleteSellerSuccess
} = sellerSlice.actions;

export default sellerSlice.reducer;
