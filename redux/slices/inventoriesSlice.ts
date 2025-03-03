import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';

import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { toast } from 'sonner';
import { IProducts } from './productSlice';

export type IInventory = BaseModel & {
    _id?: string;
    createdAt?: any;
    value?: any;
    type?: any;
    message?: string;
    variantId?: string;
    productId?: string;
    stock_management?: any; 
};

const initialState = {
    inventoryListState: {
        data: [],
        loading: false,
        error: null,
        pagination: {
            page: 1,
            pageSize: 10,
            totalCount: 0
        }
    } as PaginationState<IInventory[]>,
    productsListState: {
        data: [],
        loading: false,
        error: null,
        pagination: {
            page: 1,
            pageSize: 10,
            totalCount: 0
        }
    } as PaginationState<IProducts[]>,
    singleInventoryState: {
        data: null,
        loading: null,
        error: null
    } as BaseState<IInventory | null>,
    singleVariationState: {
        data: null,
        loading: null,
        error: null
    } as BaseState<IProducts | null>,
    currentInventoryState: {
        data: null,
        loading: null,
        error: null
    } as BaseState<IInventory | null>,
    changeInventoryPassword: {
        data: null,
        loading: null,
        error: null
    } as BaseState<IInventory | null>
};

export const fetchInventoryList = createAsyncThunk<
    any,
    {
        page?: number;
        pageSize?: number;
        productId: string;
        variantId: string;
        producttype: string;
        stock_management: string;
        exportData: string;
        startDate: any;
        endDate: any;
    } | void,
    { state: RootState }
