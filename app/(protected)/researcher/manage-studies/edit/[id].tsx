import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  TextInputProps,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import Header from '@/components/reusable/Header';

interface StudyData {
  id: number;
  titulo: string;
  codigoRegistro: string;
  status: string;
  dataInicio: string;
  dataFim: string;
  informacoesGerais: string;
}

interface InputFieldProps extends TextInputProps {
  label: string;
}

const InputField = ({ label, value, ...props }: InputFieldProps) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={[styles.input, props.multiline && styles.textarea]} value={value} {...props} />
  </View>
);

const getStudyById = (id: string): StudyData => ({
  id: parseInt(id, 10),
  titulo: 'Estudo sobre Eficácia de Novo Medicamento para Enxaqueca',
  codigoRegistro: 'REBEC-XYZ-987',
  status: 'EM_ANDAMENTO',
  dataInicio: '2025-08-10',
  dataFim: '2026-08-10',
  informacoesGerais: 'Este estudo visa avaliar a redução na frequência de crises de enxaqueca em pacientes que utilizam o novo composto experimental X.',
});

export default function EditStudyPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [formData, setFormData] = useState<StudyData | null>(null);

  useEffect(() => {
    if (id) {
      const studyData = getStudyById(id);
      setFormData(studyData);
    }
  }, [id]);

  const handleInputChange = (field: keyof StudyData, value: string) => {
    if (formData) {
      setFormData(prev => ({ ...prev!, [field]: value }));
    }
  };

  const handleUpdate = () => {
    console.log('Atualizando estudo com os dados:', formData);
    Alert.alert('Sucesso', 'Alterações salvas (simulação).');
    router.back();
  };

  if (!formData) {
    return <ActivityIndicator style={{flex: 1}} size="large" />;
  }

  // Opções de status disponíveis
  const statusOptions = ['RECRUTANDO', 'EM_ANDAMENTO', 'CONCLUIDO'];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.pageTitle}>Editar Estudo</Text>
        
        <InputField
          label="Título do Estudo"
          value={formData.titulo}
          onChangeText={(text) => handleInputChange('titulo', text)}
        />

        {/* --- NOVO SELETOR DE STATUS --- */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status Atual</Text>
          <View style={styles.statusSelector}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.statusButton,
                  formData.status === option && styles.statusButtonActive
                ]}
                onPress={() => handleInputChange('status', option)}
              >
                <Text style={[
                  styles.statusText,
                  formData.status === option && styles.statusTextActive
                ]}>
                  {option.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <InputField
          label="Informações Gerais"
          value={formData.informacoesGerais}
          onChangeText={(text) => handleInputChange('informacoesGerais', text)}
          multiline
          numberOfLines={5}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
          <Text style={styles.submitButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  scrollContainer: { padding: 20 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginBottom: 24 },
  inputGroup: { width: '100%', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#495057', marginBottom: 8 },
  input: { backgroundColor: '#fff', minHeight: 50, borderWidth: 1, borderColor: '#ced4da', borderRadius: 8, paddingHorizontal: 15, fontSize: 16 },
  textarea: { height: 120, textAlignVertical: 'top', paddingTop: 15 },
  submitButton: { backgroundColor: '#15715A', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
  // Estilos para o seletor de status
  statusSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
    backgroundColor: '#fff',
  },
  statusButtonActive: {
    backgroundColor: '#15715A',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  statusTextActive: {
    color: '#fff',
  },
});