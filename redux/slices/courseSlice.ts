'use client';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchApi } from '@/services/utlis/fetchApi';
import { BaseModel, BaseState, PaginationState } from '@/types/globals';

export type ICourse = BaseModel & {
  _id?: string;
  web_eng_title?: string;
  web_hin_title?: string;
  web_eng_text?: string;
  web_hin_text?: string;
  web_eng_img?: File[];
  web_hin_img?: File[];
  web_hin_audio?: string;
  web_eng_audio?: string;
  createdBy?: ICourse;
};

const initialState = {
  courseListState: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pageSize: 10,
      totalCount: 0
    }
  } as PaginationState<ICourse[]>,
  singleCourseState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ICourse | null>,
  currentCourseState: {
    data: null,
    loading: null,
    error: null
  } as BaseState<ICourse | null>
};

export const fetchCourseList = createAsyncThunk<
  any,
  { page?: number; pageSize?: number; department?: string } | void,
  { state: RootState }
>(
  'course/fetchCourseList',
  async (input, { dispatch, rejectWithValue, getState }) => {
    try {
      const { page, pageSize } = input || {};
      dispatch(fetchCourseStart());
      const response = await fetchApi(`/courses`, { method: 'GET' });

      if (response?.success) {
        dispatch(
          fetchCourseListSuccess({
            data: response.course,
            totalCount: response.totalCount
          })
        );
      } else {
        throw new Error('No Status or invalid response');
      }
    } catch (error: any) {
      const errorMsg = error?.message ?? 'Something went Wrong !!';
      dispatch(fetchCourseFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  }
);

export const addEditCourse = createAsyncThunk<
  any,
  string | null,
  { state: RootState }
>('course/add', async (entityId, { dispatch, rejectWithValue, getState }) => {
  try {
    const {
      course: {
        singleCourseState: { data }
      }
    } = getState();

    dispatch(addEditCourseStart());

    if (!data) {
      return rejectWithValue('Please Provide Details');
    }

    let formData = new FormData();

    const reqData: any = {
      web_eng_title: data.web_eng_title,
      web_eng_text: data.web_eng_text
      // web_eng_img: data.web_eng_img,
      // web_eng_audio: data.web_eng_audio,
      // web_hin_title: data.web_hin_title,
      // web_hin_text: data.web_hin_text,
      // web_hin_img: data.web_hin_img,
      // web_hin_audio: data.web_hin_audio
    };
    formData.append('web_eng_title', reqData.web_eng_title);

    formData.append('web_eng_text', reqData.web_eng_text);
    // formData.append('web_eng_audio', reqData.web_eng_audio);
    // formData.append('web_hin_title', reqData.web_hin_title);
    // formData.append('web_hin_text', reqData.web_hin_text);
    // formData.append('web_hin_img', reqData.web_hin_img);
    // formData.append('web_hin_audio', reqData.web_hin_audio);

    // reqData.web_eng_img.forEach((file: File) => {
    //   formData.append('web_eng_img', file);
    // });

    let response;
    if (!entityId) {
      response = await fetchApi('/course/new', {
        method: 'POST',
        body: formData
      });
    } else {
      response = await fetchApi(`/course/update/${entityId}`, {
        method: 'PUT',
        body: formData
      });
    }

    if (response?.success) {
      dispatch(addEditCourseSuccess());
      dispatch(fetchCourseList());
    } else {
      const errorMsg = response?.data?.message ?? 'Something Wrong!!';
      dispatch(addEditCourseFailure(errorMsg));
      return rejectWithValue(errorMsg);
    }
  } catch (error: any) {
    const errorMsg = error?.message ?? 'Someting Went Wrong!!';
    dispatch(addEditCourseFailure(errorMsg));
    return rejectWithValue(errorMsg);
  }
});

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    fetchCourseStart(state) {
      state.courseListState.loading = true;
      state.courseListState.error = null;
    },
    fetchCourseListSuccess(state, action) {
      state.courseListState.loading = false;
      const { data, totalCount } = action.payload;
      state.courseListState.data = data;
      state.courseListState.pagination.totalCount = totalCount;
      state.courseListState.error = null;
    },
    fetchCourseFailure(state, action) {
      state.courseListState.loading = false;
      state.courseListState.error = action.payload;
    },
    setCourseData(state, action) {
      state.singleCourseState.data = action.payload;
    },
    updateCourseData(state, action) {
      const oldData = state.singleCourseState.data;
      state.singleCourseState.data = { ...oldData, ...action.payload };
    },
    addEditCourseStart(state) {
      state.singleCourseState.loading = true;
      state.singleCourseState.error = null;
    },
    addEditCourseSuccess(state) {
      state.singleCourseState.loading = false;
      state.singleCourseState.error = null;
    },
    addEditCourseFailure(state, action) {
      state.singleCourseState.loading = false;
      state.singleCourseState.error = action.payload;
    }
  }
});

export const {
  fetchCourseStart,
  fetchCourseListSuccess,
  fetchCourseFailure,
  addEditCourseFailure,
  addEditCourseSuccess,
  addEditCourseStart,
  updateCourseData
} = courseSlice.actions;

export default courseSlice.reducer;
