import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Koi } from '../../types';

interface KoiCardProps {
    koi: Koi;
}

const KoiCard: React.FC<KoiCardProps> = ({ koi }) => {
    return (
        <View style={styles.card}>
            <Image source={{ uri: koi.imageUrl }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name}>{koi.name}</Text>
                <Text>Giống: {koi.type}</Text>
                <Text>Tuổi: {koi.age} - Kích thước: {koi.size}</Text>
                <Text>Giới tính: {koi.gender}</Text>
                <Text style={styles.price}>{koi.price}đ</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    price: {
        fontSize: 16,
        color: 'red',
        marginTop: 4,
    },
});

export default KoiCard;
