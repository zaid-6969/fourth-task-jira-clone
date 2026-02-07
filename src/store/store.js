import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import uiReducer from "./uiSlice";
import moduleReducer from "./module";
import kanbanReducer from "./kanbanSlice";
import projectReducer from "./projectSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    ui: uiReducer,
    module: moduleReducer,
    kanban: kanbanReducer,
    project: projectReducer,
    theme: themeReducer,
  },
});
