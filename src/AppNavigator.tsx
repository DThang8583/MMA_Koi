import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoadingPage from './screens/LoadingPage';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import KoiDetail from './screens/KoiDetail';
import AccountScreen from './screens/AccountScreen';
import MainTabs from './screens/MainTabs';
import BlogList from './screens/BlogListScreen';
import BlogDetail from './screens/BlogDetail';
import CartScreen from './screens/CartScreen';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoadingPage" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="LoadingPage" component={LoadingPage} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen name="KoiDetail" component={KoiDetail} />
                <Stack.Screen name="BlogListScreen" component={BlogList} />
                <Stack.Screen name="BlogDetail" component={BlogDetail} />
                <Stack.Screen name="Cart" component={CartScreen} />
                <Stack.Screen name="Account" component={AccountScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;


