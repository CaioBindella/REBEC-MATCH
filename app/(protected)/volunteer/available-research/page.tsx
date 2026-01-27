import React, { useEffect, useState, useCallback } from 'react';
import { 
  ActivityIndicator, 
  FlatList, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  ScrollView,
  Keyboard
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash.debounce'; // DICA: Instale com 'npm install lodash.debounce' e 'npm i --save-dev @types/lodash.debounce'

import Header from '@/components/reusable/Header';
import { StudyCard, StudySummary } from '@/components/volunteerComponents/StudyCard';
import { apiService } from '@/services/api/apiClient'; 

// Tipos
interface Doenca {
  id: number;
  nomeCientifico: string;
  nomePopular?: string;
}

type StudyData = StudySummary & { doencas?: string[] };

export default function AvailableStudiesScreen() {
  const router = useRouter();
  
  // Dados
  const [allStudies, setAllStudies] = useState<StudyData[]>([]); // Guarda todos os estudos recrutando
  const [filteredStudies, setFilteredStudies] = useState<StudyData[]>([]); // Lista exibida na tela
  
  // Controle de Paginação Local
  const [visibleCount, setVisibleCount] = useState(10); 
  
  // Busca e Dropdown
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestedDoencas, setSuggestedDoencas] = useState<Doenca[]>([]); // Doenças vindas da API
  const [isSearchingDoenca, setIsSearchingDoenca] = useState(false);

  const [loading, setLoading] = useState(true);

  // 1. Carrega APENAS estudos recrutando (Carga inicial muito mais leve)
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await apiService.estudo.listRecruiting();
        
        const formatted = data.map((item: any) => ({
            id: item.id,
            titulo: item.publicTitle,
            informacoesGerais: item.scientificTitle || 'Ver detalhes.',
            status: 'RECRUTANDO',
            doencas: item.nomesDoencas || [] 
        }));

        setAllStudies(formatted);
        setFilteredStudies(formatted);
      } catch (err) {
        console.error("Erro ao carregar estudos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. Função de busca de doenças no Backend (Debounced)
  // Isso evita chamar a API a cada letra digitada, espera o usuário parar de digitar por 500ms
  const searchDoencasApi = useCallback(
    debounce(async (text: string) => {
      if (text.length < 3) {
          setSuggestedDoencas([]);
          return;
      }
      try {
        setIsSearchingDoenca(true);
        const results = await apiService.doenca.search(text);
        setSuggestedDoencas(results);
        setShowDropdown(true);
      } catch (error) {
        console.error("Erro na busca de doenças", error);
      } finally {
        setIsSearchingDoenca(false);
      }
    }, 500), 
    []
  );

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    
    // Chama a busca na API para o dropdown
    searchDoencasApi(text);
    
    // Filtra localmente os estudos que já carregamos
    filterStudiesLocal(text);
  };

  const selectDoenca = (doenca: Doenca) => {
      const nome = doenca.nomePopular || doenca.nomeCientifico;
      setSearchTerm(nome);
      setShowDropdown(false);
      Keyboard.dismiss();
      filterStudiesLocal(nome);
  };

  const filterStudiesLocal = (term: string) => {
      if (!term.trim()) {
          setFilteredStudies(allStudies);
          return;
      }
      const lower = term.toLowerCase();
      const results = allStudies.filter(s => 
          s.titulo.toLowerCase().includes(lower) || 
          s.doencas?.some(d => d.toLowerCase().includes(lower))
      );
      setFilteredStudies(results);
      setVisibleCount(10);
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#15715A" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Pesquisas Disponíveis' }} />
      <Header />

      <View style={[styles.searchWrapper, { zIndex: 100 }]}>
        <View style={styles.inputContainer}>
            <Ionicons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
            <TextInput
                style={styles.input}
                placeholder="Busque por doença (min 3 letras)..."
                placeholderTextColor="#999"
                value={searchTerm}
                onChangeText={handleSearchChange}
                // Delay para fechar o dropdown e permitir o clique
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            {searchTerm.length > 0 && (
                <TouchableOpacity onPress={() => { setSearchTerm(''); filterStudiesLocal(''); }}>
                    <Ionicons name="close-circle" size={18} color="#ccc" />
                </TouchableOpacity>
            )}
        </View>

        {/* Lógica do Dropdown com Loading */}
        {showDropdown && (
            <View style={styles.dropdown}>
                {isSearchingDoenca ? (
                    // Mostra o Círculo enquanto espera a API
                    <ActivityIndicator size="small" color="#15715A" style={{ margin: 20 }} />
                ) : (
                    // Mostra a lista quando termina
                    <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 200 }}>
                        {suggestedDoencas.length > 0 ? (
                            suggestedDoencas.map((d, index) => (
                                <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => selectDoenca(d)}>
                                    <Text style={styles.ddMainText}>{d.nomePopular || d.nomeCientifico}</Text>
                                    {d.nomePopular && <Text style={styles.ddSubText}>{d.nomeCientifico}</Text>}
                                </TouchableOpacity>
                            ))
                        ) : (
                            // Se não achou nada na API
                            <Text style={{ padding: 15, color: '#999', fontStyle: 'italic', textAlign: 'center' }}>
                                Nenhuma doença encontrada.
                            </Text>
                        )}
                    </ScrollView>
                )}
            </View>
        )}
      </View>

      <FlatList
        data={filteredStudies.slice(0, visibleCount)}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <StudyCard
            study={item}
            onPress={() => router.push({
                pathname: "/(protected)/volunteer/available-research/[id]",
                params: { id: item.id },
            })}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum estudo encontrado.</Text>
            </View>
        }
        ListFooterComponent={
            <View style={styles.footer}>
                {filteredStudies.length > visibleCount ? (
                    <TouchableOpacity style={styles.showMoreButton} onPress={() => setVisibleCount(v => v + 10)}>
                        <Text style={styles.showMoreText}>Ver mais resultados</Text>
                        <Ionicons name="chevron-down" size={16} color="#15715A" />
                    </TouchableOpacity>
                ) : (
                    !loading && filteredStudies.length > 0 && (
                        <Text style={styles.endText}>Você viu todos os resultados.</Text>
                    )
                )}
            </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingBottom: 40 },
  searchWrapper: { padding: 16, backgroundColor: '#fff', zIndex: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f3f5', borderRadius: 8, paddingHorizontal: 12, height: 48 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  dropdown: { position: 'absolute', top: 70, left: 16, right: 16, backgroundColor: '#fff', borderRadius: 8, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, borderWidth: 1, borderColor: '#e9ecef' },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f3f5' },
  ddMainText: { fontSize: 16, color: '#212529' },
  ddSubText: { fontSize: 12, color: '#868e96', fontStyle: 'italic' },
  footer: { alignItems: 'center', paddingVertical: 20 },
  showMoreButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#15715A', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  showMoreText: { color: '#15715A', fontWeight: 'bold', marginRight: 5 },
  endText: { color: '#adb5bd', fontSize: 14 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#adb5bd', fontSize: 16 },
});