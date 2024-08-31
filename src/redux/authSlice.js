// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    theme: 'dark', // Add theme to the initial state
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.status = 'idle';
    },
    clearUser: (state) => {
      state.user = null;
      state.status = 'idle';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload); // Add this reducer to manage theme
    },
  },
});

export const { setUser, clearUser, setTheme } = authSlice.actions;
export default authSlice.reducer;
