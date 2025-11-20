// src/screens/admin/AdminLoginScreen.tsx - WEB COMPATIBLE
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { adminLoginPending } from '../../store/slices/adminAuthSlice';
import type { AppDispatch } from '../../store';

const AdminLoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock admin database
  const MOCK_ADMINS = [
    {
      id: '1',
      username: 'admin',
      password: 'admin123',
      role: 'admin' as const,
      name: 'Admin Utama',
      faceData: 'mock-face-data-1',
    },
    {
      id: '2',
      username: 'kasir1',
      password: 'kasir123',
      role: 'kasir' as const,
      name: 'Kasir 1',
      faceData: 'mock-face-data-2',
    },
    {
      id: '3',
      username: 'superadmin',
      password: 'super123',
      role: 'super_admin' as const,
      name: 'Super Admin',
      faceData: 'mock-face-data-3',
    },
  ];

  const handleLogin = async () => {
    // Validation
    if (!username || !password) {
      if (Platform.OS === 'web') {
        window.alert('Username dan password harus diisi');
      }
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const admin = MOCK_ADMINS.find(
        a => a.username === username && a.password === password
      );

      setLoading(false);

      if (!admin) {
        if (Platform.OS === 'web') {
          window.alert('Login Gagal\n\nUsername atau password salah');
        }
        return;
      }

      // ✅ Credentials valid
      console.log('✅ Credentials validated for:', admin.name);

      dispatch(adminLoginPending({
        username: admin.username,
        tempToken: 'temp-token-' + Date.now(),
      }));

      // ✅ WEB: Use window.confirm
      if (Platform.OS === 'web') {
        const proceed = window.confirm(
          `Login Berhasil!\n\nSelamat datang, ${admin.name}!\n\nSilakan verifikasi wajah Anda untuk absensi.\n\nKlik OK untuk lanjut ke Verifikasi Wajah.`
        );
        
        if (proceed) {
          // @ts-ignore
          navigation.navigate('FaceVerification', {
            adminData: admin,
          });
        }
      } else {
        // Mobile: Use Alert
        const { Alert } = require('react-native');
        Alert.alert(
          'Login Berhasil',
          `Selamat datang, ${admin.name}!\n\nSilakan verifikasi wajah Anda untuk absensi.`,
          [
            {
              text: 'Lanjut ke Verifikasi Wajah',
              onPress: () => {
                // @ts-ignore
                navigation.navigate('FaceVerification', {
                  adminData: admin,
                });
              },
            },
          ]
        );
      }
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={80} color="#FF6B35" />
          </View>
          <Text style={styles.title}>Admin Login</Text>
          <Text style={styles.subtitle}>
            Sistem Manajemen Kafe & Bilyar
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
            placeholder="Masukkan username"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon 
                icon={showPassword ? "eye-off" : "eye"} 
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            placeholder="Masukkan password"
          />

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#2196F3" />
            <Text style={styles.infoText}>
              Setelah login, Anda akan diminta verifikasi wajah untuk absensi
            </Text>
          </View>

          {/* Login Button */}
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
            contentStyle={styles.loginButtonContent}
            icon="login"
          >
            {loading ? 'Memverifikasi...' : 'Login'}
          </Button>

          {/* Demo Credentials */}
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>🔑 Demo Credentials:</Text>
            <Text style={styles.demoText}>Admin: admin / admin123</Text>
            <Text style={styles.demoText}>Kasir: kasir1 / kasir123</Text>
            <Text style={styles.demoText}>Super Admin: superadmin / super123</Text>
          </View>

          {/* Back to Customer App */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#666" />
            <Text style={styles.backText}>Kembali ke Customer App</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
    backgroundColor: '#FFF5F0',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 18,
  },
  loginButton: {
    borderRadius: 8,
    marginBottom: 24,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  demoBox: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  demoText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  backText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
});

export default AdminLoginScreen;
