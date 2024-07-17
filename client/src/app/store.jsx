import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import stockReducer from "../features/stockSlice";
import courseReducer from "../features/courseSlice";
import userReducer from "../features/userSlice";
import enrollmentReducer from "../features/enrollmentSlice";
import assignmentReducer from "../features/assignmentSlice";
import exerciseReducer from "../features/exerciseSlice";
import stageReducer from "../features/stageSlice";
import studyReducer from '../features/studySlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage/session"; // session storage

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedReducer,
    stock: stockReducer,
    user: userReducer,
    course: courseReducer,
    enrollment: enrollmentReducer,
    assignment: assignmentReducer,
    exercise: exerciseReducer,
    stage: stageReducer,
    studies: studyReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
