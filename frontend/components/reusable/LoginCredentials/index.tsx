import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/services/api/apiClient';

type FormData = {
  login: string;
  senha: string;
};

const schema = Yup.object().shape({
  login: Yup.string().trim().required('Informe o seu nome de usuário.'),
  senha: Yup.string().required('Informe a sua senha.'),
});

/**
 * Formulário de credenciais (usuário e senha) reaproveitável. Valida os campos com React Hook Form
 * e Yup e autentica pelo AuthContext, que obtém o token JWT da API.
 */
export default function LoginCredentials() {
  const { logIn, isLoading } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { login: '', senha: '' },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await logIn({ login: data.login.trim(), senha: data.senha });
    } catch (error) {
      Alert.alert('Erro de login', getErrorMessage(error, 'Não foi possível entrar. Verifique as suas credenciais.'));
    }
  };

  return (
    <View>
      <Text style={styles.title}>Acessar Conta</Text>

      <Controller
        control={control}
        name="login"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.login && styles.inputError]}
            placeholder="Nome de usuário"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            autoCorrect={false}
          />
        )}
      />
      {errors.login && <Text style={styles.errorText}>{errors.login.message}</Text>}

      <Controller
        control={control}
        name="senha"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.senha && styles.inputError]}
            placeholder="Senha"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.senha && <Text style={styles.errorText}>{errors.senha.message}</Text>}

      <TouchableOpacity style={[styles.button, isLoading && { opacity: 0.7 }]} onPress={handleSubmit(onSubmit)} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
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
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    marginTop: -10,
    marginBottom: 12,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#15715A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
