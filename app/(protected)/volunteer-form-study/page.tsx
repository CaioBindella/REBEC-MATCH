import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Header from '@/components/reusable/Header';
import { TextInputQuestion, RadioQuestion } from '@/components/volunteerComponents/FormQuestionsTypes';
import { volunteerFormConfig } from '@/components/volunteerComponents/FormQuestionsTypes/formConfig';

// import { useAuth } from '@/context/AuthContext'; // Para obter o ID do voluntário
// import { apiClient } from '@/services/apiClient'; // A sua instância do Axios/fetch

export default function VolunteerFormPage() {
  const router = useRouter();
  // const { user } = useAuth(); // Descomente quando o contexto estiver pronto
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    // ✨ 2. Lógica para enviar para a API
    setIsSubmitting(true);

    // Transforma o estado de respostas no formato esperado pela API,
    // que é uma lista de objetos, um para cada resposta.
    const payload = Object.keys(answers).map(questionId => ({
      // voluntario_id: user.id, // Obteria o ID do utilizador autenticado
      questao_id: questionId,
      conteudo: answers[questionId],
      marcado: true, // Ou alguma outra lógica
    }));

    try {
      console.log('Payload a ser enviado para a API:', JSON.stringify(payload, null, 2));
      
      // --- CHAMADA REAL À API (EXEMPLO) ---
      // Descomente a linha abaixo quando a sua função de API estiver pronta
      // await apiClient.post('/respostas', payload);

      // Simulação de atraso da rede
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert('Formulário Enviado', 'As suas respostas foram guardadas com sucesso!');
      router.back();

    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      Alert.alert('Erro', 'Não foi possível guardar as suas respostas. Tente novamente.');
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
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          />
        );
      case 'radio':
        return (
          <RadioQuestion
            key={question.id}
            label={question.label}
            options={question.options}
            value={answers[question.id]}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
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
          As suas respostas são confidenciais e fundamentais para o avanço da ciência.
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
          disabled={isSubmitting} // Desativa o botão durante o envio
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
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  submitButton: {
    backgroundColor: '#15715A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    minHeight: 50, // Garante altura consistente
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
