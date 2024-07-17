// studySlice.jsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fastReadingExercises: [],
  fastReadingWorkouts: [],
  fastReadingTests: [],
  loading: false,
  error: null,
};

const studySlice = createSlice({
  name: "studies",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.fastReadingExercises = action.payload.filter(exercise => exercise.type === 'exercise');
      state.fastReadingWorkouts = action.payload.filter(exercise => exercise.type === 'workout');
      state.fastReadingTests = action.payload.filter(exercise => exercise.type === 'test');
      state.loading = false;
    },
    fetchFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addExercise: (state, action) => {
      if (action.payload.type === 'exercise') {
        state.fastReadingExercises.push(action.payload);
      } else if (action.payload.type === 'workout') {
        state.fastReadingWorkouts.push(action.payload);
      } else if (action.payload.type === 'test') {
        state.fastReadingTests.push(action.payload);
      }
      state.loading = false;
    },
    updateExercise: (state, action) => {
      const updateType = (type) => {
        const index = state[type].findIndex(exercise => exercise._id === action.payload._id);
        if (index !== -1) {
          state[type][index] = action.payload;
        }
      };

      if (action.payload.type === 'exercise') {
        updateType('fastReadingExercises');
      } else if (action.payload.type === 'workout') {
        updateType('fastReadingWorkouts');
      } else if (action.payload.type === 'test') {
        updateType('fastReadingTests');
      }
    },
    deleteExercise: (state, action) => {
      const deleteType = (type) => {
        state[type] = state[type].filter(exercise => exercise._id !== action.payload);
      };

      deleteType('fastReadingExercises');
      deleteType('fastReadingWorkouts');
      deleteType('fastReadingTests');
    },
  },
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFail,
  addExercise,
  updateExercise,
  deleteExercise,
} = studySlice.actions;

export default studySlice.reducer;
