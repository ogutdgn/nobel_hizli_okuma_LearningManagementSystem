import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lesson: [],
  loading: false,
  error: false,
  deletingId: null,
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.error = false;
      state.loading = true;
    },
    fetchSuccess: (state, { payload }) => {
      state.lesson = payload;
      state.loading = false;
      state.error = false;
    },
    fetchFail: (state) => {
      state.loading = false;
      state.error = true;
    },
    addLesson: (state, { payload }) => {
      state.lesson.push(payload);
      state.loading = false;  // Clear loading state after adding
    },
    updateLesson: (state, { payload }) => {
      const index = state.lesson.findIndex(assignment => assignment._id === payload._id);
      if (index !== -1) {
        state.lesson[index] = payload;
      }
    },
    updateLessonStatus: (state, { payload }) => {
      const { assignmentId, isDone } = payload;
      const index = state.lesson.findIndex(assignment => assignment._id === assignmentId);
      if (index !== -1) {
        state.lesson[index].isDone = isDone;
      }
    },
    updateLessonProgress: (state, { payload }) => {
      const { assignmentId, progress } = payload;
      const index = state.lesson.findIndex(assignment => assignment._id === assignmentId);
      if (index !== -1) {
        state.lesson[index].progress = progress;
      }
    },
    deleteLesson: (state, { payload }) => {
      state.lesson = state.lesson.filter(assignment => assignment._id !== payload);
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
  addLesson,
  updateLesson,
  updateLessonStatus,
  updateLessonPorgress,
  deleteLesson,
  setDeletingId,
} = lessonSlice.actions;

export default lessonSlice.reducer;
