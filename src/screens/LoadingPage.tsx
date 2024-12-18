import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../services/api';


const LoadingPage = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();


    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('LoginScreen');
        }, 3000);


        return () => clearTimeout(timer);
    }, [navigation]);


    return (
        <View style={styles.container}>
            <Image source={require('../images/LogoKoi.png')} style={styles.logo} />
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAF4D9',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 30,
    },
});


export default LoadingPage;