>(
    'inventory/fetchInventoryList',
    async (input, { dispatch, rejectWithValue, getState }) => {
        try {
            const { page, pageSize, productId,
                variantId,
                producttype,
                stock_management, exportData, startDate, endDate } =
                input || {};

            dispatch(fetchInventoryStart());
            const response = await fetchApi(
                `/inventories/all?page=${page || 1}&limit=${pageSize || 10}&productype=${producttype || ''
                }&stock_management=${stock_management || ''}&productId=${productId || ""}&variantId=${variantId || ''}&export=${exportData || ''}&startDate=${startDate || ""}&endDate=${endDate || ""}`,
                { method: 'GET' }
            );
            // Check if the API response is valid and has the expected data
            if (response?.success) {
                dispatch(
                    fetchInventoryListSuccess({
                        data: response.InventoriesData,
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
            dispatch(fetchInventoryFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);
export const addEditInventory = createAsyncThunk<
    any,
    string | null,
    { state: RootState }
>('inventory/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
        const {
            inventories: {
                singleInventoryState: { data }
            }
        } = getState();

        dispatch(addEditInventoryStart());

        if (!data) {
            return rejectWithValue('Please Provide Details');
        }
        let variationId
        if (data.variantId == '') {
            variationId
        } else {
            variationId = data.variantId
        }
        const formData = new FormData();
        const reqData: any = {
            value: data.value,
            type: data.type,
            message: data.message,
            productId: data.productId,
            variationId: variationId,
            stock_management: data.stock_management,
        };
        // Append only defined fields to FormData
        Object.entries(reqData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value as string | Blob);
            }
        });

        let response;
        if (!entityId) {
            response = await fetchApi('/inventories/new', {
                method: 'POST',
                body: formData
            });
        } else {
            response = await fetchApi(`/inventories/update/${entityId}`, {
                method: 'PUT',
                body: formData
            });
        }
        if (response?.success) {
            dispatch(addEditInventorySuccess());
            dispatch(fetchInventoryList());
            return response;
        } else {
            const errorMsg = response?.data?.message ?? 'Something Went Wrong1!!';
            dispatch(addEditInventoryFailure(errorMsg));
            toast.error(errorMsg)
            return rejectWithValue(errorMsg);
        }
    } catch (error: any) {
        const errorMsg = error?.message ?? 'Something Went Wrong!!';
        toast.error(errorMsg)
        dispatch(addEditInventoryFailure(errorMsg));
        return rejectWithValue(errorMsg);
    }
});
export const fetchSingleInventory = createAsyncThunk<
    any,
    string | null,
    { state: RootState }
>('/cities/all', async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
        dispatch(fetchSingleInventoryStart());
        const response = await fetchApi(`/inventories/single/${entityId}`, {
            method: 'GET'
        });
        if (response?.success) {
            dispatch(fetchSingleInventorySuccess(response?.inventorydata));
            return response;
        } else {
            let errorMsg = response?.data?.message || 'Something Went Wrong';
            dispatch(fetchSingleInventoryFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    } catch (error: any) {
        let errorMsg = error?.message || 'Something Went Wrong';
        dispatch(fetchSingleInventoryFailure(errorMsg));
        return rejectWithValue(errorMsg);
    }
});

export const deleteInventory = createAsyncThunk<any, string, { state: RootState }>(
    'inventory/delete',
    async (id, { dispatch }) => {
        dispatch(deleteInventoryStart());
        try {
            const response = await fetchApi(`/inventories/delete/${id}`, {
                method: 'DELETE'
            });
            if (response.success) {
                dispatch(deleteInventorySuccess(id));
                dispatch(fetchInventoryList());
                toast.success('Inventory deleted successfuly');
                return response;
            } else {
                let errorMsg = response?.data?.message || 'Something Went Wrong';
                toast.error(errorMsg);
                dispatch(deleteInventoryFailure(errorMsg));
            }
        } catch (error: any) {
            dispatch(deleteInventoryFailure(error.message || 'Failed to delete inventory'));
            toast.error(error.message);
        }
    }
);
export const fetchProductsList = createAsyncThunk<
    any,
    {
        keyword?: string;
        page?: number;
        pageSize?: number;
        exportData: string;
        selectedProductIds?: string;
    } | void,
    { state: RootState }
>(
    'products/fetchProductsList',
    async (input, { dispatch, rejectWithValue, getState }) => {
        try {
            const { page, pageSize, keyword, exportData, selectedProductIds } =
                input || {};

            dispatch(fetchProductsStart());
            const response = await fetchApi(
                `/inventories/products?page=${page || 1}&limit=${pageSize || 10}&keyword=${keyword || ''
                }&exportData=${exportData}&selectedProductIds=${selectedProductIds || ''}`,
                { method: 'GET' }
            );
            // Check if the API response is valid and has the expected data
            if (response?.success) {
                dispatch(
                    fetchProductsListSuccess({
                        data: response.productsdata,
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
            dispatch(fetchProductsFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    }
);
export const fetchSingleVariation = createAsyncThunk<
    any,
    string | null,
    { state: RootState }
>('/variant', async (entityId, { dispatch, rejectWithValue, getState }) => {
    try {
        dispatch(fetchSingleVariationStart());
        const response = await fetchApi(`/inventories/variant/${entityId}`, {
            method: 'GET'
        });
        if (response?.success) {
            dispatch(fetchSingleVariationSuccess(response?.variantdata
            ));
            return response;
        } else {
            let errorMsg = response?.data?.message || 'Something Went Wrong';
            dispatch(fetchSingleVariationFailure(errorMsg));
            return rejectWithValue(errorMsg);
        }
    } catch (error: any) {
        let errorMsg = error?.message || 'Something Went Wrong';
        dispatch(fetchSingleVariationFailure(errorMsg));
        return rejectWithValue(errorMsg);
    }
});
const inventorySlice = createSlice({
    name: 'inventories',
    initialState,
    reducers: {
        fetchInventoryStart(state) {
            state.inventoryListState.loading = true;
            state.inventoryListState.error = null;
        },
        fetchInventoryListSuccess(state, action) {
            state.inventoryListState.loading = false;
            const { data, totalCount } = action.payload;
            state.inventoryListState.data = data;
            state.inventoryListState.pagination.totalCount = totalCount;
            state.inventoryListState.error = null;
        },
        fetchInventoryFailure(state, action) {
            state.inventoryListState.loading = false;
            state.inventoryListState.error = action.payload;
        },
        setInventoryData(state, action) {
            state.singleInventoryState.data = action.payload;
        },
        updateInventoryData(state, action) {
            const oldData = state.singleInventoryState.data;
            state.singleInventoryState.data = { ...oldData, ...action.payload };
        },
        addEditInventoryStart(state) {
            state.singleInventoryState.loading = true;
            state.singleInventoryState.error = null;
        },
        addEditInventorySuccess(state) {
            state.singleInventoryState.loading = false;
            state.singleInventoryState.error = null;
        },
        addEditInventoryFailure(state, action) {
            state.singleInventoryState.loading = false;
            state.singleInventoryState.error = action.payload;
        },
        fetchSingleInventoryStart(state) {
            state.singleInventoryState.loading = true;
            state.singleInventoryState.error = null;
        },
        fetchSingleInventorySuccess(state, action) {
            state.singleInventoryState.loading = false;
            state.singleInventoryState.data = action.payload;
            state.singleInventoryState.error = null;
        },
        fetchSingleInventoryFailure(state, action) {
            state.singleInventoryState.loading = false;
            state.singleInventoryState.error = action.payload;
        },
        fetchSingleVariationStart(state) {
            state.singleVariationState.loading = true;
            state.singleVariationState.error = null;
        },
        fetchSingleVariationSuccess(state, action) {
            state.singleVariationState.loading = false;
            state.singleVariationState.data = action.payload;
            state.singleVariationState.error = null;
        },
        fetchSingleVariationFailure(state, action) {
            state.singleVariationState.loading = false;
            state.singleVariationState.error = action.payload;
        },
        deleteInventoryStart(state) {
            state.singleInventoryState.loading = true;
            state.singleInventoryState.error = null;
        },
        deleteInventorySuccess(state, action) {
            state.singleInventoryState.loading = false;
        },
        deleteInventoryFailure(state, action) {
            state.singleInventoryState.loading = false;
            state.singleInventoryState.error = action.payload;
        },
        fetchProductsStart(state) {
            state.productsListState.loading = true;
            state.productsListState.error = null;
        },
        fetchProductsListSuccess(state, action) {
            state.productsListState.loading = false;
            const { data, totalCount } = action.payload;
            state.productsListState.data = data;
            state.productsListState.pagination.totalCount = totalCount;
            state.productsListState.error = null;
        },
        fetchProductsFailure(state, action) {
            state.productsListState.loading = false;
            state.productsListState.error = action.payload;
        },
    }
});

export const {
    fetchInventoryStart,
    fetchInventoryListSuccess,
    fetchInventoryFailure,
    addEditInventoryStart,
    addEditInventorySuccess,
    addEditInventoryFailure,
    setInventoryData,
    updateInventoryData,
    fetchSingleInventoryStart,
    fetchSingleInventorySuccess,
    fetchSingleInventoryFailure,
    fetchSingleVariationStart,
    fetchSingleVariationSuccess,
    fetchSingleVariationFailure,
    deleteInventoryStart,
    deleteInventoryFailure,
    deleteInventorySuccess,
    fetchProductsStart,
    fetchProductsListSuccess,
    fetchProductsFailure,
} = inventorySlice.actions;

export default inventorySlice.reducer;
