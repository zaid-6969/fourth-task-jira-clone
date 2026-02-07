import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showBox: true, // 👈 controls display
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleBox: (state) => {
      state.showBox = !state.showBox;
    },
    show: (state) => {
      state.showBox = true;
    },
    hide: (state) => {
      state.showBox = false;
    },
  },
});

export const { toggleBox, show, hide } = uiSlice.actions;
export default uiSlice.reducer;
