// Koi details interface
export interface Koi {
    id: string;
    name: string;
    type: string;
    age: string;
    size: string;
    gender: string;
    price: string;
    imageUrl: string;
}

// User details interface
export interface User {
    id: string;
    name: string;
    email: string;
}

// Define RootStackParamList for navigation
export type RootStackParamList = {
    LoadingPage: undefined;
    LoginScreen: undefined;
    SignUpScreen: undefined;
    KoiList: undefined;
};

// New interfaces for API responses
export interface ApiResponse {
    token: string;
    [key: string]: any;
}

export interface UserResponse {
    [key: string]: any; // Define fields based on API response
}
