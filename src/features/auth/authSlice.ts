import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://writterdesktopbackend.onrender.com',
        prepareHeaders: (headers, { getState }) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        register: builder.mutation<AuthResponse, RegisterCredentials>({
            query: (credentials) => ({
                url: '/api/auth/register',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        login: builder.mutation<AuthResponse, LoginCredentials>({
            query: (credentials) => ({
                url: '/api/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
        }),
        getCurrentUser: builder.query<User, void>({
            query: () => '/api/auth/me',
            providesTags: ['Auth'],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetCurrentUserQuery,
} = authApi; 