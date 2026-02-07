import { createSlice } from "@reduxjs/toolkit";

const kanbanSlice = createSlice({
  name: "kanban",
  initialState: {
    columns: [],
  },
  reducers: {
    setColumns: (state, action) => {
      state.columns = action.payload;
    },
    resetKanban: (state) => {
      state.columns = [];
    },
  },
});

export const { setColumns, resetKanban } = kanbanSlice.actions;
export default kanbanSlice.reducer;