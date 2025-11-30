// src/screens/admin/FaceVerificationScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FaceVerificationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Face Verification Screen</Text>
      <Text style={styles.subtext}>Coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#B0B0B0',
  },
});

export default FaceVerificationScreen;
