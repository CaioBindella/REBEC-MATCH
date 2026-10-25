import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import Header from '@/components/reusable/Header';
import StudyForm, { StudyFormValues } from '@/components/researcherComponents/StudyForm';
import { useAuth } from '@/context/AuthContext';
import { apiService, getErrorMessage } from '@/services/api/apiClient';
import { toCriterioPayload, toEstudoPayload } from '@/utils/studyPayload';

/** Cadastro de um novo estudo pelo pesquisador autenticado, com seu critério de elegibilidade. */
export default function CreateStudyPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSubmit = async (values: StudyFormValues) => {
    try {
      // O pesquisador responsável é identificado pela API a partir do token
      const estudo = await apiService.estudo.create(toEstudoPayload(values));
      await apiService.criterio.create({ estudo_id: estudo.id, ...toCriterioPayload(values) });

      Alert.alert('Sucesso', 'Estudo registrado com sucesso!', [
        { text: 'OK', onPress: () => router.replace('/(protected)/researcher/manage-studies/page') },
      ]);
    } catch (error) {
      Alert.alert('Erro', getErrorMessage(error, 'Não foi possível registrar o estudo.'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.profileTag}>
            <Text style={styles.profileTagText}>{user?.nomeFicticio || 'Pesquisador'}</Text>
          </View>
          <Text style={styles.pageTitle}>Registrar Novo Estudo</Text>
          <StudyForm submitLabel="Salvar Estudo" onSubmit={handleSubmit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  scrollContainer: { padding: 20, paddingBottom: 50 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginBottom: 24 },
  profileTag: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  profileTagText: { color: '#166865', fontWeight: '500' },
});
