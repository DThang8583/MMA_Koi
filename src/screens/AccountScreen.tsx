import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList, getAccountInfo, logoutUser, AccountInfo, updateAccountInfo, updatePassword } from '../services/api';
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
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [editedAccount, setEditedAccount] = useState(account);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchAccountInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Phiên đăng nhập đã hết hạn', 'Vui lòng đăng nhập lại.');
        navigation.navigate('LoginScreen');
        return;
      }
      const accountInfoResponse = await getAccountInfo();
      setAccount(accountInfoResponse.info);
    } catch (error) {
      console.error('Error fetching account info:', error);
      Alert.alert('Lỗi', 'Không thể lấy thông tin tài khoản. Vui lòng đăng nhập lại.');
      navigation.navigate('LoginScreen');
    }
  };

  const formatDate = (date: string | null): string => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSaveChanges = async () => {
    try {
      await updateAccountInfo(editedAccount);
      setAccount(editedAccount);
      setEditModalVisible(false);
      Alert.alert('Thành công', 'Thông tin đã được cập nhật.');
    } catch (error) {
      console.error('Error updating account:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin. Vui lòng thử lại.');
    }
  };

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp. Vui lòng thử lại.');
      return;
    }
    try {
      await updatePassword(password);
      setPasswordModalVisible(false);
      Alert.alert('Thành công', 'Mật khẩu đã được đổi.');
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Lỗi', 'Không thể đổi mật khẩu. Vui lòng thử lại.');
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

      <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
        <Text style={styles.editButtonText}>Chỉnh sửa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.passwordButton} onPress={() => setPasswordModalVisible(true)}>
        <Text style={styles.passwordButtonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Đăng Xuất</Text>
      </TouchableOpacity>

      {/* Edit Information Modal */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa thông tin</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={editedAccount.email}
              onChangeText={(text) => setEditedAccount({ ...editedAccount, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Họ tên"
              value={editedAccount.name}
              onChangeText={(text) => setEditedAccount({ ...editedAccount, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={editedAccount.phone?.toString() || ''}
              onChangeText={(text) => setEditedAccount({ ...editedAccount, phone: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Ngày sinh (dd/mm/yyyy)"
              value={editedAccount.dob || ''}
              onChangeText={(text) => setEditedAccount({ ...editedAccount, dob: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              value={editedAccount.address}
              onChangeText={(text) => setEditedAccount({ ...editedAccount, address: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={isPasswordModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                <Text style={styles.saveButtonText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setPasswordModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
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
    textAlign: 'center',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#66FF99',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    marginTop: 15,
  },
  editButtonText: {
    color: '#000',
    fontSize: 16,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#66FF99',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginRight: 5,
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginLeft: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  passwordButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    marginTop: 15,
  },
  passwordButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default AccountScreen;
