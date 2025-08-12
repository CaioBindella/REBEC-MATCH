import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SelectedStudyCard, SelectedStudy } from '@/components/SelectedStudyCard';
import Header from '@/components/Header';

// Simulação de dados que viriam da sua API
const mockSelectedStudies: SelectedStudy[] = [
  { id: 1, titulo: 'Estudo sobre Eficácia de Novo Medicamento para Enxaqueca', pesquisador: { nomeFicticio: 'PS_RJ4324' } },
  { id: 4, titulo: 'Impacto da Dieta Mediterrânea na Saúde Cognitiva', pesquisador: { nomeFicticio: 'PS_SP4590' } },
];

// Para testar a mensagem de lista vazia, use esta linha:
// const mockSelectedStudies: SelectedStudy[] = [];

export default function MyStudiesScreen() {
  const router = useRouter();
  const [studies, setStudies] = useState<SelectedStudy[]>([]);
  const [filteredStudies, setFilteredStudies] = useState<SelectedStudy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula a busca de dados
    setTimeout(() => {
      setStudies(mockSelectedStudies);
      setFilteredStudies(mockSelectedStudies);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Lógica do filtro de busca
    if (searchTerm === '') {
      setFilteredStudies(studies);
    } else {
      const filtered = studies.filter(study =>
        study.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudies(filtered);
    }
  }, [searchTerm, studies]);

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#15715A" /></View>;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Meus Estudos' }} />
      <Header />
      <View style={styles.content}>
        <Text style={styles.screenTitle}>Estudos Selecionados</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título..."
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {filteredStudies.length > 0 ? (
          <FlatList
            data={filteredStudies}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <SelectedStudyCard
                study={item}
                onChatPress={() =>
                    router.push({
                    pathname: "/chat/[id]",
                    params: { id: item.id },
                    })
                }
              />
            )}
          />
        ) : (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              {searchTerm ? 'Nenhum estudo encontrado.' : 'Você ainda não foi selecionado para nenhum estudo.'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  content: { flex: 1, padding: 16 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginBottom: 16 },
  searchInput: {
    backgroundColor: '#fff',
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});