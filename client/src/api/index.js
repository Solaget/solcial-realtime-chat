import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,
  tagTypes: ["FetchAllChats"],
  baseQuery: fetchBaseQuery({
    // baseUrl: import.meta.env.VITE_SERVER_URL,
    baseUrl: "http://localhost:8080",
    credentials: "include",
  }),
  endpoints: (builder) => ({}),
});

export default api;
