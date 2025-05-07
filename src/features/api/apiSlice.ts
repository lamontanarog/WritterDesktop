import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../../types/auth';
import { Idea, IdeasResponse } from '../../types/idea';
import { Text, TextsResponse } from '../../types/text';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://writterdesktopbackend-production.up.railway.app',
    prepareHeaders: (headers) => {
     const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Idea', 'Text'],
  endpoints: (builder) => ({

    // 🔐 AUTENTICACIÓN
    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => '/api/auth/me',
      providesTags: ['User'],
    }),

    // 💡 IDEAS
    getRandomIdea: builder.query<Idea, void>({
      query: () => '/api/ideas/random',
      providesTags: ['Idea'],
    }),

    getIdeas: builder.query<IdeasResponse, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search }) => ({
        url: '/api/ideas',
        params: { page, limit, search },
      }),
      providesTags: ['Idea'],
    }),

    getIdeaById: builder.query<Idea, string>({
      query: (id) => `/api/ideas/${id}`,
      providesTags: (result, error, id) => [{ type: 'Idea', id, result, error }],
    }),

    createIdea: builder.mutation<Idea, Partial<Idea>>({
      query: (idea) => ({
        url: '/api/ideas',
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
      invalidatesTags: (result, error, { id }) => [{ type: 'Idea', id, result, error }],
    }),
    deleteIdea: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/api/ideas/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Idea'],
    }),
    // 📝 TEXTOS
    getTexts: builder.query<TextsResponse, { page?: number; limit?: number; ideaId?: string; startDate?: string; endDate?: string }>({
      query: ({ page = 1, limit = 10, ideaId, startDate, endDate }) => ({
        url: '/api/texts',
        params: { page, limit, ideaId, startDate, endDate },
      }),
      providesTags: ['Text'],
    }),

    getTextById: builder.query<Text, string>({
      query: (id) => `/api/texts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Text', id, result, error }],
    }),

    createText: builder.mutation<Text, Partial<Text>>({
      query: (text) => ({
        url: '/api/texts',
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
      invalidatesTags: (result, error, { id }) => [{ type: 'Text', id, result, error }],
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
  // Auth
  useRegisterMutation,
  useLoginMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  // Ideas
  useGetRandomIdeaQuery,
  useGetIdeasQuery,
  useGetIdeaByIdQuery,
  useCreateIdeaMutation,
  useUpdateIdeaMutation,
  useDeleteIdeaMutation,
  // Texts
  useGetTextsQuery,
  useGetTextByIdQuery,
  useCreateTextMutation,
  useUpdateTextMutation,
  useDeleteTextMutation,
} = apiSlice;
