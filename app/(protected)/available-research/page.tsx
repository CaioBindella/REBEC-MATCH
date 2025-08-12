import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import Header from '@/components/Header';
import { StudyCard, StudySummary } from '@/components/StudyCard';
import { getAvailableStudies } from '@/services/api/apiClient'; // Importando sua função da API

export default function AvailableStudiesScreen() {
  const router = useRouter();
  const [studies, setStudies] = useState<StudySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudies() {
      try {
        setLoading(true);
        console.log('Simulando chamada à API para buscar estudos...');
        const response = await getAvailableStudies();
        console.log('Dados simulados retornados.');
        setStudies(response);
      } catch (err) {
        setError('Não foi possível carregar as pesquisas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStudies();
  }, []);

  const handleNavigateToDetails = (id: number) => {
    // Navega para a tela de detalhes, usando a estrutura de pastas correta
    router.push({
      pathname: "/available-research/[id]",
      params: { id: id },
    });
  };

  if (loading) {
    return <View style={styles.centeredContainer}><ActivityIndicator size="large" color="#15715A" /></View>;
  }

  if (error) {
    return <View style={styles.centeredContainer}><Text style={styles.errorText}>{error}</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* O Stack.Screen pode ser movido para o _layout.tsx se preferir */}
      <Stack.Screen options={{ title: 'Pesquisas Disponíveis' }} />
      <Header />
      <FlatList
        data={studies}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <StudyCard
            study={item}
            onPress={() => handleNavigateToDetails(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  listContent: {
    padding: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#555',
  },
});