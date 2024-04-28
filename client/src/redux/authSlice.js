import { createSlice } from "@reduxjs/toolkit";
import Cookie from "js-cookie";

const initialState = {
  token: "",
  isLogedin: false,
  authInfo: {},
  isLoading: false,
  isError: false,
};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    loginUser: (state, action) => {
      const token = Cookie.get("token");
      const authInfo = action.payload.authInfo;
      state.token = token;
      state.authInfo = authInfo;
      if (token) state.isLogedin = true;
    },
    logoutUser: (state, action) => {
      state.token = null;
      state.isLogedin = false;
      state.authInfo = {};
    },
  },
});

export default authSlice;
export const { loginUser, logoutUser } = authSlice.actions;
