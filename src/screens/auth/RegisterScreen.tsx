// src/screens/auth/RegisterScreen.tsx
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { Colors, Typography, Spacing, BorderRadius } from '../../theme';

const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,13}$/;
    return phoneRegex.test(phone);
  };

  const handleRegister = async () => {
    // Reset errors
    setErrors({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });

    // Validation
    let hasError = false;
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.name) {
      newErrors.name = 'Nama harus diisi';
      hasError = true;
    } else if (formData.name.length < 3) {
      newErrors.name = 'Nama minimal 3 karakter';
      hasError = true;
    }

    if (!formData.email) {
      newErrors.email = 'Email harus diisi';
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid';
      hasError = true;
    }

    if (!formData.phone) {
      newErrors.phone = 'Nomor HP harus diisi';
      hasError = true;
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Nomor HP tidak valid (10-13 digit)';
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
      hasError = true;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
      hasError = true;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
      hasError = true;
    }

    if (!acceptTerms) {
      alert('Silakan setujui syarat dan ketentuan');
      return;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Mock register
    setIsLoading(true);
    setTimeout(() => {
      dispatch(login({
        user: {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
        },
        token: 'mock-jwt-token-' + Date.now(),
      }));
      setIsLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }, 1500);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* BACKGROUND GLOW */}
      <View style={styles.backgroundGlow} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        {/* FORM */}
        <View style={styles.form}>
          {/* NAME INPUT */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[
              styles.inputWrapper,
              errors.name ? styles.inputWrapperError : null
            ]}>
              <Ionicons name="person-outline" size={20} color={Colors.text.secondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.text.tertiary}
                value={formData.name}
                onChangeText={(text) => updateFormData('name', text)}
                autoCapitalize="words"
              />
            </View>
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>

          {/* EMAIL INPUT */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={[
              styles.inputWrapper,
              errors.email ? styles.inputWrapperError : null
            ]}>
              <Ionicons name="mail-outline" size={20} color={Colors.text.secondary} />
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                placeholderTextColor={Colors.text.tertiary}
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>

          {/* PHONE INPUT */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={[
              styles.inputWrapper,
              errors.phone ? styles.inputWrapperError : null
            ]}>
              <Ionicons name="call-outline" size={20} color={Colors.text.secondary} />
              <TextInput
                style={styles.input}
                placeholder="08123456789"
                placeholderTextColor={Colors.text.tertiary}
                value={formData.phone}
                onChangeText={(text) => updateFormData('phone', text)}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phone ? (
              <Text style={styles.errorText}>{errors.phone}</Text>
            ) : null}
          </View>

          {/* PASSWORD INPUT */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[
              styles.inputWrapper,
              errors.password ? styles.inputWrapperError : null
            ]}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.text.secondary} />
              <TextInput
                style={styles.input}
                placeholder="Minimal 6 karakter"
                placeholderTextColor={Colors.text.tertiary}
                value={formData.password}
                onChangeText={(text) => updateFormData('password', text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
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

          {/* CONFIRM PASSWORD INPUT */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[
              styles.inputWrapper,
              errors.confirmPassword ? styles.inputWrapperError : null
            ]}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.text.secondary} />
              <TextInput
                style={styles.input}
                placeholder="Ulangi password"
                placeholderTextColor={Colors.text.tertiary}
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData('confirmPassword', text)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={Colors.text.secondary}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
          </View>

          {/* TERMS CHECKBOX */}
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAcceptTerms(!acceptTerms)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox,
              acceptTerms && styles.checkboxChecked
            ]}>
              {acceptTerms && (
                <Ionicons name="checkmark" size={16} color="#000" />
              )}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms & Conditions</Text>
            </Text>
          </TouchableOpacity>

          {/* REGISTER BUTTON */}
          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <>
                <Text style={styles.registerButtonText}>Register</Text>
                <Ionicons name="arrow-forward" size={20} color="#000" />
              </>
            )}
          </TouchableOpacity>

          {/* LOGIN LINK */}
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
            </Text>
          </TouchableOpacity>
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

  // FORM
  form: {
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

  // TERMS
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.bg.tertiary,
    backgroundColor: Colors.bg.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: Colors.orange.primary,
    borderColor: Colors.orange.primary,
  },
  termsText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
  termsLink: {
    color: Colors.orange.primary,
    fontWeight: Typography.weights.semibold,
  },

  // REGISTER BUTTON
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.orange.primary,
    paddingVertical: 16,
    borderRadius: BorderRadius.lg,
    marginBottom: 24,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.inverse,
    marginRight: 8,
  },

  // LOGIN LINK
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: Typography.sizes.base,
    color: Colors.text.secondary,
  },
  loginLinkBold: {
    fontWeight: Typography.weights.bold,
    color: Colors.orange.primary,
  },
});

export default RegisterScreen;
