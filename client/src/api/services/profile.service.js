import { loginUser } from "../../redux/authSlice";
import api from "../index";

const profileService = api.injectEndpoints({
  endpoints: (builder) => ({
    updateEmail: builder.mutation({
      query: (body) => ({
        url: "/profile/email",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AuthUserProfile"],
    }),
    updateBio: builder.mutation({
      query: (body) => ({
        url: "/profile/bio",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AuthUserProfile"],
    }),
    updateFullname: builder.mutation({
      query: (body) => ({
        url: "/profile/fullName",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AuthUserProfile"],
    }),

    updateAvatar: builder.mutation({
      query: (body) => ({
        url: "/profile/avatar",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["AuthUserProfile"],
    }),

    removeAvatar: builder.mutation({
      query: (body) => ({
        url: "/profile/avatar",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["AuthUserProfile"],
    }),
  }),
});

export const {
  useUpdateEmailMutation,
  useUpdateBioMutation,
  useUpdateFullnameMutation,
  useUpdateAvatarMutation,
  useRemoveAvatarMutation,
} = profileService;
