import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack } from 'expo-router';

// Components
import Header from '@/components/Header';
import LoginForm from '@/components/LoginCredentials'; 

export default function LoginPage() {
  return (
    // 1. SafeAreaView: Garante que o conteúdo não fique sob a barra de status ou o "notch" em iPhones.
    <SafeAreaView style={styles.safeArea}>
      {/* 2. KeyboardAvoidingView: Empurra o conteúdo para cima quando o teclado abre. */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <Header />

        <View style={styles.content}>
          <LoginForm />
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
  container: {
    flex: 1, 
  },
  content: {
    flex: 1, 
    justifyContent: 'center', 
  },
});