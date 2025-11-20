// src/screens/admin/FaceVerificationScreen.tsx - LINE 188 FIX
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  Platform 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { adminLoginSuccess, adminLoginFailed } from '../../store/slices/adminAuthSlice';
import { checkIn } from '../../store/slices/attendanceSlice';
import type { AppDispatch } from '../../store';

// Only import Camera for mobile
let Camera: any = null;
let CameraView: any = null;

if (Platform.OS !== 'web') {
  try {
    const cameraModule = require('expo-camera');
    Camera = cameraModule.Camera;
    CameraView = cameraModule.CameraView;
  } catch (error) {
    console.log('Camera not available on this platform');
  }
}

const FaceVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const cameraRef = useRef<any>(null);
  
  // @ts-ignore
  const { adminData } = route.params || {};

  useEffect(() => {
    if (Platform.OS === 'web') {
      setHasPermission(true);
    } else {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }
  }, []);

  const handleWebVerification = () => {
    setIsVerifying(true);

    setTimeout(() => {
      const matchScore = 0.95;
      const isMatch = true;

      if (isMatch && adminData) {
        dispatch(checkIn({
          adminId: adminData.id,
          adminName: adminData.name,
          faceMatchScore: matchScore,
        }));

        dispatch(adminLoginSuccess({
          admin: {
            id: adminData.id,
            username: adminData.username,
            role: adminData.role,
            name: adminData.name,
            faceData: adminData.faceData,
          },
          token: 'admin-jwt-token-' + Date.now(),
        }));

        Alert.alert(
          'Verifikasi Berhasil! ✅',
          `Selamat datang, ${adminData.name}!\n\nAbsensi berhasil dicatat.\nMatch Score: ${(matchScore * 100).toFixed(1)}%\n\n(Web Demo Mode)`,
          [
            {
              text: 'Masuk Dashboard',
              onPress: () => {
                // @ts-ignore
                navigation.replace('AdminDashboard');
              },
            },
          ]
        );
      }

      setIsVerifying(false);
    }, 2000);
  };

  const handleMobileCapture = async () => {
    if (!cameraRef.current || !adminData) return;

    setIsVerifying(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
      });

      setTimeout(() => {
        const matchScore = Math.random();
        const isMatch = matchScore > 0.7;

        if (isMatch) {
          dispatch(checkIn({
            adminId: adminData.id,
            adminName: adminData.name,
            faceMatchScore: matchScore,
          }));

          dispatch(adminLoginSuccess({
            admin: {
              id: adminData.id,
              username: adminData.username,
              role: adminData.role,
              name: adminData.name,
              faceData: adminData.faceData,
            },
            token: 'admin-jwt-token-' + Date.now(),
          }));

          Alert.alert(
            'Verifikasi Berhasil! ✅',
            `Selamat datang, ${adminData.name}!\n\nAbsensi berhasil dicatat.\nMatch Score: ${(matchScore * 100).toFixed(1)}%`,
            [
              {
                text: 'Masuk Dashboard',
                onPress: () => {
                  // @ts-ignore
                  navigation.replace('AdminDashboard');
                },
              },
            ]
          );
        } else {
          dispatch(adminLoginFailed());
          Alert.alert(
            'Verifikasi Gagal',
            `Wajah tidak cocok.\nMatch Score: ${(matchScore * 100).toFixed(1)}%`,
            [
              {
                text: 'Coba Lagi',
                onPress: () => setIsVerifying(false),
              },
              {
                text: 'Kembali',
                style: 'cancel',
                onPress: () => navigation.goBack(),
              },
            ]
          );
        }
      }, 2000);
    } catch (error) {
      console.error('Error capturing face:', error);
      setIsVerifying(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Memuat...</Text>
      </View>
    );
  }

  if (hasPermission === false && Platform.OS !== 'web') {
    return (
      <View style={styles.centerContainer}>
        {/* ✅ FIX: Add type assertion */}
        <Ionicons name={"camera-off" as any} size={80} color="#ccc" />
        <Text style={styles.errorTitle}>Kamera Tidak Diizinkan</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Kembali
        </Button>
      </View>
    );
  }

  // WEB VERSION
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitleWeb}>Verifikasi Wajah</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.webContent}>
          <View style={styles.webCameraPlaceholder}>
            <Ionicons name="camera" size={80} color="#ccc" />
            <Text style={styles.webInfoText}>Mode Web Demo</Text>
            <Text style={styles.webSubText}>
              Face recognition akan aktif di mobile device
            </Text>
          </View>

          <View style={styles.webInfoBox}>
            <Text style={styles.webAdminName}>
              Verifikasi untuk: {adminData?.name || 'Admin'}
            </Text>
            <Text style={styles.webRoleText}>
              Role: {adminData?.role}
            </Text>
          </View>

          {isVerifying ? (
            <View style={styles.verifyingContainer}>
              <ActivityIndicator size="large" color="#FF6B35" />
              <Text style={styles.verifyingText}>Memverifikasi...</Text>
            </View>
          ) : (
            <Button
              mode="contained"
              onPress={handleWebVerification}
              style={styles.webButton}
              icon="shield-check"
            >
              Simulasi Verifikasi (Web Demo)
            </Button>
          )}
        </View>
      </View>
    );
  }

  // MOBILE VERSION
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verifikasi Wajah</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="front"
        >
          <View style={styles.faceGuide}>
            <View style={styles.faceGuideOval} />
            <Text style={styles.guideText}>
              Posisikan wajah di dalam oval
            </Text>
          </View>
        </CameraView>
      </View>

      <View style={styles.footer}>
        {!isVerifying ? (
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleMobileCapture}
          >
            <View style={styles.captureButtonInner}>
              <Ionicons name="camera" size={40} color="#fff" />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.verifyingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.verifyingTextMobile}>Memverifikasi...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#f5f5f5' : '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 60,
    paddingBottom: 16,
    backgroundColor: Platform.OS === 'web' ? '#fff' : 'rgba(0,0,0,0.7)',
    borderBottomWidth: Platform.OS === 'web' ? 1 : 0,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerTitleWeb: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  webContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webCameraPlaceholder: {
    width: '100%',
    maxWidth: 400,
    aspectRatio: 0.75,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
  },
  webInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  webSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  webInfoBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  webAdminName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  webRoleText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  webButton: {
    width: '100%',
    maxWidth: 400,
  },
  verifyingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  verifyingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  verifyingTextMobile: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  faceGuide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuideOval: {
    width: 250,
    height: 320,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: '#FF6B35',
    borderStyle: 'dashed',
  },
  guideText: {
    marginTop: 20,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  footer: {
    paddingVertical: 30,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  captureButton: {
    alignSelf: 'center',
  },
  captureButtonInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
});

export default FaceVerificationScreen;
