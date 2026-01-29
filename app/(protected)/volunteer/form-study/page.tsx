import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Header from '@/components/reusable/Header';
import { TextInputQuestion, RadioQuestion } from '@/components/volunteerComponents/FormQuestionsTypes';
import { volunteerFormConfig } from '@/components/volunteerComponents/FormQuestionsTypes/formConfig';

// Hooks e API
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api/apiClient';

export default function VolunteerFormPage() {
  const router = useRouter();
  const { user } = useAuth(); // Agora usamos o usuário real
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return; // Segurança

    setIsSubmitting(true);

    try {
      // 1. Transforma as respostas no formato do DTO Java (RespostasBatchCreateDTO)
      const respostasFormatadas = Object.keys(answers).map(key => ({
        questao_id: Number(key), // Converte ID da questão para numero
        conteudo: String(answers[key]), // Garante que é string
        marcado: true, // Define como marcado pois foi respondida
      }));

      // 2. Monta o Payload Completo
      const payload = {
        voluntario_id: user.id, // ID do Usuário (que o backend usa para achar o voluntário)
        formulario_id: 1,       // ID do Formulário Padrão (ajuste se tiver mais de um)
        respostas: respostasFormatadas
      };

      console.log('Enviando:', JSON.stringify(payload));

      // 3. Chama a API
      await apiService.resposta.criarEmLote(payload);

      Alert.alert('Sucesso', 'Formulário enviado! Agora você tem acesso ao painel completo.');
      
      // Redireciona para a Home (onde a verificação vai rodar novamente e liberar o acesso)
      router.replace('/(protected)/home/page');

    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      Alert.alert('Erro', 'Não foi possível salvar suas respostas. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'text':
        return (
          <TextInputQuestion
            key={question.id}
            label={question.label}
            placeholder={question.placeholder}
            value={answers[question.id] || ''}
            onValueChange={(value) => handleAnswerChange(String(question.id), value)}
          />
        );
      case 'radio':
        return (
          <RadioQuestion
            key={question.id}
            label={question.label}
            options={question.options}
            value={answers[question.id]}
            onValueChange={(value) => handleAnswerChange(String(question.id), value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Formulário do Voluntário</Text>
        <Text style={styles.pageSubtitle}>
          Responda as perguntas abaixo para completarmos seu perfil de pesquisa.
        </Text>

        {volunteerFormConfig.map(section => (
          <View key={section.id} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.questions.map(renderQuestion)}
          </View>
        ))}

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Enviar Respostas</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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