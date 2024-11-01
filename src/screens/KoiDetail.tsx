import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Koi, getKoiDetail, postComment } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

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
    const [newComment, setNewComment] = useState<string>('');
    const [newRating, setNewRating] = useState<number>(0);
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

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

    const handleCommentSubmit = async () => {
        if (!userLoggedIn) {
            Alert.alert('Cảnh báo', 'Bạn cần đăng nhập để viết bình luận.');
            return;
        }

        if (newRating <= 0 || newRating > 5 || newComment.trim() === '') {
            Alert.alert('Thông báo', 'Vui lòng nhập đánh giá hợp lệ và nội dung bình luận.');
            return;
        }

        // Check if user already commented
        const userCommented = koi?.comments.some(comment => comment.author === "YOUR_USER_ID"); // Replace with actual user ID
        if (userCommented) {
            Alert.alert('Thông báo', 'Bạn đã bình luận trước đó. Chỉ cho phép một bình luận cho mỗi cá.');
            return;
        }

        try {
            await postComment(id, newRating, newComment);
            Alert.alert('Thành công', 'Bình luận của bạn đã được gửi.');
            setNewComment('');
            setNewRating(0);
            setIsModalVisible(false); // Close the modal

            const updatedKoi = await getKoiDetail(id);
            setKoi(updatedKoi);
        } catch (error) {
            console.error('Error submitting comment:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi gửi bình luận.');
        }
    };

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

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.header}>{koi.name}</Text>
            <Image source={{ uri: koi.image }} style={styles.image} />

            <View style={styles.infoContainer}>
                <Text style={styles.label}>Nguồn gốc:</Text>
                <Text style={styles.value}>{koi.type.origin}</Text>

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

            <View style={styles.commenthead}>
                <Text style={styles.label}>Bình luận:</Text>
                <Button title="Thêm bình luận" onPress={() => setIsModalVisible(true)} />
            </View>
            {!koi.comments.length ? (
                <Text style={styles.value}>Không có bình luận nào</Text>
            ) : (
                koi.comments.map((comment) => (
                    <ScrollView>
                        <View key={comment._id} style={styles.commentContainer}>
                            <Text style={styles.commentRating}> {comment.author.name}</Text>
                            <Text style={styles.commentRating}>Đánh giá: {comment.rating}/5</Text>
                            <Text style={styles.commentContent}>Nội dung: {comment.content}</Text>
                            <Text style={styles.commentDate}>Ngày: {new Date(comment.createdAt).toLocaleDateString()}</Text>
                        </View>
                    </ScrollView>
                ))
            )}

            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Viết bình luận..."
                        value={newComment}
                        onChangeText={setNewComment}
                    />
                    <TextInput
                        style={styles.ratingInput}
                        placeholder="Đánh giá (1-5)"
                        keyboardType="numeric"
                        value={newRating ? newRating.toString() : ''}
                        onChangeText={(text) => setNewRating(Number(text))}
                    />
                    <View style={styles.btn}>
                        <Button title="Gửi bình luận" onPress={handleCommentSubmit} />
                    </View>
                    <Button title="Đóng" onPress={() => setIsModalVisible(false)} />
                </View>
            </Modal>
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
        resizeMode: 'contain',
    },
    infoContainer: {
        backgroundColor: '#FFFBEA',
        padding: 16,
        borderRadius: 8,
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
    commentContainer: {
        marginTop: 12,
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        marginBottom: 50,
    },
    commentRating: {
        fontSize: 14,
        color: '#555',
    },
    commentContent: {
        fontSize: 14,
        color: '#333',
        marginVertical: 4,
    },
    commentDate: {
        fontSize: 12,
        color: '#777',
    },
    commentInputContainer: {
        marginTop: 16,
        padding: 8,
        backgroundColor: '#FFFBEA',
        borderRadius: 8,
    },
    commentInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        marginBottom: 8,
    },
    ratingInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        marginBottom: 8,
    },
    addToCartButton: {
        marginTop: 16,
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    addToCartButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    commenthead: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btn: {
        marginBottom: 10,
    }
});

export default KoiDetail;
