// src/redux/projectSlice.js
import { createSlice } from '@reduxjs/toolkit';

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [], // List of projects
    currentProject: null // The project currently selected
  },
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
    addProject: (state, action) => {
      state.projects.push(action.payload);
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    }
  }
});

export const { setProjects, addProject, setCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
