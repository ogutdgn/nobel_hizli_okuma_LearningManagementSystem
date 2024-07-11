import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exercises: [],
  loading: false,
  error: false,
  fetched: false,
};

const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.error = false;
      state.loading = true;
    },
    fetchSuccess: (state, { payload }) => {
      state.exercises = payload;
      state.loading = false;
      state.error = false;
      state.fetched = true;
    },
    fetchFail: (state) => {
      state.loading = false;
      state.error = true;
    },
    setExercise: (state, { payload }) => {
      state.exercises = state.exercises.map(exercise =>
        exercise._id === payload._id ? payload : exercise
      );
    },
    addExercise: (state, { payload }) => {
      state.exercises.push(payload);
    },
    updateExercise: (state, { payload }) => {
      const index = state.exercises.findIndex(exercise => exercise._id === payload._id);
      if (index !== -1) {
        state.exercises[index] = payload;
      }
    },
    deleteExercise: (state, { payload }) => {
      state.exercises = state.exercises.filter(exercise => exercise._id !== payload);
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFail,
  setExercise,
  addExercise,
  updateExercise,
  deleteExercise,
} = exerciseSlice.actions;

export default exerciseSlice.reducer;
