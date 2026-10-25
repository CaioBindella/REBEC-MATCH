import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import LoginCredentials from '@/components/reusable/LoginCredentials';

export default function LoginPage() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.screenContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.mainContent} keyboardShouldPersistTaps="handled">
          <View style={styles.headerContainer}>
            <Image source={require('@/assets/images/MatchLogo.png')} style={styles.logo} />
          </View>

          <LoginCredentials />

          <TouchableOpacity style={styles.registerLink} onPress={() => router.replace('/(auth)/voluntaryRegister')}>
            <Text style={styles.registerText}>
              Ainda não tem conta? <Text style={styles.registerTextBold}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/firstpage')}>
            <Ionicons name="arrow-back" size={20} color="#15715A" style={{ marginRight: 8 }} />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mainContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#495057',
    fontSize: 14,
  },
  registerTextBold: {
    color: '#15715A',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f2f5',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#15715A',
    backgroundColor: '#fff',
  },
  backButtonText: {
    color: '#15715A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
