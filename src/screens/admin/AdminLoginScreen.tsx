// src/screens/admin/AdminLoginScreen.tsx - FIXED FULL VERSION
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { adminLogin, setFaceVerified } from '../../store/slices/adminAuthSlice';
import { Colors, Typography, BorderRadius } from '../../theme';

const AdminLoginScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const [step, setStep] = useState<'username' | 'password'>('username');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });

  const handleNextStep = () => {
    setErrors({ username: '', password: '' });

    if (step === 'username') {
      // Validate username
      if (!formData.username) {
        setErrors({ ...errors, username: 'Username harus diisi' });
        return;
      }
      if (formData.username.length < 3) {
        setErrors({ ...errors, username: 'Username minimal 3 karakter' });
        return;
      }
      setStep('password');
    } else if (step === 'password') {
      // Validate password
      if (!formData.password) {
        setErrors({ ...errors, password: 'Password harus diisi' });
        return;
      }
      if (formData.password.length < 6) {
        setErrors({ ...errors, password: 'Password minimal 6 karakter' });
        return;
      }

      // Mock login - skip face verification
setIsLoading(true);
setTimeout(() => {
  const mockAdmin = {
    id: '1',
    name: formData.username === 'superadmin' ? 'Super Admin' : 'Admin User',
    username: formData.username,
    email: `${formData.username}@kafebilyar.com`,
    role: (formData.username === 'superadmin' ? 'super_admin' : 'admin') as 'admin' | 'super_admin',
  };

  console.log('🔐 Attempting login with:', mockAdmin);

  // Dispatch dengan format yang benar
  dispatch(adminLogin({
    admin: mockAdmin,
    token: 'mock-token-' + Date.now(),
    needsFaceVerification: false,
  }));

  dispatch(setFaceVerified(true));

  console.log('✅ Redux dispatched');

  setIsLoading(false);
  
  // ✅ TAMBAHKAN INI: Manual navigate
  setTimeout(() => {
    if (mockAdmin.role === 'super_admin') {
      navigation.replace('SuperAdminDashboard');
    } else {
      navigation.replace('AdminDashboard');
    }
  }, 100);
}, 1000);
    }
  };

  const handleBack = () => {
    if (step === 'password') {
      setStep('username');
    } else {
      navigation.goBack();
    }
  };

  const getStepInfo = () => {
    switch (step) {
      case 'username':
        return {
          title: 'Admin Login',
          subtitle: 'Step 1 of 2: Enter Username',
          progress: 50,
        };
      case 'password':
        return {
          title: 'Admin Login',
          subtitle: 'Step 2 of 2: Enter Password',
          progress: 100,
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* BACKGROUND GLOW */}
      <View style={styles.backgroundGlow} pointerEvents="none" />
      <View style={[styles.backgroundGlow, styles.backgroundGlow2]} pointerEvents="none" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="shield-checkmark" size={40} color={Colors.orange.primary} />
            </View>
          </View>
          <Text style={styles.title}>{stepInfo.title}</Text>
          <Text style={styles.subtitle}>{stepInfo.subtitle}</Text>
        </View>

        {/* PROGRESS BAR */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${stepInfo.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{stepInfo.progress}%</Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          {/* STEP 1: USERNAME */}
          {step === 'username' && (
            <View style={styles.stepContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <View style={[
                  styles.inputWrapper,
                  errors.username ? styles.inputWrapperError : null
                ]}>
                  <Ionicons name="person-outline" size={20} color={Colors.text.secondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter admin username"
                    placeholderTextColor={Colors.text.tertiary}
                    value={formData.username}
                    onChangeText={(text) => {
                      setFormData({ ...formData, username: text });
                      setErrors({ ...errors, username: '' });
                    }}
                    autoCapitalize="none"
                    autoFocus
                  />
                </View>
                {errors.username ? (
                  <Text style={styles.errorText}>{errors.username}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextStep}
                activeOpacity={0.8}
              >
                <Text style={styles.nextButtonText}>Next</Text>
                <Ionicons name="arrow-forward" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: PASSWORD */}
          {step === 'password' && (
            <View style={styles.stepContainer}>
              <View style={styles.infoCard}>
                <Ionicons name="information-circle" size={24} color={Colors.orange.primary} />
                <Text style={styles.infoText}>
                  Enter your password to access admin dashboard.
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={[
                  styles.inputWrapper,
                  errors.password ? styles.inputWrapperError : null
                ]}>
                  <Ionicons name="lock-closed-outline" size={20} color={Colors.text.secondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={Colors.text.tertiary}
                    value={formData.password}
                    onChangeText={(text) => {
                      setFormData({ ...formData, password: text });
                      setErrors({ ...errors, password: '' });
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoFocus
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                      size={20}
                      color={Colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleNextStep}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Login to Dashboard</Text>
                    <Ionicons name="arrow-forward" size={20} color="#000" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* FOOTER INFO */}
        <View style={styles.footer}>
          <View style={styles.securityBadge}>
            <Ionicons name="shield-checkmark" size={16} color={Colors.status.success} />
            <Text style={styles.securityText}>Secure Admin Access</Text>
          </View>
          <Text style={styles.footerNote}>
            This is a protected admin area. All login attempts are logged.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  // BACKGROUND
  backgroundGlow: {
    position: 'absolute',
    top: -150,
    right: -100,
    width: 300,
    height: 300,
    backgroundColor: Colors.orange.glow,
    borderRadius: 150,
    opacity: 0.3,
  },
  backgroundGlow2: {
    top: undefined,
    right: undefined,
    bottom: -100,
    left: -150,
    backgroundColor: Colors.status.success + '30',
  },

  // BACK BUTTON
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bg.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },

  // HEADER
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.bg.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.orange.primary,
  },
  title: {
    fontSize: Typography.sizes.display2,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.text.secondary,
  },

  // PROGRESS
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.bg.secondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.orange.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.orange.primary,
    textAlign: 'right',
  },

  // FORM
  form: {
    width: '100%',
  },
  stepContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.secondary,
    borderWidth: 1,
    borderColor: Colors.bg.tertiary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputWrapperError: {
    borderColor: Colors.status.error,
    borderWidth: 2,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
  },
  errorText: {
    fontSize: Typography.sizes.xs,
    color: Colors.status.error,
    marginTop: 6,
    marginLeft: 4,
  },

  // INFO CARD
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.secondary,
    borderRadius: BorderRadius.lg,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.orange.primary,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginLeft: 12,
    lineHeight: Typography.sizes.sm * 1.5,
  },

  // BUTTONS
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.orange.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    marginTop: 8,
  },
  nextButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.inverse,
    marginRight: 8,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.orange.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.text.inverse,
    marginRight: 8,
  },

  // FOOTER
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg.secondary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.status.success,
  },
  securityText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.status.success,
    marginLeft: 6,
  },
  footerNote: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default AdminLoginScreen;
