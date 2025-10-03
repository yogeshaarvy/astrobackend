import type { BaseModel, BaseState } from '@/types/globals';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { read, utils } from 'xlsx';
import { uploadAWSFile } from '@/utils/UploadNestedFiles';

export type Order = BaseModel & {
  name?: string;
  startDateTime?: string;
  endDateTime?: string;
  content?: {
    TitleEnglish?: string;
    TitleHindi?: string;
    ShortDescriptionEnglish?: string;
    ShortDescriptionHindi?: string;
  };
};

type BulkError = {
  index: number;
  data?: any;
  errors: string[];
};

export type BulkOrder = {
  excel: any[];
  orderList: Order[];
  errorOrders: BulkError[];
};

const initialState = {
  bulkOrderCalendarState: {
    data: null,
    loading: false,
    error: null
  } as BaseState<BulkOrder | null>
};

export const addBulkOrder = createAsyncThunk<any, any, { state: RootState }>(
  'bulkOrder/addBulkOrder',
  async (orderArray, { dispatch, rejectWithValue, getState }) => {
    dispatch(updateOrderDataError([]));
    dispatch(addBulkOrderStart());
    const {
      bulkOrderCalendar: {
        bulkOrderCalendarState: { data }
      }
    } = getState();

    try {
      const safeTrim = (val: any, fallback: any = '') =>
        typeof val === 'string' ? val.trim() : val ?? fallback;

      console.log('Received orderArray:', data);

      // Map the order array to match backend expectations
      const orderList = orderArray.map((item: any) => ({
        name: item?.name ?? null,
        StartDate: safeTrim(item?.StartDate),
        EndDate: safeTrim(item?.EndDate),
        TitleEnglish: safeTrim(item?.TitleEnglish),
        TitleHindi: safeTrim(item?.TitleHindi),
        ShortDescriptionEnglish: item?.ShortDescriptionEnglish ?? null,
        ShortDescriptionHindi: item?.ShortDescriptionHindi ?? null
      }));

      console.log('Prepared orderList:', orderList);
      let uploadFileURL = null;
      if (data?.excel && data?.excel instanceof File) {
        uploadFileURL = await uploadAWSFile(data?.excel);
      }

      console.log('Sending order list to backend:', orderList);
      const updatedPayload = {
        orderList: orderList,
        file: uploadFileURL ? uploadFileURL : null
      };

      const response = await fetchApi(`/calendar/admin/bulk`, {
        method: 'POST',
        body: updatedPayload
      });

      console.log('Backend response:', response);

      if (response?.status) {
        const {
          errorOrders = [],
          successCount = 0,
          errorCount = 0,
          message
        } = response;

        if (Array.isArray(errorOrders) && errorOrders.length > 0) {
          dispatch(updateOrderDataError(errorOrders));
          dispatch(
            addBulkOrderFailure(
              `${successCount} orders successful, ${errorCount} orders failed`
            )
          );

          return {
            success: true,
            message: message,
            successCount,
            errorCount,
            errors: errorOrders,
            hasErrors: true
          };
        }

        dispatch(addBulkOrderSuccess());
        return {
          success: true,
          message: message,
          successCount,
          errorCount: 0,
          errors: [],
          hasErrors: false
        };
      } else {
        const errorMsg =
          response?.message ||
          response?.data?.message ||
          'Something went wrong!!';
        dispatch(addBulkOrderFailure(errorMsg));
        return rejectWithValue(errorMsg);
      }
    } catch (error: any) {
      console.error('Bulk Order error: ', error);
      const errorMsg = error?.message || 'Something went wrong!!';
      dispatch(addBulkOrderFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const convertBulkOrderError = createAsyncThunk<
  any,
  void,
  { state: RootState }
>(
  'bulkOrder/convertBulkOrderError',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const {
        bulkOrder: {
          bulkOrderState: { data }
        }
      } = getState();
      const errorOrders = data?.errorOrders ?? [];

      console.log('errorOrders', errorOrders, data);

      let errorContent = '';
      for (const errorItem of errorOrders) {
        const messages = Array.isArray(errorItem?.error) ? errorItem.error : [];
        for (const msg of messages) {
          errorContent += `Error: ${msg}. on line no. ${errorItem.index}\n\n`;
        }
      }
      const link = document.createElement('a');
      const file = new Blob([errorContent], { type: 'text/plain' });
      console.log('file12354', file);
      link.href = URL.createObjectURL(file);
      link.download = 'error.log';
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error: any) {
      console.log('error', error);
    }
  }
);

export const convertBulkOrderData = createAsyncThunk<
  any,
  void,
  { state: RootState }
>(
  'bulkOrder/convertBulkOrderData',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      console.log('The Convert Bulk Order Data is Called');
      const {
        bulkOrder: {
          bulkOrderState: { data }
        }
      } = getState();

      const excelData = data?.excel ?? [];
      console.log('The excel Data value is', excelData);

      if (
        excelData &&
        (Array.isArray(excelData) ? excelData.length > 0 : excelData)
      ) {
        console.log('Test 1');

        const excelItem = Array.isArray(excelData) ? excelData[0] : excelData;
        console.log('Test 2 - Processing file:', excelItem.name);

        const processExcelFile = () => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
              try {
                console.log('Test 3 - File loaded successfully');
                const wb = read(event.target?.result);
                const sheets = wb.SheetNames;

                if (sheets.length) {
                  const rows = utils.sheet_to_json(
                    wb.Sheets[sheets[0]]
                  ) as Array<any>;
                  console.log('Test 4 - Rows extracted:', rows);

                  const orderList = rows.map((row: any) => {
                    const formatDate = (dateValue: any) => {
                      if (!dateValue) return '';

                      let jsDate: Date;

                      if (dateValue instanceof Date) {
                        jsDate = dateValue;
                      } else if (
                        typeof dateValue === 'number' &&
                        dateValue > 1
                      ) {
                        const excelEpoch = new Date(1900, 0, 1);
                        const days = dateValue - 2;
                        jsDate = new Date(
                          excelEpoch.getTime() + days * 24 * 60 * 60 * 1000
                        );
                      } else if (typeof dateValue === 'string') {
                        const parsedDate = new Date(dateValue);
                        if (!isNaN(parsedDate.getTime())) {
                          jsDate = parsedDate;
                        } else {
                          return `${dateValue}`;
                        }
                      } else {
                        return `${dateValue}`;
                      }

                      const month = String(jsDate.getMonth() + 1).padStart(
                        2,
                        '0'
                      );
                      const day = String(jsDate.getDate()).padStart(2, '0');
                      const year = jsDate.getFullYear();

                      return `${month}/${day}/${year}`;
                    };

                    console.log('Processing row:', row);

                    return {
                      name: row?.name ? `${row?.name}` : null,
                      StartDate: formatDate(row?.StartDate) || '',
                      EndDate: formatDate(row?.EndDate) || '',
                      TitleEnglish: `${row?.TitleEnglish || ''}`,
                      TitleHindi: `${row?.TitleHindi || ''}`,
                      ShortDescriptionEnglish: row?.ShortDescriptionEnglish
                        ? `${row?.ShortDescriptionEnglish}`
                        : null,
                      ShortDescriptionHindi: row?.ShortDescriptionHindi
                        ? `${row?.ShortDescriptionHindi}`
                        : null
                    };
                  });

                  console.log('Test 5 - OrderList created:', orderList);
                  resolve(orderList);
                } else {
                  reject(new Error('No sheets found in Excel file'));
                }
              } catch (err) {
                console.error('Error processing Excel file:', err);
                reject(err);
              }
            };

            reader.onerror = (error) => {
              console.error('FileReader error:', error);
              reject(new Error('Failed to read Excel file'));
            };

            reader.readAsArrayBuffer(excelItem);
          });
        };

        const orderList = await processExcelFile();
        console.log('Final OrderList:', orderList);

        dispatch(updateOrderDataFromExcel(orderList));

        return orderList;
      } else {
        throw new Error('No Excel file found in data');
      }
    } catch (error: any) {
      console.error('Error in convertBulkOrderData:', error);
      const errorMsg = error?.message ?? 'Something went wrong!!';
      return rejectWithValue(errorMsg);
    }
  }
);

