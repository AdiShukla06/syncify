import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import projectReducer from './projectSlice';
import tasksReducer from './tasksSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    tasks: tasksReducer,
  },
});
