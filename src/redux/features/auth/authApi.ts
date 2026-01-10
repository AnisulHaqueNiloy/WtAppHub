 
import { baseApi } from "../../api/baseApi"

interface RegisterUser {
    name:string,
    email:string,
    password:string

}

const authAPi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        register: builder.mutation<void,RegisterUser>({
          query:(userInfo)=>({
              url:'/auth/register',
            method:'POST',
            body:userInfo
          })
        }),

        login:builder.mutation({
            query:(userInfo)=>({
                url:'/auth/login',
                method:"POST",
                body:userInfo
            })
        })
    })
})


export const {useLoginMutation,useRegisterMutation} = authAPi