const bulkOrderSlice = createSlice({
  name: 'bulkOrder',
  initialState,
  reducers: {
    addBulkOrderStart(state) {
      state.bulkOrderCalendarState.loading = true;
      state.bulkOrderCalendarState.error = null;
    },
    addBulkOrderSuccess(state) {
      state.bulkOrderCalendarState.loading = false;
      state.bulkOrderCalendarState.error = null;
    },
    addBulkOrderFailure(state, action) {
      state.bulkOrderCalendarState.loading = false;
      state.bulkOrderCalendarState.error = action.payload;
    },
    updateBulkOrderData(state, action) {
      console.log('Action payload in updateBulkOrderData:', action.payload);
      const oldData = state.bulkOrderCalendarState.data ?? {
        excel: [],
        orderList: [],
        errorOrders: []
      };
      state.bulkOrderCalendarState.data = { ...oldData, ...action.payload };
    },
    updateOrderDataFromExcel(state, action) {
      if (state.bulkOrderCalendarState.data) {
        state.bulkOrderCalendarState.data.orderList = action.payload;
      }
    },
    updateOrderDataError(state, action) {
      if (state.bulkOrderCalendarState.data) {
        state.bulkOrderCalendarState.data.errorOrders = action.payload;
      }
    }
  }
});

export const {
  addBulkOrderStart,
  addBulkOrderSuccess,
  addBulkOrderFailure,
  updateBulkOrderData,
  updateOrderDataFromExcel,
  updateOrderDataError
} = bulkOrderSlice.actions;

export default bulkOrderSlice.reducer;
