import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { getAccountInfo, AccountInfo, logoutUser } from '../services/api';
import { RootStackParamList } from '../services/api'; // Cập nhật đường dẫn tới RootStackParamList

const AccountScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      setLoading(true);
      try {
        const data = await getAccountInfo();
        setAccount(data.info);
      } catch (error: any) {
        if (error.message === 'Token not found') {
          Alert.alert('Lỗi', 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          await AsyncStorage.removeItem('token');
          navigation.navigate('LoginScreen');
        } else {
          Alert.alert('Lỗi', error.message || 'Không thể lấy thông tin tài khoản');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      Alert.alert('Thông báo', 'Bạn đã đăng xuất');
      navigation.navigate('LoginScreen'); // Điều hướng tới LoginScreen
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (!account) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TÀI KHOẢN</Text>
      </View>

      <View style={styles.avatarContainer}>
        <Image source={require('../images/KoiF.png')} style={styles.avatar} />
        <TouchableOpacity style={styles.editAvatarButton}>
          <Ionicons name="camera-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <InfoRow label="Email" value={account.email} />
        <InfoRow label="Họ tên" value={account.name} />
        <InfoRow label="Số điện thoại" value={account.phone} />
        <InfoRow label="Ngày sinh" value={account.dob || 'Chưa cập nhật'} />
        <InfoRow label="Địa chỉ" value={account.address} />
        <InfoRow label="Vai trò" value={account.role} />
      </View>

      <TouchableOpacity style={styles.historyButton}>
        <Text style={styles.buttonText}>Xem lịch sử mua hàng, ký gửi</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Đăng Xuất</Text>
      </TouchableOpacity>

      <View style={styles.footerIcons}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
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
    </ScrollView>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.info}>{value}</Text>
    <Ionicons name="pencil-outline" size={20} color="black" style={styles.editIcon} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#FAF4D9',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#F7C8A0',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
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
    flex: 1,
    color: '#000',
  },
  info: {
    flex: 2,
    fontSize: 16,
    color: '#000',
  },
  editIcon: {
    marginLeft: 10,
  },
  historyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    marginTop: 30,
  },
  logoutButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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

export default AccountScreen;
