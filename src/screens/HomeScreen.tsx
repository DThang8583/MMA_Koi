
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

interface Blog {
  id: string;
  title: string;
  imageUrl: string;
}

interface BlogCardProps {
  imageUrl: string;
  title: string;
  onPress: () => void;
}

const HomeScreen = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://192.168.1.6:8000/api/post/ ');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const BlogCard: React.FC<BlogCardProps> = ({ imageUrl, title, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.card}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.details}>Xem Chi Tiết &gt;&gt;</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Chào mừng,</Text>
        <Text style={styles.username}>KOI user</Text>
        <View style={styles.headerContent}>
          <Image source={require('../images/LogoKoi.png')} style={styles.logo} />
        </View>
        <View style={styles.navigationIcons}>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="create-outline" size={24} color="black" />
            <Text style={styles.navText}>Đăng ký xử lý</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="settings-outline" size={24} color="black" />
            <Text style={styles.navText}>Quản lý xử lý</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="call-outline" size={24} color="black" />
            <Text style={styles.navText}>Hotline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="people-outline" size={24} color="black" />
            <Text style={styles.navText}>CSKH</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="gray" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
      </View>
      {/* Search Bar */}


      {/* Blog Section */}
      <View style={styles.blogSection}>
        <Text style={styles.blogTitle}>Blogs</Text>
        {blogs
          .filter(blog => blog.title.toLowerCase().includes(searchText.toLowerCase()))
          .map((blog, index) => (
            <BlogCard
              key={index}
              imageUrl={blog.imageUrl}
              title={blog.title}
              onPress={() => {
                console.log(`Navigating to blog ${blog.id}`);
              }}
            />
          ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF4D9',
  },
  header: {
    backgroundColor: '#F7C8A0',
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,

  },
  logo: {
    width: 50,
    height: 50,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
  },
  mailIcon: {
    marginRight: 10,
  },
  headerPromoContainer: {
    marginTop: 15,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  promoNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    flex: 1,
  },
  promoImage: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  navigationIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    paddingVertical: 15,
    marginTop: 15,
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    marginTop: 5,
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    marginTop: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  blogSection: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  blogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  footerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#B3E283',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  textContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#4CAF50',
  },
});

export default HomeScreen;
