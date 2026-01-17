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
    })
})

export const {useTokenUpdateMutation, useSendBulkMutation} = settingApi