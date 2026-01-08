import React from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Header from '@/components/reusable/Header';
import ManageStudyCard, { StudySummary } from '@/components/researcherComponents/ManageStudyCard';
// import { useAuth } from '@/context/AuthContext'; // Você usaria isso para pegar o ID real
// import { getStudiesByResearcher } from '@/services/apiClient'; // E sua função de API

// Simulação de dados. Na vida real, uma chamada à API com o ID do pesquisador.
const mockStudies: StudySummary[] = [
  { id: 1, titulo: 'Estudo sobre Eficácia de Novo Medicamento para Enxaqueca', status: 'EM_ANDAMENTO' },
  { id: 5, titulo: 'Análise do Impacto de Exercícios Aeróbicos na Memória', status: 'RECRUTANDO' },
];

// Para testar o aviso de lista vazia, use a linha abaixo no lugar da de cima:
// const mockStudies: StudySummary[] = [];

export default function ManageStudiesPage() {
  const router = useRouter();
  // const { user } = useAuth();
  // const { data: studies, isLoading } = useQuery(['studies', user.id], () => getStudiesByResearcher(user.id));
  
  // Usando os dados simulados por enquanto
  const studies = mockStudies;
  const isLoading = false;

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#15715A" /></View>;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <View style={styles.content}>
        <View style={styles.profileTag}>
          <Text style={styles.profileTagText}>Perfil Pesquisador</Text>
        </View>
        <Text style={styles.pageTitle}>Gerenciar Meus Estudos</Text>
        {studies.length > 0 ? (
          <FlatList
            data={studies}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <ManageStudyCard
                study={item}
                onEdit={() =>
                  router.push({
                    pathname: "/(protected)/researcher/manage-studies/edit/[id]",
                    params: { id: item.id },
                  })
                }
              />
            )}
          />
        ) : (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Você ainda não registrou nenhum estudo.</Text>
            <TouchableOpacity style={styles.createButton} onPress={() => router.push('/(protected)/researcher/create-study/page')}>
              <Text style={styles.createButtonText}>Criar Primeiro Estudo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  content: { flex: 1, padding: 16 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginBottom: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, color: '#6c757d', textAlign: 'center', marginBottom: 20 },
  createButton: { backgroundColor: '#15715A', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  createButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
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