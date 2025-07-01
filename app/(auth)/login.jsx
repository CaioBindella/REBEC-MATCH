import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack } from 'expo-router';

// Components
import Header from '@/components/Header';
import LoginForm from '@/components/LoginCredentials'; // Seu componente de formulário

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

        {/* 3. Contêiner de conteúdo para centralização */}
        <View style={styles.content}>
          <LoginForm />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// 4. StyleSheet para organização e performance
const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // Faz com que o SafeAreaView ocupe toda a tela
    backgroundColor: '#fff', // Define uma cor de fundo para a tela inteira
  },
  container: {
    flex: 1, // Garante que o container principal também ocupe todo o espaço disponível
  },
  content: {
    flex: 1, // Faz esta View ocupar todo o espaço restante após o Header
    justifyContent: 'center', // Centraliza o filho (LoginForm) verticalmente nesse espaço
  },
});