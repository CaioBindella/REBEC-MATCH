import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInputProps,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Header from '@/components/reusable/Header';
import { useAuth } from '@/context/AuthContext';

// Isso define os tipos para 'label', 'value', etc.
interface InputFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}

const InputField = ({ label, value, onChangeText, placeholder, multiline = false, numberOfLines = 1 }: InputFieldProps) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.textarea]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  </View>
);

export default function CreateStudyPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    titulo: '',
    codigoRegistro: '',
    status: 'RECRUTANDO',
    dataInicio: '',
    dataFim: '',
    informacoesGerais: '',
  });

  
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }
    
    if (!formData.titulo.trim()) {
      Alert.alert('Erro', 'O título do estudo é obrigatório.');
      return;
    }

    const studyDataPayload = {
      ...formData,
      pesquisador: {
        id: user.id,
        // nomeFicticio: user.nomeFicticio || `Pesquisador ${user.id}`,
      },
      // ...formatação de datas...
    };

    console.log('Dados a serem enviados para a API:', studyDataPayload);
    Alert.alert('Sucesso!', 'Estudo criado (simulação). Veja o console para os dados.');
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileTag}>
          <Text style={styles.profileTagText}>Perfil Pesquisador</Text>
        </View>
        <Text style={styles.pageTitle}>Registrar Novo Estudo</Text>

        <InputField
          label="Título do Estudo"
          placeholder="Coloque o título oficial"
          value={formData.titulo}
          onChangeText={(text) => handleInputChange('titulo', text)}
        />
        <InputField
          label="Código de Registro"
          placeholder="Ex: REBEC-XYZ-123"
          value={formData.codigoRegistro}
          onChangeText={(text) => handleInputChange('codigoRegistro', text)}
        />
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status Inicial</Text>
          <View style={styles.statusSelector}>
            {['RECRUTANDO', 'EM_ANDAMENTO'].map(status => (
              <TouchableOpacity
                key={status}
                style={[styles.statusButton, formData.status === status && styles.statusButtonActive]}
                onPress={() => handleInputChange('status', status)}
              >
                <Text style={[styles.statusText, formData.status === status && styles.statusTextActive]}>
                  {status.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <InputField
          label="Data de Início"
          placeholder="Formato: AAAA-MM-DD"
          value={formData.dataInicio}
          onChangeText={(text) => handleInputChange('dataInicio', text)}
        />
        <InputField
          label="Data de Fim"
          placeholder="Formato: AAAA-MM-DD"
          value={formData.dataFim}
          onChangeText={(text) => handleInputChange('dataFim', text)}
        />
        <InputField
          label="Informações Gerais"
          placeholder="Descreva o objetivo e os métodos do estudo."
          value={formData.informacoesGerais}
          onChangeText={(text) => handleInputChange('informacoesGerais', text)}
          multiline
          numberOfLines={5}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Salvar Estudo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  scrollContainer: { padding: 20, paddingBottom: 50 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginBottom: 24 },
  inputGroup: { width: '100%', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#495057', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  textarea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  statusSelector: { flexDirection: 'row' },
  statusButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ced4da',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#15715A',
    borderColor: '#15715A',
  },
  statusText: { color: '#495057', fontWeight: '500' },
  statusTextActive: { color: '#fff' },
  submitButton: {
    backgroundColor: '#15715A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileTag: {
    backgroundColor: '#E0F2F1', // Um verde claro
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start', // Alinha à esquerda
    marginBottom: 16,
  },
  profileTagText: {
    color: '#166865', // Verde escuro do seu tema
    fontWeight: '500',
  },
});