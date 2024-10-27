import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoadingPage from './screens/LoadingPage';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import KoiList from './screens/Koi/KoiList';
import { getUserInfo } from './services/api';
import { User } from './types';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user: User = await getUserInfo();
                setUserName(user.name);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoadingPage" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LoadingPage" component={LoadingPage} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                <Stack.Screen
                    name="KoiList"
                    options={{
                        headerShown: true,
                        title: userName ? `Chào mừng, ${userName}` : 'Koi List'
                    }}
                    component={KoiList}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
