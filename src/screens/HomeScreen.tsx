import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { getBlogs, Blog } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../services/api';



type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

const HomeScreen = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getBlogs();
      console.log(data);
      setBlogs(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi tải blogs:', err);
      setBlogs([]);
      setError('Không thể tải blogs. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchBlogs} style={styles.retryButton}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../images/LogoKoi.png')} style={styles.logo} />
          <Text style={styles.greeting}>Chào mừng,</Text>
          <Text style={styles.username}>KOI user</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="gray" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Blog Section */}
        <View style={styles.blogSection}>
          <View style={styles.blogHeader}>
            <Text style={styles.blogTitle}>Blogs</Text>
            <TouchableOpacity onPress={() => navigation.navigate('BlogListScreen')}>
            <Text style={styles.moreBlogs}>More Blogs &gt;&gt;</Text>
          </TouchableOpacity>
          </View>
          {blogs
  .filter(blog => blog.title.toLowerCase().includes(searchText.toLowerCase()))
  .map((blog) => (
    <TouchableOpacity key={blog._id} onPress={() => navigation.navigate('BlogDetail', { _id: blog._id })}  style={styles.card}>
      <Image source={{ uri: blog.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{blog.title}</Text>
        <Text style={styles.description} numberOfLines={3}>
          {blog.description}
        </Text>                
        <Text style={styles.details}>Xem Chi Tiết &gt;&gt;</Text>
      </View>
    </TouchableOpacity>
  ))}
        </View>
      </ScrollView>

      {/* Footer Navigation */}
      <View style={styles.footerIcons}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="create-outline" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="fish-outline" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={28} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4DB',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#F7C8A0',
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  blogSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  blogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  blogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  moreBlogs: {
    fontSize: 14,
    color: '#4CAF50',
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  footerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#B3E283',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});

export default HomeScreen;
