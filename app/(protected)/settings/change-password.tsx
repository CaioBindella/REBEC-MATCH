import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api/apiClient'; 

const schema = Yup.object().shape({
  senhaAtual: Yup.string().required('A senha atual é obrigatória'),
  novaSenha: Yup.string()
    .min(6, 'A nova senha deve ter no mínimo 6 caracteres')
    .required('A nova senha é obrigatória'),
  confirmarNovaSenha: Yup.string()
    .oneOf([Yup.ref('novaSenha')], 'As novas senhas não coincidem')
    .required('Confirme a nova senha'),
});

type FormData = Yup.InferType<typeof schema>;

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!user?.id) {
      Alert.alert("Erro", "Usuário não identificado.");
      return;
    }

    setLoading(true);
    try {
      await apiService.usuario.updatePassword(user.id, {
        senhaAtual: data.senhaAtual,
        novaSenha: data.novaSenha
      });
      
      Alert.alert("Sucesso", "Sua senha foi alterada com sucesso!", [
        { text: "OK", onPress: () => router.back() }
      ]);
      reset();

    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Não foi possível alterar a senha. Verifique sua senha atual.";
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Segurança', headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alterar Senha</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          
          <View style={styles.iconContainer}>
            <View style={styles.circleIcon}>
              <Ionicons name="lock-closed" size={40} color="#15715A" />
            </View>
            <Text style={styles.instructionText}>
              Crie uma nova senha forte para proteger sua conta.
            </Text>
          </View>

          <Text style={styles.label}>Senha Atual</Text>
          <View style={styles.inputWrapper}>
            <Controller
              control={control}
              name="senhaAtual"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Digite a senha atual"
                  secureTextEntry={!showCurrent}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowCurrent(!showCurrent)}>
              <Ionicons name={showCurrent ? "eye-off" : "eye"} size={20} color="#666" />
            </TouchableOpacity>
          </View>
          {errors.senhaAtual && <Text style={styles.errorText}>{errors.senhaAtual.message}</Text>}

          <Text style={styles.label}>Nova Senha</Text>
          <View style={styles.inputWrapper}>
            <Controller
              control={control}
              name="novaSenha"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Digite a nova senha"
                  secureTextEntry={!showNew}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowNew(!showNew)}>
              <Ionicons name={showNew ? "eye-off" : "eye"} size={20} color="#666" />
            </TouchableOpacity>
          </View>
          {errors.novaSenha && <Text style={styles.errorText}>{errors.novaSenha.message}</Text>}

          <Text style={styles.label}>Confirmar Nova Senha</Text>
          <View style={styles.inputWrapper}>
            <Controller
              control={control}
              name="confirmarNovaSenha"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Repita a nova senha"
                  secureTextEntry={!showNew}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
          {errors.confirmarNovaSenha && <Text style={styles.errorText}>{errors.confirmarNovaSenha.message}</Text>}

          <TouchableOpacity 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salvar Nova Senha</Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  circleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
    marginRight: 5,
  },
  errorText: {
    color: '#d9534f',
    fontSize: 13,
    marginBottom: 15,
    marginTop: -4,
  },
  button: {
    backgroundColor: '#15715A',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});