import { baseApi } from "../../api/baseApi";
interface TokenUpdateRequest {
  waToken: string;
}
const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    tokenUpdate: builder.mutation<void, TokenUpdateRequest>({
      query: (TokenUpdateRequest) => ({
        url: "/user/setting",
        method: "PATCH",
        body: TokenUpdateRequest,
      }),
      invalidatesTags: ["User"],
    }),

    sendBulk: builder.mutation({
      query: (body) => ({
        url: "/message/send-bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Message"],
    }),

    createSession: builder.mutation({
      query: (data) => ({
        url: "/wa/session/create",
        method: "POST",
        body: data, // { name, phoneNumber }
      }),
      invalidatesTags: ["WhatsAppSession"],
    }),

    connectSession: builder.mutation({
      query: (data) => ({
        url: "/wa/session/connect",
        method: "POST",
        body: data, // { sessionId }
      }),
      invalidatesTags: ["WhatsAppSession"],
    }),

    SessionStatus: builder.query({
      query: (sessionId) => `/wa/session/status/${sessionId}`,
      providesTags: (result, error, sessionId) => [
        { type: "WhatsAppSession", id: sessionId },
      ],
    }),

    getSessionStatus: builder.query<
      { success: boolean; status: string; number: string },
      void
    >({
      query: () => ({
        url: "/session/status", // backend router link
        method: "GET",
      }),

      providesTags: ["Session"],
    }),

    getAnalytics: builder.query({
      query: () => ({
        url: "/message/analytics",
        method: "GET",
      }),
      providesTags: ["Message"],
    }),
  }),
});

export const {
  useTokenUpdateMutation,
  useSendBulkMutation,
  useGetSessionStatusQuery,
  useGetAnalyticsQuery,
  useCreateSessionMutation,
  useConnectSessionMutation,
  useSessionStatusQuery,
} = settingApi;
