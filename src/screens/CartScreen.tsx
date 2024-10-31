import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Koi } from '../services/api';

type CartScreenRouteParams = {
    CartScreen: {
        koi?: Koi;
    };
};

type CartScreenRouteProp = RouteProp<CartScreenRouteParams, 'CartScreen'>;

const CartScreen: React.FC = () => {
    const route = useRoute<CartScreenRouteProp>();
    const [cartItems, setCartItems] = useState<Koi[]>([]);

    useEffect(() => {
        if (route.params?.koi) {
            const koiItem = route.params.koi;
            setCartItems((prevItems) => [...prevItems, koiItem]);
        }
    }, [route.params?.koi]);

    const renderCartItem = ({ item }: { item: Koi }) => (
        <View style={styles.cartItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price.toLocaleString()} đ</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Giỏ hàng của bạn</Text>
            {cartItems.length > 0 ? (
                <FlatList
                    data={cartItems}
                    renderItem={renderCartItem}
                    keyExtractor={(item) => item.fishId} 
                />
            ) : (
                <Text style={styles.emptyMessage}>Giỏ hàng trống</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FAF8EF',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    cartItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 16,
        color: 'red',
    },
    emptyMessage: {
        fontSize: 18,
        textAlign: 'center',
        color: '#555',
        marginTop: 50,
    },
});

export default CartScreen;
