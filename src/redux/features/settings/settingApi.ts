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
      providesTags: ( sessionId) => [
        { type: "WhatsAppSession", id: sessionId },
      ],
    }),

    deleteSession: builder.mutation({
      query: (sessionId) => ({
        url: `/wa/session/${sessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WhatsAppSession"],
    }),

    getsessionlist: builder.query({
      query: () => ({
        url: "/wa/whatsapp-sessions",
        method: "GET",
      }),
      providesTags: ["WhatsAppSession"],
    }),

    getSessionStatus: builder.query<
      {
        success: boolean;
        status: string;
        number: string;
        api_Key?: string;
        id: string;
      },
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
  useGetsessionlistQuery,
  useDeleteSessionMutation,
} = settingApi;
