import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoadingPage from './screens/LoadingPage';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import AccountScreen from './screens/AccountScreen';
import BlogScreen from './screens/BlogScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoadingPage" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LoadingPage" component={LoadingPage} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                <Stack.Screen name="AccountScreen" component={AccountScreen} />
                <Stack.Screen name="BlogScreen" component={BlogScreen} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
