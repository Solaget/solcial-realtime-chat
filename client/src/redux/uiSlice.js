import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "dark",
};

const uiSlice = createSlice({
  initialState,
  name: "ui",
  reducers: {
    changeTheme: (state, { payload }) => {
      if (payload === "dark") {
        state.theme = "dark";
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else if (payload === "light") {
        state.theme = "light";
        localStorage.setItem("theme", "light");
        document.documentElement.classList.remove("dark");
      } else if (payload === "system") {
        state.theme = "system";
        localStorage.setItem("theme", "system");
        document.documentElement.classList.remove("dark");
      }
    },
  },
});

export default uiSlice;
export const { changeTheme } = uiSlice.actions;
