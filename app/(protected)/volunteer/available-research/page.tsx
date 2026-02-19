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
  Keyboard,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash.debounce';

import Header from '@/components/reusable/Header';
import { StudyCard, StudySummary } from '@/components/volunteerComponents/StudyCard';
import { apiService } from '@/services/api/apiClient'; 
import { useAuth } from '@/context/AuthContext';

interface Doenca {
  id: number;
  nomeCientifico: string;
  nomePopular?: string;
}

type StudyData = StudySummary & { 
    doencas?: string[];
    jaCandidatou?: boolean; 
};

type TabOption = 'available' | 'applied'; // Controle de Abas

export default function AvailableStudiesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [allStudies, setAllStudies] = useState<StudyData[]>([]);
  const [activeTab, setActiveTab] = useState<TabOption>('available'); // Aba ativa
  const [visibleCount, setVisibleCount] = useState(10); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestedDoencas, setSuggestedDoencas] = useState<Doenca[]>([]); 
  const [isSearchingDoenca, setIsSearchingDoenca] = useState(false);

  const [loading, setLoading] = useState(true);

  // Busca dados e cruza com os já candidatados
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const voluntarioId = user?.perfilId;
        
        const [estudosData, candidaturasData] = await Promise.all([
            apiService.estudo.listRecruiting(),
            voluntarioId ? apiService.candidatura.listarPorVoluntario(voluntarioId) : Promise.resolve([])
        ]);
        
        const estudosCandidatadosIds = new Set(candidaturasData.map((c: any) => c.estudoId));
        
        const formatted = estudosData.map((item: any) => ({
            id: item.id,
            titulo: item.publicTitle,
            informacoesGerais: item.scientificTitle || 'Ver detalhes.',
            status: 'RECRUTANDO',
            doencas: item.nomesDoencas || [],
            jaCandidatou: estudosCandidatadosIds.has(item.id) 
        }));

        setAllStudies(formatted);
      } catch (err) {
        console.error("Erro ao carregar estudos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

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
        console.error("Erro na busca", error);
      } finally {
        setIsSearchingDoenca(false);
      }
    }, 500), 
    []
  );

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    searchDoencasApi(text);
    setVisibleCount(10);
  };

  const selectDoenca = (doenca: Doenca) => {
      const nome = doenca.nomePopular || doenca.nomeCientifico;
      setSearchTerm(nome);
      setShowDropdown(false);
      Keyboard.dismiss();
      setVisibleCount(10);
  };

  // Lógica principal de Filtro (Abas + Busca Textual)
  const getDisplayList = () => {
      // 1. Filtra pela Aba Ativa
      let baseList = allStudies;
      if (activeTab === 'available') {
          baseList = allStudies.filter(s => !s.jaCandidatou); // Apenas novos
      } else {
          baseList = allStudies.filter(s => s.jaCandidatou);  // Apenas inscritos
      }

      // 2. Filtra pela Busca (se houver texto)
      if (searchTerm.trim() !== '') {
          const lower = searchTerm.toLowerCase();
          baseList = baseList.filter(s => 
              s.titulo.toLowerCase().includes(lower) || 
              s.doencas?.some(d => d.toLowerCase().includes(lower))
          );
      }

      return baseList;
  };

  const displayList = getDisplayList();

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
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            />
            {searchTerm.length > 0 && (
                <TouchableOpacity onPress={() => { setSearchTerm(''); }}>
                    <Ionicons name="close-circle" size={18} color="#ccc" />
                </TouchableOpacity>
            )}
        </View>

        {showDropdown && (
            <View style={styles.dropdown}>
                {isSearchingDoenca ? (
                    <ActivityIndicator size="small" color="#15715A" style={{ margin: 20 }} />
                ) : (
                    <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 200 }}>
                        {suggestedDoencas.length > 0 ? (
                            suggestedDoencas.map((d, index) => (
                                <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => selectDoenca(d)}>
                                    <Text style={styles.ddMainText}>{d.nomePopular || d.nomeCientifico}</Text>
                                    {d.nomePopular && <Text style={styles.ddSubText}>{d.nomeCientifico}</Text>}
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={{ padding: 15, color: '#999', fontStyle: 'italic', textAlign: 'center' }}>
                                Nenhuma doença encontrada.
                            </Text>
                        )}
                    </ScrollView>
                )}
            </View>
        )}
      </View>

      {/* --- ABAS DE NAVEGAÇÃO --- */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'available' && styles.activeTabButton]}
            onPress={() => { setActiveTab('available'); setVisibleCount(10); }}
        >
            <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
                Novos Estudos
            </Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'applied' && styles.activeTabButton]}
            onPress={() => { setActiveTab('applied'); setVisibleCount(10); }}
        >
            <Text style={[styles.tabText, activeTab === 'applied' && styles.activeTabText]}>
                Já Inscritos
            </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayList.slice(0, visibleCount)}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={[styles.cardContainer, item.jaCandidatou && styles.cardContainerApplied]}>
             
             {item.jaCandidatou && (
                 <View style={styles.appliedBadge}>
                     <Ionicons name="checkmark-circle" size={16} color="#856404" />
                     <Text style={styles.appliedText}>Você já se candidatou para este estudo</Text>
                 </View>
             )}

             <StudyCard
               study={item}
               onPress={() => {
                   // NAVEGAÇÃO LIVRE: Ele pode acessar os detalhes mesmo se for inscrito
                   router.push({
                       pathname: "/(protected)/volunteer/available-research/[id]",
                       params: { id: item.id },
                   });
               }}
             />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={48} color="#ccc" style={{ marginBottom: 12 }} />
                <Text style={styles.emptyText}>
                    {activeTab === 'available' 
                        ? 'Nenhum estudo novo encontrado.' 
                        : 'Você ainda não se candidatou a nenhum estudo.'}
                </Text>
            </View>
        }
        ListFooterComponent={
            <View style={styles.footer}>
                {displayList.length > visibleCount ? (
                    <TouchableOpacity style={styles.showMoreButton} onPress={() => setVisibleCount(v => v + 10)}>
                        <Text style={styles.showMoreText}>Ver mais resultados</Text>
                        <Ionicons name="chevron-down" size={16} color="#15715A" />
                    </TouchableOpacity>
                ) : (
                    !loading && displayList.length > 0 && (
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
  searchWrapper: { padding: 16, backgroundColor: '#fff', zIndex: 10, paddingBottom: 0 },
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

  // Estilos das Abas
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTabButton: {
    backgroundColor: '#E0F2F1', 
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  activeTabText: {
    color: '#15715A',
    fontWeight: 'bold',
  },

  cardContainer: {
    marginBottom: 16,
  },
  cardContainerApplied: {
    opacity: 0.9, 
  },
  appliedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd', 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopLeftRadius: 12, 
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: '#ffeeba',
    borderBottomWidth: 0,
    marginBottom: -5, 
    zIndex: 1,
  },
  appliedText: {
    marginLeft: 6,
    color: '#856404',
    fontSize: 13,
    fontWeight: 'bold',
  },
});