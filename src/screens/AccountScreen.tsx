import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList, getAccountInfo, logoutUser, AccountInfo } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [account, setAccount] = useState<Partial<AccountInfo>>({
    email: '',
    name: '',
    phone: null,
    dob: null,
    address: '',
  });

  const fetchAccountInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      if (!token) {
        Alert.alert('Phiên đăng nhập đã hết hạn', 'Vui lòng đăng nhập lại.');
        navigation.navigate('LoginScreen');
        return;
      }

      const accountInfoResponse = await getAccountInfo();
      const accountInfo = accountInfoResponse.info;

      setAccount({
        email: accountInfo.email || '',
        name: accountInfo.name || '',
        phone: accountInfo.phone ?? null,
        dob: accountInfo.dob ?? null,
        address: accountInfo.address || '',
        role: accountInfo.role,
      });
    } catch (error) {
      console.error('Error fetching account info:', error);
      Alert.alert('Lỗi', 'Không thể lấy thông tin tài khoản. Vui lòng đăng nhập lại.');
      navigation.navigate('LoginScreen');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        <Image source={require('../images/KoiF.png')} style={styles.avatar} />
      </View>
      <View style={styles.infoContainer}>
        {account ? (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.info}>{account.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Họ tên</Text>
              <Text style={styles.info}>{account.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Số điện thoại</Text>
              <Text style={styles.info}>{account.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Ngày sinh</Text>
              <Text style={styles.info}>{account.dob || 'Chưa cập nhật'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Địa chỉ</Text>
              <Text style={styles.info}>{account.address}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        )}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng Xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#FAF4D9',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'center',
  },
  infoContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  info: {
    fontSize: 16,
    color: '#000',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
  },
  logoutButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    marginTop: 15,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AccountScreen;
