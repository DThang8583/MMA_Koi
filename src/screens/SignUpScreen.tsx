import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { registerUser, RootStackParamList } from '../services/api';


const SignUpScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !phone || !name || !address) {
      Alert.alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }


    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert('Email không hợp lệ.');
      return;
    }


    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Số điện thoại không hợp lệ.');
      return;
    }


    if (password !== confirmPassword) {
      Alert.alert('Mật khẩu không khớp');
      return;
    }


    try {
      setIsLoading(true);
      const response = await registerUser(email, password, phone, name, address);
      Alert.alert('Đăng ký thành công!');
      setIsLoading(false);
      navigation.navigate('LoginScreen');
    } catch (error) {
      Alert.alert('Có lỗi xảy ra. Vui lòng thử lại.');
      setIsLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Image source={require('../images/TextKoi.png')} style={styles.logo} />
      <Text style={styles.title}>ĐĂNG KÝ</Text>


      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Tên đầy đủ"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />


      <TouchableOpacity style={styles.buttonSignUp} onPress={handleSignUp}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
        </Text>
      </TouchableOpacity>


      <Text style={styles.orText}>--Hoặc--</Text>


      <TouchableOpacity style={styles.buttonSignIn} onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.buttonTextSignIn}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5DC',
  },
  logo: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  buttonSignUp: {
    width: '80%',
    padding: 15,
    backgroundColor: '#66FF99',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
  orText: {
    marginVertical: 10,
    color: '#000',
  },
  buttonSignIn: {
    width: '80%',
    padding: 15,
    backgroundColor: '#FF6633',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonTextSignIn: {
    color: '#FFF',
    fontSize: 16,
  },
});


export default SignUpScreen;
