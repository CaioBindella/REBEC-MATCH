import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { LoginCredentials } from '@/services/userService';

export default function LoginForm() {
  // Obtendo a função de login do contexto de autenticação
  const { logIn } = useAuth();

  // Criando estados para gerir as credenciais, erros e o estado de carregamento
  const [credentials, setCredentials] = useState<LoginCredentials>({ login: '', senha: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validação simples para evitar chamadas à API desnecessárias
    if (!credentials.login || !credentials.senha) {
      Alert.alert('Atenção', 'Por favor, preencha os campos de login e senha.');
      return;
    }

    setIsLoading(true);
    try {
      // Chamando a função logIn com as credenciais do estado
      await logIn(credentials);
      // A navegação para a página principal ocorrerá dentro da função logIn do AuthContext
    } catch (error: any) {
      // Se a API retornar um erro, mostre-o ao utilizador
      Alert.alert('Erro de Login', error.message || 'Não foi possível entrar. Verifique as suas credenciais.');
    } finally {
      // Independentemente do resultado, pare o carregamento
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acessar Conta</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Login"
        placeholderTextColor="#888"
        value={credentials.login}
        onChangeText={(text) => setCredentials(prev => ({ ...prev, login: text }))}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#888"
        value={credentials.senha}
        onChangeText={(text) => setCredentials(prev => ({ ...prev, senha: text }))}
        secureTextEntry
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 24,
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
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
