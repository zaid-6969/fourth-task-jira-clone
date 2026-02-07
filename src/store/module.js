import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showModule: false,
};

const uiSlice = createSlice({
  name: "module",
  initialState,
  reducers: {
    toggleModule: (state) => {
      state.showModule = !state.showModule;
    },
    show: (state) => {
      state.showModule = true;
    },
    hide: (state) => {
      state.showModule = false;
    },
  },
});

export const { toggleModule, show, hide } = uiSlice.actions;
export default uiSlice.reducer;
