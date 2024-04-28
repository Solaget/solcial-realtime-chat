import api from "../index.js";

const messageService = api.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (body) => ({
        url: `/message/sendMessage`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["FetchAllChats"],
    }),
    fetchChatMessages: builder.query({
      query: (chatId) => ({
        url: `/message/chatMessages/${chatId}`,
        method: "GET",
      }),
    }),
    deleteSingleMessage: builder.mutation({
      query: (body) => ({
        url: `/message/deleteMessage`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["FetchAllChats"],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useLazyFetchChatMessagesQuery,
  useDeleteSingleMessageMutation
} = messageService;
