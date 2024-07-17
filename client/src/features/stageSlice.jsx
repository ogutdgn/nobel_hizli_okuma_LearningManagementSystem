import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stages: [],
  loading: false,
  error: null,
  stageOrder: 0,
};

const stageSlice = createSlice({
  name: "stage",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.stages = action.payload;
      state.loading = false;
    },
    fetchFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addStage: (state, action) => {
      state.stages.push(action.payload);
      state.loading = false;
    },
    updateStage: (state, action) => {
      const index = state.stages.findIndex(stage => stage._id === action.payload._id);
      if (index !== -1) {
        state.stages[index] = action.payload;
      }
    },
    deleteStage: (state, action) => {
      state.stages = state.stages.filter(stage => stage._id !== action.payload);
    },
    setStageOrder: (state, { payload }) => {
      state.stageOrder = payload;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFail, addStage, updateStage, deleteStage, setStageOrder } = stageSlice.actions;

export default stageSlice.reducer;
