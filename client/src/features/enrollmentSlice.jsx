import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  enrollments: [],
  loading: false,
  error: false,
  deletingId: null,
};

const enrollmentSlice = createSlice({
  name: "enrollment",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.error = false;
      state.loading = true;
    },
    fetchSuccess: (state, { payload }) => {
      state.enrollments = payload;
      state.loading = false;
      state.error = false;
    },
    fetchFail: (state) => {
      state.loading = false;
      state.error = true;
    },
    addEnrollment: (state, { payload }) => {
      state.enrollments.push(payload);
    },
    updateEnrollment: (state, { payload }) => {
      const index = state.enrollments.findIndex(enrollment => enrollment._id === payload._id);
      if (index !== -1) {
        state.enrollments[index] = payload;
      }
    },
    deleteEnrollment: (state, { payload }) => {
      state.enrollments = state.enrollments.filter(enrollment => enrollment._id !== payload);
    },
    setDeletingId: (state, { payload }) => {
      state.deletingId = payload;
    }
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFail,
  addEnrollment,
  updateEnrollment,
  deleteEnrollment,
  setDeletingId,
} = enrollmentSlice.actions;

export default enrollmentSlice.reducer;
