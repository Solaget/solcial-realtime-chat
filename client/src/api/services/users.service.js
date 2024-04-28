import api from "../index.js";

const usersService = api.injectEndpoints({
  endpoints: (builder) => ({
    serachUsers: builder.query({
      query: (query) => ({
        url: `/users/search?q=${query}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useLazySerachUsersQuery } = usersService;
