import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  activeCourse: [],
  loading: false,
  error: false,
  deletingId: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.error = false;
      state.loading = true;
    },
    fetchSuccess: (state, { payload }) => {
      state.courses = payload;
      state.loading = false;
      state.error = false;
    },
    fetchFail: (state) => {
      state.loading = false;
      state.error = true;
    },
    setCourse: (state, { payload }) => {
      // state.courses = state.courses.map(course =>
      //   course._id === payload._id ? payload : course
      // );
      state.activeCourse = payload
    },
    addCourse: (state, { payload }) => {
      state.courses.push(payload);
      state.loading = false;
    },
    updateCourse: (state, { payload }) => {
      const index = state.courses.findIndex(course => course._id === payload._id);
      if (index !== -1) {
        state.courses[index] = payload;
      }
    },
    deleteCourse: (state, { payload }) => {
      state.courses = state.courses.filter(course => course._id !== payload);
    },
    setDeletingId: (state, { payload }) => {
      state.deletingId = payload;
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFail,
  setCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  setDeletingId,
} = courseSlice.actions;

export default courseSlice.reducer;
