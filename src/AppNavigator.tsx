import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoadingPage from './screens/LoadingPage';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import KoiList from './screens/Koi/KoiList';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoadingPage" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LoadingPage" component={LoadingPage} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                <Stack.Screen
                    name="KoiList"
                    component={KoiList}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
