import Header from '@/components/reusable/Header';
import { StudyCard, StudySummary } from '@/components/volunteerComponents/StudyCard';
import { getAvailableStudies } from '@/services/api/apiClient';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
  ActivityIndicator, 
  FlatList, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  Keyboard 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AvailableStudiesScreen() {
  const router = useRouter();
  const [studies, setStudies] = useState<StudySummary[]>([]);
  const [filteredStudies, setFilteredStudies] = useState<StudySummary[]>([]); // Estado para a lista filtrada
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o texto da busca
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
        setFilteredStudies(response); // Inicializa a lista filtrada com todos os estudos
      } catch (err) {
        setError('Não foi possível carregar as pesquisas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStudies();
  }, []);

  // Função que realiza a filtragem
  const handleSearch = () => {
    Keyboard.dismiss(); // Esconde o teclado ao pesquisar
    if (!searchTerm.trim()) {
      setFilteredStudies(studies); // Se vazio, mostra tudo
      return;
    }

    const lowerTerm = searchTerm.toLowerCase();
    const results = studies.filter(study => 
      study.titulo.toLowerCase().includes(lowerTerm)
      // Se houver um campo de descrição ou doença específica no objeto study, adicione aqui:
      // || study.descricao.toLowerCase().includes(lowerTerm)
    );
    setFilteredStudies(results);
  };

  const handleNavigateToDetails = (id: number) => {
    router.push({
      pathname: "/volunteer/available-research/[id]",
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
      <Stack.Screen options={{ title: 'Pesquisas Disponíveis' }} />
      <Header />

      {/* --- Área de Pesquisa --- */}
      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
            style={styles.searchInput}
            placeholder="Procure por doença (ex: Enxaqueca)..."
            placeholderTextColor="#888"
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch} // Pesquisa ao dar enter no teclado
            returnKeyType="search"
            />
            {searchTerm.length > 0 && (
                <TouchableOpacity onPress={() => { setSearchTerm(''); setFilteredStudies(studies); }}>
                    <Ionicons name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
            )}
        </View>
        
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Pesquisar</Text>
        </TouchableOpacity>
      </View>

      {/* --- Lista de Resultados --- */}
      <FlatList
        data={filteredStudies}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <StudyCard
            study={item}
            onPress={() => handleNavigateToDetails(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Nenhum estudo encontrado para "{searchTerm}".</Text>
            </View>
        }
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
  
  // Estilos da Barra de Pesquisa
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 44,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#15715A',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Estilo para lista vazia
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
  }
});