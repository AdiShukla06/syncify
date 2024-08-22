import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    allTasks: [],
    status: 'idle',
  },
  reducers: {
    setTasks: (state, action) => {
      state.allTasks = action.payload;
      state.status = 'idle';
    },
    addTask: (state, action) => {
      state.allTasks.push(action.payload);
      state.status = 'idle';
    },
    updateTask: (state, action) => {
      const { id, updates } = action.payload;
      const taskIndex = state.allTasks.findIndex(task => task.id === id);
      if (taskIndex >= 0) {
        state.allTasks[taskIndex] = { ...state.allTasks[taskIndex], ...updates };
      }
      state.status = 'idle';
    },
    deleteTask: (state, action) => {
      state.allTasks = state.allTasks.filter(task => task.id !== action.payload);
      state.status = 'idle';
    },
  },
});

export const { setTasks, addTask, updateTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
