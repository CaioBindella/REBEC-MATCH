import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';

import Header from '@/components/reusable/Header';
import StudyForm, { StudyFormValues } from '@/components/researcherComponents/StudyForm';
import { apiService, getErrorMessage } from '@/services/api/apiClient';
import { EstudoResponseDTO } from '@/types/types';
import { fromEstudo, toCriterioPayload, toEstudoPayload } from '@/utils/studyPayload';
import { avisar } from '@/utils/feedback';

/** Edição dos dados, do status de recrutamento e dos critérios de um estudo do pesquisador. */
export default function EditStudyPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [estudo, setEstudo] = useState<EstudoResponseDTO | null>(null);

  useEffect(() => {
    if (!id) return;
    apiService.estudo
      .getById(Number(id))
      .then(setEstudo)
      .catch((error) => {
        avisar('Erro', getErrorMessage(error, 'Não foi possível carregar os detalhes do estudo.'), () =>
          router.back()
        );
      });
  }, [id, router]);

  const handleUpdate = async (values: StudyFormValues) => {
    if (!estudo) return;
    try {
      await apiService.estudo.update(estudo.id, toEstudoPayload(values));
      const criterio = toCriterioPayload(values);
      if (estudo.criterios.length > 0) {
        await apiService.criterio.update(estudo.criterios[0].id, criterio);
      } else {
        await apiService.criterio.create({ estudo_id: estudo.id, ...criterio });
      }
      avisar('Estudo atualizado', 'As informações do estudo foram salvas.', () =>
        router.canGoBack() ? router.back() : router.replace('/(protected)/researcher/manage-studies/page')
      );
    } catch (error) {
      avisar('Erro', getErrorMessage(error, 'Não foi possível salvar as alterações.'));
    }
  };

  if (!estudo) {
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
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.pageTitle}>Editar Estudo</Text>
          <StudyForm
            initialValues={fromEstudo(estudo)}
            submitLabel="Salvar Alterações"
            onSubmit={handleUpdate}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#212529', marginBottom: 20 },
});
