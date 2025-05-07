import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type UserRole = 'USER' | 'ADMIN';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface UserState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
    token: string | null;
    role: UserRole | null;
}

// Función para cargar el estado inicial desde localStorage
const loadInitialState = (): UserState => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const role = localStorage.getItem('role') as UserRole | null;
    const user = userStr ? JSON.parse(userStr) : null;

    return {
        isAuthenticated: !!token,
        user,
        loading: false,
        error: null,
        token,
        role
    };
};

const userSlice = createSlice({
    name: 'user',
    initialState: loadInitialState(),
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.user.role;
            state.loading = false;
            state.error = null;

            // Guardar en localStorage
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('role', action.payload.user.role);
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
            state.token = null;
            state.role = null;

            // Limpiar localStorage en caso de error
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            state.error = null;
            state.token = null;
            state.role = null;

            // Limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
        },
        updateUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.role = action.payload.role;
            localStorage.setItem('user', JSON.stringify(action.payload));
            localStorage.setItem('role', action.payload.role);
        }
    }
});

export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectUserRole = (state: RootState) => state.user.role;
export const { loginStart, loginSuccess, loginFailure, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;