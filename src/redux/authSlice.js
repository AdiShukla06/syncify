// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
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
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
