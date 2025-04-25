import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Idea, IdeasResponse } from '../../types/idea';

interface WrittenText {
    ideaId: number,
    title: string,
    content: string,
    time: number,
    counter: number

}


interface IdeasState {
    ideas: Idea[],
    selectedIdea: Idea | null,
    savedTexts: WrittenText[]
}

const initialState: IdeasState = {
    ideas: [],
    selectedIdea: null,
    savedTexts: []
}

const ideasSlice = createSlice({
    name: 'ideas',
    initialState,
    reducers: {
        setIdeas: (state, action: PayloadAction<Idea[]>) => {
            state.ideas = action.payload;
        },
        addIdea: (state, action: PayloadAction<Idea>) => {
            state.ideas.push(action.payload);
        },
        saveText: (state, action: PayloadAction<WrittenText>) => {
            state.savedTexts.push(action.payload);
        },
        selectIdea: (state, action: PayloadAction<Idea>) => {
            state.selectedIdea = action.payload;
        },
        deleteText: (state, action: PayloadAction<number>) => {
            state.savedTexts.splice(action.payload, 1);
        },
        editText: (state, action: PayloadAction<{ index: number, newText: string }>) => {
            state.savedTexts[action.payload.index].content = action.payload.newText;
        }
    }
})

export const { setIdeas, addIdea, saveText, selectIdea, deleteText, editText } = ideasSlice.actions;
export default ideasSlice.reducer;

export const ideasApi = createApi({
    reducerPath: 'ideasApi',
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
    tagTypes: ['Idea'],
    endpoints: (builder) => ({
        getRandomIdea: builder.query<Idea, void>({
            query: () => '/api/ideas/random',
            providesTags: ['Idea'],
        }),
        getIdeas: builder.query<IdeasResponse, { page?: number; limit?: number; search?: string }>({
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
        deleteIdea: builder.mutation<void, string>({
            query: (id) => ({
                url: `/api/ideas/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Idea'],
        }),
    }),
});

export const {
    useGetRandomIdeaQuery,
    useGetIdeasQuery,
    useGetIdeaByIdQuery,
    useCreateIdeaMutation,
    useUpdateIdeaMutation,
    useDeleteIdeaMutation,
} = ideasApi;