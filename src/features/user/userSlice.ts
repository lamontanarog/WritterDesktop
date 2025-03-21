import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface userState {
    isAuthenticated: boolean,
    username: string | null,
}

const initialState: userState = {
    isAuthenticated: false,
    username: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        login: (state, action: PayloadAction<string>) => {
            state.isAuthenticated = true;
            state.username = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.username = null;
        }
    }
})

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;