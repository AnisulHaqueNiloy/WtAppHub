import { baseApi } from "../../api/baseApi";
interface TokenUpdateRequest {
  waToken: string;
}
const settingApi= baseApi.injectEndpoints({
    endpoints:(builder)=>({
        tokenUpdate: builder.mutation<void,TokenUpdateRequest>({
            query:(TokenUpdateRequest)=>({
                 url:'/user/setting',
            method:'PATCH',
            body:TokenUpdateRequest
            }),
            invalidatesTags: ['User'],
        }),

        sendBulk: builder.mutation({
      query: (body) => ({
        url: '/message/send-bulk',
        method: 'POST',
        body,
      }),
       invalidatesTags: ['Message'],
    }),

     getSessionStatus: builder.query<{ success: boolean; status: string; number: string }, void>({
      query: () => ({
        url: '/session/status', // backend router link
        method: 'GET',
      }),
     
     
      providesTags: ['Session'],
    }),


    getAnalytics: builder.query({
      query: () => ({
        url: '/message/analytics',
        method: 'GET',
      }),
      providesTags: ['Message'],  
    }),
    })
})

export const {useTokenUpdateMutation, useSendBulkMutation, useGetSessionStatusQuery,useGetAnalyticsQuery} = settingApi