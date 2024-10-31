import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBlogDetail } from '../services/api';

type BlogDetailRouteProp = RouteProp<{ params: { _id: string } }, 'params'>;

const BlogDetail: React.FC = () => {
  const route = useRoute<BlogDetailRouteProp>();
  const navigation = useNavigation();
  const { _id } = route.params;

  const [blog, setBlog] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saveBlogIdToStorage = async () => {
      if (_id) {
        try {
          await AsyncStorage.setItem('selectedBlogId', _id);
          console.log('Blog ID saved to AsyncStorage:', _id);
        } catch (error) {
          console.error('Error saving blog ID to AsyncStorage:', error);
        }
      } else {
        console.error('Blog ID is undefined. Cannot save to AsyncStorage.');
      }
    };

    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        const data = await getBlogDetail(_id);
        setBlog(data.postInfo);
        console.log("Fetched Data:", data);
        await saveBlogIdToStorage();
      } catch (error) {
        console.error('Error fetching blog detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetail();
  }, [_id]);

  const handleKoiPress = (fishId: string) => {
    navigation.navigate('KoiDetail', { id: fishId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!blog) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Không thể tải chi tiết bài viết.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>
      
      <Image source={{ uri: blog.image }} style={styles.image} resizeMode="contain" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{blog.title}</Text>
        <Text style={styles.description}>{blog.description}</Text>

        {/* Fish Image Card */}
        {blog.fish && (
          <TouchableOpacity style={styles.fishCard} onPress={() => handleKoiPress(blog.fish._id)}>
            <Image source={{ uri: blog.fish.image }} style={styles.fishImageOnly} />
            <Text style={styles.fishName}>{blog.fish.name}</Text>
            <Text style={styles.viewSource}>Nguồn gốc</Text>
            <Text style={styles.viewSource1}>Xem chi tiết</Text>

          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF4D9',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginBottom: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  textContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'justify',
  },
  fishCard: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  fishImageOnly: {
    width: 120,  // Giảm kích thước width
    height: 120, // Giảm kích thước height
    borderRadius: 10,
  },
  fishName: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  viewSource: {
    marginTop: 4,
    fontSize: 20,
    color: '#666',
  },
  viewSource1: {
    marginTop: 4,
    fontSize: 20,
    color: '#666',
    
  },
});

export default BlogDetail;
