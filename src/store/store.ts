import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authSlice';
import { ideasApi } from '../features/ideas/ideasSlice';
import { textsApi } from '../features/texts/textsSlice';

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [ideasApi.reducerPath]: ideasApi.reducer,
        [textsApi.reducerPath]: textsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            ideasApi.middleware,
            textsApi.middleware
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 