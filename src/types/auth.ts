export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    token: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
} 