import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Button } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Koi, getKoiDetail } from '../services/api';
import { Ionicons } from '@expo/vector-icons'; 

type KoiDetailRouteParams = {
    KoiDetail: {
        id: string;
    };
};

type KoiDetailScreenRouteProp = RouteProp<KoiDetailRouteParams, 'KoiDetail'>;

const KoiDetail: React.FC = () => {
    const route = useRoute<KoiDetailScreenRouteProp>();
    const navigation = useNavigation();
    const { id } = route.params;
    const [koi, setKoi] = useState<Koi | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getKoiDetail(id);
                setKoi(data);
            } catch (error) {
                console.error('Error fetching koi detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!koi) {
        return (
            <View style={styles.container}>
                <Text>Error: Could not load Koi details.</Text>
            </View>
        );
    }

    const handleAddToCart = () => {
        navigation.navigate('CartScreen', { koi });
    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.header}>{koi.name}</Text>
            <Image source={{ uri: koi.image }} style={styles.image} />

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Nguồn gốc:</Text>
                <Text style={styles.value}>{koi.origin}</Text>

                <Text style={styles.label}>Giống:</Text>
                <Text style={styles.value}>{koi.type.name}</Text>

                <Text style={styles.label}>Danh mục:</Text>
                <Text style={styles.value}>{koi.category}</Text>

                <Text style={styles.label}>Tuổi:</Text>
                <Text style={styles.value}>{new Date().getFullYear() - koi.yob} tuổi</Text>

                <Text style={styles.label}>Kích thước:</Text>
                <Text style={styles.value}>{koi.size} cm</Text>

                <Text style={styles.label}>Năm sinh:</Text>
                <Text style={styles.value}>{koi.yob}</Text>

                <Text style={styles.label}>Lượng ăn:</Text>
                <Text style={styles.value}>{koi.feedingAmount} g</Text>

                <Text style={styles.label}>Giới tính:</Text>
                <Text style={styles.value}>{koi.gender === 'Male' ? 'Đực' : 'Cái'}</Text>

                <Text style={styles.label}>Tỉ lệ sàng lọc:</Text>
                <Text style={styles.value}>{koi.screeningRate}%</Text>

                <Text style={styles.label}>Chứng chỉ:</Text>
                {koi.certificates.length > 0 ? (
                    koi.certificates.map((certificate, index) => (
                        <Text key={index} style={styles.value}>{certificate}</Text>
                    ))
                ) : (
                    <Text style={styles.value}>Không có</Text>
                )}

                <Text style={styles.label}>Giá:</Text>
                <Text style={styles.price}>{koi.price.toLocaleString()} đ</Text>

                <Text style={styles.label}>Mô tả:</Text>
                <Text style={styles.description}>{koi.description}</Text>
            </View>

            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FAF8EF',
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 1,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        color: '#333',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    infoContainer: {
        backgroundColor: '#FFFBEA',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    label: {
        fontWeight: 'bold',
        marginTop: 8,
        color: '#6B4226',
    },
    value: {
        fontSize: 16,
        marginBottom: 4,
        color: '#333',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        marginTop: 8,
        color: '#333',
        backgroundColor: '#FBE3D4',
        padding: 8,
        borderRadius: 4,
    },
    addToCartButton: {
        marginTop: 16,
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 25,
    },
    addToCartButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default KoiDetail;
