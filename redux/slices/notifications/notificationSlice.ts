import { RootState } from '@/redux/store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';
import { setNestedProperty } from '@/utils/SetNestedProperty';
import { uploadAWSFile } from '@/utils/UploadNestedFiles';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import _, { cloneDeep } from 'lodash';
import { IAllUsers } from '../allusersSlice';

export type IMobileNotification = BaseModel & {
  title?: string;
  message?: string;
  notificationImage?: string | File;
  userSelectionType?: 'all' | 'specific';
  users?: IAllUsers[];
  platformSelectionType?: 'all' | 'onlyIOS' | 'onlyAndroid';
  feature?:
    | 'actvieMembership'
    | 'expiredMembership'
    | 'activeJeevanSanchetna'
    | 'expiredJeevanSanchetna'
    | 'activeCourse'
    | 'expiredCourse'
    | 'buyeBook'
    | 'buyPooja'
    | 'buySpiritualBook'
    | 'buyEvents';
};

const initialState = {
  mobileNotificationList: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<IMobileNotification[]>,
  singleMobileNotificationState: {
    data: null,
    loading: null,
    error: null,
    addEditLoading: false
  } as BaseState<IMobileNotification | null>
};

export const createOrSendMobileNotification = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('mobile/notification', async (_, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      mobileNotifications: {
        singleMobileNotificationState: { data }
      }
    } = getState();

    dispatch(createOrUpdateMobileNotificationStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    // Create a deep clone of data to avoid mutating the original object
    const clonedData = cloneDeep(data);

    if (clonedData?.notificationImage) {
      const formattedNotificationURL =
        clonedData?.notificationImage instanceof File
          ? await uploadAWSFile(clonedData?.notificationImage)
          : clonedData?.notificationImage;
      if (clonedData && formattedNotificationURL) {
        clonedData.notificationImage = formattedNotificationURL;
      }
    }

    const formData = new FormData();
    const reqData: any = {
      title: clonedData.title,
      message: clonedData.message,
      notificationImage: clonedData.notificationImage,
      userSelectionType: clonedData.userSelectionType,
      users: clonedData.users
        ? clonedData?.users?.map((user: any) => user?._id)?.join(',')
        : [],
      platformSelectionType: clonedData.platformSelectionType,
      feature: clonedData?.feature
    };

    Object.entries(reqData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    let response = await fetchApi('/mobile-notification/create-or-send', {
      method: 'POST',
      body: formData
    });

    if (response?.success) {
      dispatch(createOrUpdateMobileNotificationSuccess());
      return response;
    } else {
      const errorMsg = response?.data?.message ?? 'Something Went Wrong!!';
      dispatch(addEditAllNewsListFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Something Went Wrong!!';
    dispatch(addEditAllNewsListFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

const mobileNotificationSlice = createSlice({
  name: 'mobileNotification',
  initialState,
  reducers: {
    setMobileNotificationData(state, action) {
      state.singleMobileNotificationState.data = action.payload;
    },
    updateMobileNotificationData(state, action) {
      const oldData = state.singleMobileNotificationState.data;
      const keyFirst = Object.keys(action.payload)[0];

      if (keyFirst.includes('.')) {
        const newData = { ...oldData };
        setNestedProperty(newData, keyFirst, action.payload[keyFirst]);
        state.singleMobileNotificationState.data = newData;
      } else {
        state.singleMobileNotificationState.data = {
          ...oldData,
          ...action.payload
        };
      }
    },
    createOrUpdateMobileNotificationStart(state) {
      state.singleMobileNotificationState.loading = true;
      state.singleMobileNotificationState.addEditLoading = true;
      state.singleMobileNotificationState.error = null;
    },
    createOrUpdateMobileNotificationSuccess(state) {
      state.singleMobileNotificationState.addEditLoading = false;
      state.singleMobileNotificationState.loading = false;
      state.singleMobileNotificationState.error = null;
    },
    addEditAllNewsListFailure(state, action) {
      state.singleMobileNotificationState.addEditLoading = false;
      state.singleMobileNotificationState.loading = false;
      state.singleMobileNotificationState.error = action.payload;
    }
  }
});

export const {
  setMobileNotificationData,
  updateMobileNotificationData,
  createOrUpdateMobileNotificationStart,
  createOrUpdateMobileNotificationSuccess,
  addEditAllNewsListFailure
} = mobileNotificationSlice.actions;
export default mobileNotificationSlice.reducer;
