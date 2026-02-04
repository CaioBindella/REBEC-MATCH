import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the arrow

export default function LoginForm() {
  const { logIn } = useAuth();
  
  const [credentials, setCredentials] = useState({ login: '', senha: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!credentials.login || !credentials.senha) {
      Alert.alert('Atenção', 'Por favor, preencha os campos de login e senha.');
      return;
    }

    setIsLoading(true);

    try {
      await logIn({
        login: credentials.login,
        senha: credentials.senha
      });

      router.replace('/(protected)/home/page');

    } catch (error: any) {
      Alert.alert(
        'Erro de Login', 
        error.message || 'Não foi possível entrar. Verifique as suas credenciais.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Esqueci minha senha', 'Funcionalidade a ser implementada.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.screenContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.mainContent}>
          <View style={styles.headerContainer}>
            <Image 
              source={require('@/assets/images/MatchLogo.png')}
              style={styles.logo} 
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Acessar Conta</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome de usuário"
              value={credentials.login}
              onChangeText={(text) => setCredentials(prev => ({ ...prev, login: text }))}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={credentials.senha}
              onChangeText={(text) => setCredentials(prev => ({ ...prev, senha: text }))}
              secureTextEntry
            />

            <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>
                Esqueci minha senha
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin} 
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* New Go Back Button */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()} // Navigates back to the previous screen (firstpage)
          >
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
  formContainer: {
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f2f5',
  },
  input: {
    backgroundColor: '#f0f2f5',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  button: {
    backgroundColor: '#15715A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12, // Space between Enter and Back buttons
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Back Button Styles
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'left',
    marginBottom: 24,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#15715A',
    fontSize: 14,
    fontWeight: '600',
  },
});