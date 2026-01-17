import { baseApi } from "../../api/baseApi";
interface MessageHistoryResponse {
  success: boolean;
  history: {
    phoneNumber: string;
    messageContent: string;
    status: string;
    sentAt: string;
  }[];
}
const settingApi= baseApi.injectEndpoints({
    endpoints:(builder)=>({
   getHistory: builder.query<MessageHistoryResponse, void>({
      query: () => ({
        url: '/message/history',
        method: 'GET',
      }),
      providesTags: ['Message'], 
    }),
    })
})

export const {useGetHistoryQuery} = settingApi