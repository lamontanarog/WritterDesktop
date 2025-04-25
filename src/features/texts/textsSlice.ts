import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Text, TextsResponse } from '../../types/text';

export const textsApi = createApi({
    reducerPath: 'textsApi',
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
    tagTypes: ['Text'],
    endpoints: (builder) => ({
        getTexts: builder.query<TextsResponse, { 
            page?: number; 
            limit?: number; 
            ideaId?: string; 
            startDate?: string; 
            endDate?: string 
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
        deleteText: builder.mutation<void, string>({
            query: (id) => ({
                url: `/api/texts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Text'],
        }),
    }),
});

export const {
    useGetTextsQuery,
    useGetTextByIdQuery,
    useCreateTextMutation,
    useUpdateTextMutation,
    useDeleteTextMutation,
} = textsApi; 