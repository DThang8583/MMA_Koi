import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { AccountInfo, updateAccountInfo } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

const AccountScreen = () => {
  const [account, setAccount] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      setLoading(true);
      try {
        const data = await AccountInfo();
        setAccount(data);
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể lấy thông tin tài khoản');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, []);

  const handleUpdateField = (field: string, value: string | undefined) => {
    Alert.prompt(
      'Cập nhật thông tin',
      `Nhập ${field} mới`  ,
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Cập nhật',
          onPress: async (newValue) => {
            if (!newValue || newValue.trim() === '') {
              Alert.alert('Lỗi', 'Giá trị mới không hợp lệ');
              return;
            }
  
            try {
              await updateAccountInfo(field, newValue.trim());
              Alert.alert('Thành công', `${field} đã được cập nhật thành công`);
              setAccount({ ...account, [field]: newValue.trim() });
            } catch (error) {
              Alert.alert('Lỗi', `Không thể cập nhật ${field}`);
            }
          },
        },
      ],
      'plain-text',
      value ?? '' // Sử dụng chuỗi rỗng nếu value là undefined
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TÀI KHOẢN</Text>
      </View>
      <Image source={require('../images/KoiF.png')} style={styles.avatar} />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.info}>{account.email}</Text>
          <TouchableOpacity onPress={() => handleUpdateField('email', account.email)}>
            <Ionicons name="pencil-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Họ tên</Text>
          <Text style={styles.info}>{account.fullName}</Text>
          <TouchableOpacity onPress={() => handleUpdateField('fullName', account.fullName)}>
            <Ionicons name="pencil-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Số điện thoại</Text>
          <Text style={styles.info}>{account.phoneNumber}</Text>
          <TouchableOpacity onPress={() => handleUpdateField('phoneNumber', account.phoneNumber)}>
            <Ionicons name="pencil-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Ngày sinh</Text>
          <Text style={styles.info}>{account.dob}</Text>
          <TouchableOpacity onPress={() => handleUpdateField('dob', account.dob)}>
            <Ionicons name="pencil-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Địa chỉ</Text>
          <Text style={styles.info}>{account.address}</Text>
          <TouchableOpacity onPress={() => handleUpdateField('address', account.address)}>
            <Ionicons name="pencil-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.historyButton}>
        <Text style={styles.buttonText}>Xem lịch sử mua hàng, ký gửi</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.buttonText}>Đăng Xuất</Text>
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
  header: {
    backgroundColor: '#F7C8A0',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
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
});

export default AccountScreen;
