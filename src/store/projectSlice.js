import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    selectedProject: null,
  },
  reducers: {
    setSelectedProject(state, action) {
      state.selectedProject = action.payload;
    },
  },
});

export const { setSelectedProject } = projectSlice.actions;
export default projectSlice.reducer;
