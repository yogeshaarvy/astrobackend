import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';

export type IPromoCode = BaseModel & {
    _id?: string;
    promocode?: string;
    minamount?: number;
    maxamount?: number
    promocodetype?: string;
    promocodevalue?: number;
    upto?: number;
    status?: boolean
    startdate?: string;
    enddate?: string;
    minnooftotaluses?: string;
    nooflimit1?: number;
    noofperuser?: string;
    nooflimit2?: number;
    users?: string;
    multipleusers?: any
};

const initialState = {
    promoCodeListState: {
        data: [],
        loading: false,
        error: null,
        pagination: {
            page: 1,
            pageSize: 10,
            totalCount: 0
        }
    } as PaginationState<IPromoCode[]>,
    singlePromoCodeState: {
        data: null,
        loading: null,
        error: null
    } as BaseState<IPromoCode | null>,
    currentPromoCodeState: {
        data: null,
        loading: null,
        error: null
    } as BaseState<IPromoCode | null>,
    changePromoCodePassword: {
        data: null,
        loading: null,
        error: null
    } as BaseState<IPromoCode | null>
};

export const fetchPromoCodeList = createAsyncThunk<
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
    'promoCode/fetchPromoCodeList',
    async (input, { dispatch, rejectWithValue, getState }) => {
        try {
            const { page, pageSize, keyword, field, status, exportData } =
                input || {};

            dispatch(fetchPromoCodeStart());
            const response = await fetchApi(
                `/promo/getpromos?page=${page || 1}&limit=${pageSize || 10}&text=${keyword || ''
                }&field=${field || ''}&active=${status || ''}&export=${exportData || ''}`,
                { method: 'GET' }
            );
            // Check if the API response is valid and has the expected data
            if (response?.success) {
                dispatch(
                    fetchPromoCodeListSuccess({
                        data: response.allPromoCodes,
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
            dispatch(fetchPromoCodeFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);
export const addEditPromoCode = createAsyncThunk<
    any,
    string | null,
    { state: RootState }
>('promoCode/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
        const {
            promoCodesdata: {
                singlePromoCodeState: { data }
            }
        } = getState();

        dispatch(addEditPromoCodeStart());

        if (!data) {
            return rejectWithValue('Please Provide Details');
        }
        const formData = new FormData();
        const reqData: any = {
            promocode: data.promocode,
            minamount: data.minamount,
            maxamount: data.maxamount,
            promocodetype: data.promocodetype,
            promocodevalue: data.promocodevalue,
            upto: data.upto,
            status: data.status,
            startdate: data.startdate,
            enddate: data.enddate,
            minnooftotaluses: data.minnooftotaluses,
            nooflimit1: data.nooflimit1,
            noofperuser: data.noofperuser,
            nooflimit2: data.nooflimit2,
            users: data.users,
            multipleusers: data.multipleusers,
        };
        // Append only defined fields to FormData
        Object.entries(reqData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value as string | Blob);
            }
        });

        let response;
        if (!entityId) {
            response = await fetchApi('/promo/new', {
                method: 'POST',
                body: formData
            });
        } else {
            response = await fetchApi(`/promo/update_promo/${entityId}`, {
                method: 'PUT',
                body: formData
            });
        }
        if (response?.success) {
            dispatch(addEditPromoCodeSuccess());
            dispatch(fetchPromoCodeList());
            return response;
        } else {
            const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
            dispatch(addEditPromoCodeFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    } catch (error: any) {
        const errorMsg = error?.message ?? 'Something Went Wrong!!';
        dispatch(addEditPromoCodeFailure(errorMsg));
        return rejectWithValue(errorMsg);
    }
});
export const fetchSinglePromoCode = createAsyncThunk<
    any,
    string | null,
    { state: RootState }
>('/promoCodes/all', async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
        dispatch(fetchSinglePromoCodeStart());
        const response = await fetchApi(`/promo/single/${entityId}`, {
            method: 'GET'
        });
        if (response?.success) {
            dispatch(fetchSinglePromoCodeSuccess(response?.promocode));
            return response;
        } else {
            let errorMsg = response?.data?.message || 'Something Went Wrong';
            dispatch(fetchSinglePromoCodeFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    } catch (error: any) {
        let errorMsg = error?.message || 'Something Went Wrong';
        dispatch(fetchSinglePromoCodeFailure(errorMsg));
        return rejectWithValue(errorMsg);
    }
});

export const deletePromoCode = createAsyncThunk<any, string, { state: RootState }>(
    'promoCode/delete',
    async (id, { dispatch }) => {
        dispatch(deletePromoCodeStart());
        try {
            const response = await fetchApi(`/promo/delete/${id}`, {
                method: 'DELETE'
            });
            if (response.success) {
                dispatch(deletePromoCodeSuccess(id));
                dispatch(fetchPromoCodeList());
                toast.success('PromoCode deleted successfuly');
                return response;
            } else {
                let errorMsg = response?.data?.message || 'Something Went Wrong';
                toast.error(errorMsg);
                dispatch(deletePromoCodeFailure(errorMsg));
            }
        } catch (error: any) {
            dispatch(deletePromoCodeFailure(error.message || 'Failed to delete promoCode'));
            toast.error(error.message);
        }
    }
);

const promoCodeSlice = createSlice({
    name: 'promoCodes',
    initialState,
    reducers: {
        fetchPromoCodeStart(state) {
            state.promoCodeListState.loading = true;
            state.promoCodeListState.error = null;
        },
        fetchPromoCodeListSuccess(state, action) {
            state.promoCodeListState.loading = false;
            const { data, totalCount } = action.payload;
            state.promoCodeListState.data = data;
            state.promoCodeListState.pagination.totalCount = totalCount;
            state.promoCodeListState.error = null;
        },
        fetchPromoCodeFailure(state, action) {
            state.promoCodeListState.loading = false;
            state.promoCodeListState.error = action.payload;
        },
        setPromoCodeData(state, action) {
            state.singlePromoCodeState.data = action.payload;
        },
        updatePromoCodeData(state, action) {
            const oldData = state.singlePromoCodeState.data;
            state.singlePromoCodeState.data = { ...oldData, ...action.payload };
        },
        addEditPromoCodeStart(state) {
            state.singlePromoCodeState.loading = true;
            state.singlePromoCodeState.error = null;
        },
        addEditPromoCodeSuccess(state) {
            state.singlePromoCodeState.loading = false;
            state.singlePromoCodeState.error = null;
        },
        addEditPromoCodeFailure(state, action) {
            state.singlePromoCodeState.loading = false;
            state.singlePromoCodeState.error = action.payload;
        },
        fetchSinglePromoCodeStart(state) {
            state.singlePromoCodeState.loading = true;
            state.singlePromoCodeState.error = null;
        },
        fetchSinglePromoCodeSuccess(state, action) {
            state.singlePromoCodeState.loading = false;
            state.singlePromoCodeState.data = action.payload;
            state.singlePromoCodeState.error = null;
        },
        fetchSinglePromoCodeFailure(state, action) {
            state.singlePromoCodeState.loading = false;
            state.singlePromoCodeState.error = action.payload;
        },
        deletePromoCodeStart(state) {
            state.singlePromoCodeState.loading = true;
            state.singlePromoCodeState.error = null;
        },
        deletePromoCodeSuccess(state, action) {
            state.singlePromoCodeState.loading = false;
        },
        deletePromoCodeFailure(state, action) {
            state.singlePromoCodeState.loading = false;
            state.singlePromoCodeState.error = action.payload;
        }
    }
});

export const {
    fetchPromoCodeStart,
    fetchPromoCodeListSuccess,
    fetchPromoCodeFailure,
    addEditPromoCodeStart,
    addEditPromoCodeSuccess,
    addEditPromoCodeFailure,
    setPromoCodeData,
    updatePromoCodeData,
    fetchSinglePromoCodeStart,
    fetchSinglePromoCodeSuccess,
    fetchSinglePromoCodeFailure,
    deletePromoCodeStart,
    deletePromoCodeFailure,
    deletePromoCodeSuccess
} = promoCodeSlice.actions;

export default promoCodeSlice.reducer;
