import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignments: [],
  loading: false,
  error: false,
  deletingId: null,
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.error = false;
      state.loading = true;
    },
    fetchSuccess: (state, { payload }) => {
      state.assignments = payload;
      state.loading = false;
      state.error = false;
    },
    fetchFail: (state) => {
      state.loading = false;
      state.error = true;
    },
    addAssignment: (state, { payload }) => {
      state.assignments.push(payload);
      state.loading = false;  // Clear loading state after adding
    },
    updateAssignment: (state, { payload }) => {
      const index = state.assignments.findIndex(assignment => assignment._id === payload._id);
      if (index !== -1) {
        state.assignments[index] = payload;
      }
    },
    updateAssignmentStatus: (state, { payload }) => {
      const { assignmentId, isDone } = payload;
      const index = state.assignments.findIndex(assignment => assignment._id === assignmentId);
      if (index !== -1) {
        state.assignments[index].isDone = isDone;
      }
    },
    updateAssignmentProgress: (state, { payload }) => {
      const { assignmentId, progress } = payload;
      const index = state.assignments.findIndex(assignment => assignment._id === assignmentId);
      if (index !== -1) {
        state.assignments[index].progress = progress;
      }
    },
    deleteAssignment: (state, { payload }) => {
      state.assignments = state.assignments.filter(assignment => assignment._id !== payload);
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
  addAssignment,
  updateAssignment,
  updateAssignmentStatus,
  updateAssignmentProgress,
  deleteAssignment,
  setDeletingId,
} = assignmentSlice.actions;

export default assignmentSlice.reducer;
