import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoadingPage from './screens/LoadingPage';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoadingPage" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LoadingPage" component={LoadingPage} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
