import { CreateApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://writterdesktopbackend.onrender.com/",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).auth.token;
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getUser : builder.query({
            query : () => "/auth/me"
        }),
        loginUser : builder.mutation({
            query : (credentials) => ({
                url : "/auth/login",
                method : "POST",
                body : credentials
            })
        }),
        registerUser : builder.mutation({
            query : (credentials) => ({
                url : "/auth/register",
                method : "POST",
                body : credentials
            })
        }),
    })
});


export const { useGetUserQuery, useLoginUserMutation, useRegisterUserMutation } = apiSlice