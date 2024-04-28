import { loginUser, logoutUser } from "@/redux/authSlice";
import api from "../index";

const accountService = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchCurrentAccount: builder.query({
      query: () => ({
        url: `/account/me`,
      }),
      providesTags: ["AuthUserProfile"],
      onQueryStarted: (id, { dispatch, queryFulfilled }) => {
        queryFulfilled
          .then(({ data }) => {
            dispatch(loginUser({ authInfo: data }));
          })
          .catch((error) => {});
      },
    }),

    changePassword: builder.mutation({
      query: (body) => ({
        url: "/account/privacy/password",
        method: "PATCH",
        body: { ...body },
      }),
    }),

    deleteAccount: builder.mutation({
      query: (body) => ({
        url: "/account/deleteAccount",
        method: "DELETE",
        body,
      }),
      onQueryStarted: (id, { dispatch, queryFulfilled }) => {
        queryFulfilled
          .then(({ data }) => {
            if (!data.status === "success") {
              throw new Error();
            }

            dispatch(logoutUser());
          })
          .catch((error) => {
            console.log("error occured when deleting user profile", error);
          });
      },
    }),
  }),
});

export const {
  useLazyFetchCurrentAccountQuery,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = accountService;
