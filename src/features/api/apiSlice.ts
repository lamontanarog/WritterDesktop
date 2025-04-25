import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RegisterCredentials, LoginCredentials, AuthResponse, User } from '../../types/auth';
import { Idea, IdeasResponse } from '../../types/idea';
import { Text, TextsResponse } from '../../types/text';

export const apiSlice = createApi({
    reducerPath: 'api',
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
    tagTypes: ['User', 'Idea', 'Text'],
    endpoints: (builder) => ({
        // Autenticación
        register: builder.mutation<AuthResponse, RegisterCredentials>({
            query: (credentials) => ({
                url: '/api/auth/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        login: builder.mutation<AuthResponse, LoginCredentials>({
            query: (credentials) => ({
                url: '/api/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        getCurrentUser: builder.query<User, void>({
            query: () => '/api/auth/me',
            providesTags: ['User'],
        }),

        // Ideas
        getRandomIdea: builder.query<Idea, void>({
            query: () => '/api/ideas/random',
            providesTags: ['Idea'],
        }),
        getIdeas: builder.query<IdeasResponse, { 
            page?: number; 
            limit?: number; 
            search?: string;
        }>({
            query: ({ page = 1, limit = 10, search }) => ({
                url: '/api/ideas/',
                params: { page, limit, search },
            }),
            providesTags: ['Idea'],
        }),
        getIdeaById: builder.query<Idea, string>({
            query: (id) => `/api/ideas/${id}`,
            providesTags: (result, error, id) => [{ type: 'Idea', id }],
        }),
        createIdea: builder.mutation<Idea, Partial<Idea>>({
            query: (idea) => ({
                url: '/api/ideas/',
                method: 'POST',
                body: idea,
            }),
            invalidatesTags: ['Idea'],
        }),
        updateIdea: builder.mutation<Idea, { id: string; data: Partial<Idea> }>({
            query: ({ id, data }) => ({
                url: `/api/ideas/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Idea', id }],
        }),
        deleteIdea: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/api/ideas/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Idea'],
        }),

        // Textos
        getTexts: builder.query<TextsResponse, { 
            page?: number; 
            limit?: number; 
            ideaId?: string;
            startDate?: string;
            endDate?: string;
        }>({
            query: ({ page = 1, limit = 10, ideaId, startDate, endDate }) => ({
                url: '/api/texts/',
                params: { page, limit, ideaId, startDate, endDate },
            }),
            providesTags: ['Text'],
        }),
        getTextById: builder.query<Text, string>({
            query: (id) => `/api/texts/${id}`,
            providesTags: (result, error, id) => [{ type: 'Text', id }],
        }),
        createText: builder.mutation<Text, Partial<Text>>({
            query: (text) => ({
                url: '/api/texts/',
                method: 'POST',
                body: text,
            }),
            invalidatesTags: ['Text'],
        }),
        updateText: builder.mutation<Text, { id: string; data: Partial<Text> }>({
            query: ({ id, data }) => ({
                url: `/api/texts/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Text', id }],
        }),
        deleteText: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/api/texts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Text'],
        }),
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetCurrentUserQuery,
    useGetRandomIdeaQuery,
    useGetIdeasQuery,
    useGetIdeaByIdQuery,
    useCreateIdeaMutation,
    useUpdateIdeaMutation,
    useDeleteIdeaMutation,
    useGetTextsQuery,
    useGetTextByIdQuery,
    useCreateTextMutation,
    useUpdateTextMutation,
    useDeleteTextMutation,
} = apiSlice; 