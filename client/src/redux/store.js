import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import uiSlice from "./uiSlice";
import api from "../api/index";

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
