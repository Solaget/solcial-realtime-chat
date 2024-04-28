import api from "../index";
import { logoutUser } from "../../redux/authSlice";

const authService = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credential) => ({
        url: `/auth/login`,
        method: "POST",
        body: credential,
      }),
    }),
    signup: builder.mutation({
      query: (credential) => ({
        url: "/auth/signup",
        method: "POST",
        body: credential,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "DELETE",
      }),
      onQueryStarted: (id, { dispatch, queryFulfilled }) => {
        queryFulfilled
          .then(() => {
            dispatch(logoutUser());
          })
          .catch(() => {
            console.log(err);
          });
      },
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation } =
  authService;
