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
