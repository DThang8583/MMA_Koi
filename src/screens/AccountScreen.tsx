import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, Modal, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AccountScreen = () => {
  const [account, setAccount] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');

  useEffect(() => {
    const fetchAccountInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://192.168.1.6:8000/api/user');
        const data = await response.json();
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
    setSelectedField(field);
    setNewValue(value ?? '');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!newValue.trim()) {
      Alert.alert('Lỗi', 'Giá trị mới không hợp lệ');
      return;
    }

    try {
      const response = await fetch('localhost:8000/api/user/personal-information', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field: selectedField, value: newValue.trim() }),
      });

      if (response.ok) {
        Alert.alert('Thành công', `${selectedField} đã được cập nhật thành công`);
        setAccount({ ...account, [selectedField]: newValue.trim() });
      } else {
        throw new Error('Không thể cập nhật thông tin');
      }
    } catch (error) {
      Alert.alert('Lỗi', `Không thể cập nhật ${selectedField}`);
    } finally {
      setModalVisible(false);
    }
  };

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

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật {selectedField}</Text>
            <TextInput
              style={styles.modalInput}
              value={newValue}
              onChangeText={setNewValue}
            />
            <View style={styles.modalButtons}>
              <Button title="Hủy" onPress={() => setModalVisible(false)} />
              <Button title="Lưu" onPress={handleSave} />
            </View>
          </View>
        </View>
      </Modal>
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
    width: '120%',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: -10,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 20,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    width: '100%',
    borderBottomWidth: 1,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  footerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#B3E283',
    width: '120%',
    marginTop: 320,
  },
});

export default AccountScreen;
