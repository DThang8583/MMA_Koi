import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoadingPage from './screens/LoadingPage';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import AccountScreen from './screens/AccountScreen';
import HomeScreen from './screens/HomeScreen';
import KoiScreen from './screens/KoiScreen';
import KoiDetail from './screens/KoiDetail';
import BlogList from './screens/BlogListScreen';
import BlogDetail from './screens/BlogDetail';



const Stack = createNativeStackNavigator();

const AppNavigator = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoadingPage" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LoadingPage" component={LoadingPage} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                <Stack.Screen name="AccountScreen" component={AccountScreen} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} />
                <Stack.Screen name="KoiScreen" component={KoiScreen} />
                <Stack.Screen name="KoiDetail" component={KoiDetail} />
                <Stack.Screen name="BlogListScreen" component={BlogList} />
                <Stack.Screen name="BlogDetail" component={BlogDetail} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
