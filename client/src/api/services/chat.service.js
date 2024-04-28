import api from "../index.js";

const chatService = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchChats: builder.query({
      query: () => ({
        url: `/chat/fetchChats`,
        method: "GET",
      }),
      providesTags: ["FetchAllChats"],
    }),
    accessChat: builder.mutation({
      query: (userId) => ({
        url: `/chat/accessChat`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["FetchAllChats"],
    }),
    fetchSingleChat: builder.query({
      query: (chatId) => ({
        url: `/chat/singleChat/${chatId}`,
        method: "GET",
      }),
    }),
    toggleFavoriteChat: builder.mutation({
      query: (body) => ({
        url: `/chat/toggleFavorite`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["FetchAllChats"],
    }),
    // group endpoints
    createGroupChat: builder.mutation({
      query: (body) => ({
        url: `/chat/createGroup`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["FetchAllChats"],
    }),
    leaveGroupChat: builder.mutation({
      query: (chatId) => ({
        url: `/chat/group/leaveGroup`,
        method: "DELETE",
        body: { chatId },
      }),
      invalidatesTags: ["FetchAllChats"],
    }),
    removeUserFromGroup: builder.mutation({
      query: (body) => ({
        url: `/chat/group/removeUser`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["FetchAllChats"],
    }),
    deleteGroup: builder.mutation({
      query: (body) => ({
        url: `/chat/group/deletegroup`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["FetchAllChats"],
    }),
    addMemberToGroup: builder.mutation({
      query: (body) => ({
        url: `/chat/group/addMember`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["FetchAllChats"],
    }),
    editGroupProfile: builder.mutation({
      query: (body) => ({
        url: `/chat/group/editProfile`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["FetchAllChats"],
    }),
    addAdminToGroup: builder.mutation({
      query: (body) => ({
        url: `/chat/group/addAdmin`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["FetchAllChats"],
    }),
  }),
});

export const {
  useFetchChatsQuery,
  useAccessChatMutation,
  useToggleFavoriteChatMutation,
  useCreateGroupChatMutation,
  useLazyFetchSingleChatQuery,
  useLeaveGroupChatMutation,
  useEditGroupProfileMutation,
  useRemoveUserFromGroupMutation,
  useAddAdminToGroupMutation,
  useAddMemberToGroupMutation,
  useDeleteGroupMutation
} = chatService;
