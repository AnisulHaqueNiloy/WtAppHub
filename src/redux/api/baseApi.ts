// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",

    // prepareHeaders: (headers) => {
    //   return headers;
    // },
  }),
  endpoints: () => ({}),
  tagTypes: ["User", "Auth", "Employee", "Salary", "Snacks"],
});