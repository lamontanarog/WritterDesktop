import { configureStore } from "@reduxjs/toolkit";
import ideasReducer from "../features/ideas/ideasSlice";
import userReducer from "../features/user/userSlice";


export const store = configureStore({
    reducer: {
        ideas: ideasReducer,
        user: userReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;