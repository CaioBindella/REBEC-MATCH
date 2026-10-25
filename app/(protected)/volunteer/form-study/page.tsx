import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';

import Header from '@/components/reusable/Header';
import { DynamicQuestion } from '@/components/volunteerComponents/FormQuestionsTypes';
import { apiService, getErrorMessage, ID_FORMULARIO_PERFIL } from '@/services/api/apiClient';
import { QuestaoResponseDTO } from '@/types/types';

/**
 * Formulário de perfil inicial (triagem). As questões, seus tipos, opções, seções e a obrigatoriedade
 * vêm do banco de dados (formulário global id = 1), e as respostas são enviadas em uma única requisição.
 */
export default function VolunteerFormPage() {
  const router = useRouter();
  const [questoes, setQuestoes] = useState<QuestaoResponseDTO[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    apiService.questao
      .listarPorFormulario(ID_FORMULARIO_PERFIL)
      .then(setQuestoes)
      .catch((error) => Alert.alert('Erro', getErrorMessage(error, 'Não foi possível carregar o formulário.')))
      .finally(() => setLoading(false));
  }, []);

  // Agrupa as questões pela seção temática, preservando a ordem do formulário
  const secoes = useMemo(() => {
    const grupos: { titulo: string; questoes: QuestaoResponseDTO[] }[] = [];
    for (const questao of questoes) {
      const titulo = questao.secao || 'Questões';
      let grupo = grupos.find((g) => g.titulo === titulo);
      if (!grupo) {
        grupo = { titulo, questoes: [] };
        grupos.push(grupo);
      }
      grupo.questoes.push(questao);
    }
    return grupos;
  }, [questoes]);

  const handleAnswerChange = (questaoId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questaoId]: value }));
    setErrors((prev) => ({ ...prev, [questaoId]: '' }));
  };

  const handleSubmit = async () => {
    // Validação local das questões obrigatórias (a API aplica a mesma regra)
    const pendentes: Record<number, string> = {};
    for (const questao of questoes) {
      if (questao.obrigatorio && !(answers[questao.id] ?? '').trim()) {
        pendentes[questao.id] = 'Esta questão é obrigatória.';
      }
    }
    if (Object.keys(pendentes).length > 0) {
      setErrors(pendentes);
      Alert.alert('Atenção', `Responda às ${Object.keys(pendentes).length} questões obrigatórias destacadas.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.resposta.criarEmLote({
        formulario_id: ID_FORMULARIO_PERFIL,
        respostas: questoes
          .filter((q) => (answers[q.id] ?? '').trim() !== '')
          .map((q) => ({
            questao_id: q.id,
            conteudo: answers[q.id].trim(),
            marcado: q.tipo === 'OPCOES',
          })),
      });

      Alert.alert('Sucesso', 'Formulário enviado! Agora você tem acesso ao painel completo.');
      // A home verifica novamente as respostas e libera o painel do voluntário
      router.replace('/(protected)/home/page');
    } catch (error) {
      Alert.alert('Erro', getErrorMessage(error, 'Não foi possível salvar suas respostas. Tente novamente.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      {loading ? (
        <ActivityIndicator size="large" color="#15715A" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.pageTitle}>Formulário do Voluntário</Text>
          <Text style={styles.pageSubtitle}>
            Responda as perguntas abaixo para completarmos seu perfil de pesquisa. Os campos com * são obrigatórios.
          </Text>

          {secoes.map((secao) => (
            <View key={secao.titulo} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{secao.titulo}</Text>
              {secao.questoes.map((questao) => (
                <DynamicQuestion
                  key={questao.id}
                  questao={questao}
                  value={answers[questao.id] ?? ''}
                  onValueChange={(value) => handleAnswerChange(questao.id, value)}
                  error={errors[questao.id]}
                />
              ))}
            </View>
          ))}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting || questoes.length === 0}>
            {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Enviar Respostas</Text>}
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20, paddingBottom: 50 },
  pageTitle: { fontSize: 26, fontWeight: 'bold', color: '#212529' },
  pageSubtitle: { fontSize: 16, color: '#6c757d', marginBottom: 30, marginTop: 4 },
  sectionContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#343a40', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  submitButton: { backgroundColor: '#15715A', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 20, minHeight: 50 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
