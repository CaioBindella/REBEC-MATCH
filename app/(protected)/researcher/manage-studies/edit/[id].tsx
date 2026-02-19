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
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/reusable/Header';
import { apiService } from '@/services/api/apiClient';

interface InputFieldProps extends TextInputProps {
  label: string;
}

const InputField = ({ label, value, ...props }: InputFieldProps) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={[styles.input, props.multiline && styles.textarea]} value={value} {...props} />
  </View>
);

// Mapeamento de Status (UI <-> API)
const statusToUI: Record<string, string> = {
  'Recruiting': 'RECRUTANDO',
  'Active, not recruiting': 'EM_ANDAMENTO',
  'Completed': 'CONCLUIDO',
  'Suspended': 'SUSPENSO',
};

const uiToStatus: Record<string, string> = {
  'RECRUTANDO': 'Recruiting',
  'EM_ANDAMENTO': 'Active, not recruiting',
  'CONCLUIDO': 'Completed',
  'SUSPENSO': 'Suspended',
};

const statusOptions = ['RECRUTANDO', 'EM_ANDAMENTO', 'CONCLUIDO'];

export default function EditStudyPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [originalData, setOriginalData] = useState<any>(null);
  
  // O estado agora controla apenas o título e o status
  const [formData, setFormData] = useState({
    titulo: '',
    status: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchStudyData();
  }, [id]);

  const fetchStudyData = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await apiService.estudo.getById(Number(id));
      
      setOriginalData(data); // Guarda tudo para não perder campos ao atualizar

      const statusVisual = statusToUI[data.recruitmentStatus] || 'EM_ANDAMENTO';

      setFormData({
        titulo: data.publicTitle || '',
        status: statusOptions.includes(statusVisual) ? statusVisual : 'EM_ANDAMENTO',
      });

    } catch (error) {
      console.error('Erro ao buscar estudo', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do estudo.');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!formData.titulo.trim()) {
      Alert.alert('Atenção', 'O título do estudo não pode ficar vazio.');
      return;
    }

    try {
      setIsSaving(true);

      const statusBanco = uiToStatus[formData.status] || formData.status;

      // Monta o payload restaurando o scientificTitle e outros campos que não foram editados
      const payload = {
        pesquisadorId: originalData.pesquisador?.id || originalData.pesquisadorId,
        publicTitle: formData.titulo,
        recruitmentStatus: statusBanco, 
        
        scientificTitle: originalData.scientificTitle, // Usa o valor intocado do banco
        studyType: originalData.studyType,
        phase: originalData.phase,
        dateRegistration: originalData.dateRegistration,
        dateEnrolment: originalData.dateEnrolment,
        url: originalData.url,
        primarySponsor: originalData.primarySponsor,
        hcFreetext: originalData.hcFreetext,
        iFreetext: originalData.iFreetext,
        approvalDate: originalData.approvalDate,
        secId: originalData.secId,
        trialId: originalData.trialId,
      };

      await apiService.estudo.update(Number(id), payload);

      Alert.alert('Sucesso', 'As informações do estudo foram atualizadas!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      
    } catch (error) {
      console.error('Erro ao atualizar', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#15715A" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      
      <View style={styles.headerTitleContainer}>
        <Text style={styles.pageTitle}>Editar Estudo</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        
        <InputField
          label="Título do Estudo (Público)"
          value={formData.titulo}
          onChangeText={(text) => handleInputChange('titulo', text)}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status do Recrutamento</Text>
          <View style={styles.statusSelector}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.statusButton,
                  formData.status === option && styles.statusButtonActive
                ]}
                onPress={() => handleInputChange('status', option)}
                activeOpacity={0.8}
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
        
        <TouchableOpacity 
            style={[styles.submitButton, isSaving && { opacity: 0.7 }]} 
            onPress={handleUpdate}
            disabled={isSaving}
        >
          {isSaving ? (
             <ActivityIndicator color="#fff" />
          ) : (
             <Text style={styles.submitButtonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  backButton: { padding: 5 },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#212529', textAlign: 'center', flex: 1 },
  inputGroup: { width: '100%', marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '600', color: '#495057', marginBottom: 8 },
  input: { backgroundColor: '#fff', minHeight: 50, borderWidth: 1, borderColor: '#ced4da', borderRadius: 8, paddingHorizontal: 15, fontSize: 16 },
  textarea: { height: 120, textAlignVertical: 'top', paddingTop: 15 },
  submitButton: { backgroundColor: '#15715A', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  
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
    paddingVertical: 14,
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
    fontWeight: 'bold',
    color: '#6c757d',
  },
  statusTextActive: {
    color: '#fff',
  },
});