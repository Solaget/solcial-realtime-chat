import api from "../index";

const contactService = api.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query({
      query: () => ({
        url: `/contacts`,
        method: "GET",
      }),
      providesTags: ["Contacts"],
    }),
    addUserToContact: builder.mutation({
      query: (body) => ({
        url: `/contacts/add`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contacts"],
    }),
    removeUserFromContact: builder.mutation({
      query: (body) => ({
        url: `/contacts/remove`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Contacts"],
    }),
  }),
});

export const {
  useGetContactsQuery,
  useAddUserToContactMutation,
  useRemoveUserFromContactMutation,
} = contactService;
