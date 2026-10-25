import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  Switch,
  Alert,
} from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash.debounce';

import Header from '@/components/reusable/Header';
import { StudyCard, StudySummary } from '@/components/volunteerComponents/StudyCard';
import { apiService, getErrorMessage } from '@/services/api/apiClient';
import { useAuth } from '@/context/AuthContext';
import { DoencaResponseDTO, EstudoResponseDTO } from '@/types/types';

type StudyData = StudySummary & { jaCandidatou: boolean };
type TabOption = 'available' | 'applied';

const TAMANHO_MINIMO_BUSCA = 3;

export default function AvailableStudiesScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [recrutando, setRecrutando] = useState<EstudoResponseDTO[]>([]);
  const [compativeisIds, setCompativeisIds] = useState<Set<number>>(new Set());
  const [candidatadosIds, setCandidatadosIds] = useState<Set<number>>(new Set());
  const [resultadosBusca, setResultadosBusca] = useState<EstudoResponseDTO[] | null>(null);

  const [activeTab, setActiveTab] = useState<TabOption>('available');
  const [apenasCompativeis, setApenasCompativeis] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestedDoencas, setSuggestedDoencas] = useState<DoencaResponseDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estudos em recrutamento, estudos compatíveis com o perfil (filtragem por regras da API)
  // e candidaturas do voluntário, cruzadas no cliente para separar as abas
  const loadData = useCallback(async () => {
    if (!user?.perfilId) return;
    try {
      const [estudos, compativeis, candidaturas] = await Promise.all([
        apiService.estudo.listRecruiting(),
        apiService.match.estudosCompativeis(),
        apiService.candidatura.listarPorVoluntario(user.perfilId),
      ]);
      setRecrutando(estudos);
      setCompativeisIds(new Set(compativeis.map((e) => e.id)));
      setCandidatadosIds(new Set(candidaturas.map((c) => c.estudoId)));
    } catch (error) {
      Alert.alert('Erro', getErrorMessage(error, 'Não foi possível carregar os estudos.'));
    } finally {
      setLoading(false);
    }
  }, [user?.perfilId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Busca com debounce: sugestões do vocabulário controlado e estudos encontrados pela API
  const buscar = useMemo(
    () =>
      debounce(async (texto: string) => {
        if (texto.trim().length < TAMANHO_MINIMO_BUSCA) {
          setSuggestedDoencas([]);
          setResultadosBusca(null);
          return;
        }
        try {
          setIsSearching(true);
          const [doencas, estudos] = await Promise.all([
            apiService.doenca.search(texto.trim()),
            apiService.estudo.searchByDoenca(texto.trim()),
          ]);
          setSuggestedDoencas(doencas);
          setResultadosBusca(estudos);
          setShowDropdown(true);
        } catch (error) {
          console.error('Erro na busca', error);
        } finally {
          setIsSearching(false);
        }
      }, 500),
    []
  );

  useEffect(() => () => buscar.cancel(), [buscar]);

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    setVisibleCount(10);
    buscar(text);
  };

  const selectDoenca = async (doenca: DoencaResponseDTO) => {
    const nome = doenca.nomePopular || doenca.nomeCientifico;
    setSearchTerm(nome);
    setShowDropdown(false);
    Keyboard.dismiss();
    setVisibleCount(10);
    try {
      setIsSearching(true);
      setResultadosBusca(await apiService.estudo.searchByDoenca(nome));
    } catch (error) {
      Alert.alert('Erro', getErrorMessage(error));
    } finally {
      setIsSearching(false);
    }
  };

  const limparBusca = () => {
    buscar.cancel();
    setSearchTerm('');
    setSuggestedDoencas([]);
    setResultadosBusca(null);
    setShowDropdown(false);
  };

  // Lista exibida: resultado da busca (ou todos em recrutamento), separado por aba e,
  // na aba de novos estudos, opcionalmente restrito aos compatíveis com o perfil
  const displayList: StudyData[] = useMemo(() => {
    const base = resultadosBusca ?? recrutando;
    return base
      .map((item) => ({
        id: item.id,
        titulo: item.publicTitle,
        informacoesGerais: item.scientificTitle || 'Ver detalhes.',
        status: item.recruitmentStatus,
        doencas: item.nomesDoencas,
        compativel: compativeisIds.has(item.id),
        jaCandidatou: candidatadosIds.has(item.id),
      }))
      .filter((s) =>
        activeTab === 'applied' ? s.jaCandidatou : !s.jaCandidatou && (!apenasCompativeis || s.compativel)
      );
  }, [resultadosBusca, recrutando, compativeisIds, candidatadosIds, activeTab, apenasCompativeis]);

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
            placeholder="Busque por doença (mín. 3 letras)..."
            placeholderTextColor="#999"
            value={searchTerm}
            onChangeText={handleSearchChange}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          {isSearching && <ActivityIndicator size="small" color="#15715A" style={{ marginRight: 8 }} />}
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={limparBusca}>
              <Ionicons name="close-circle" size={18} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>

        {showDropdown && suggestedDoencas.length > 0 && (
          <View style={styles.dropdown}>
            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 200 }}>
              {suggestedDoencas.map((d) => (
                <TouchableOpacity key={d.id} style={styles.dropdownItem} onPress={() => selectDoenca(d)}>
                  <Text style={styles.ddMainText}>{d.nomePopular || d.nomeCientifico}</Text>
                  {d.nomePopular !== d.nomeCientifico && <Text style={styles.ddSubText}>{d.nomeCientifico}</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* --- ABAS DE NAVEGAÇÃO --- */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'available' && styles.activeTabButton]}
          onPress={() => { setActiveTab('available'); setVisibleCount(10); }}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>Novos Estudos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'applied' && styles.activeTabButton]}
          onPress={() => { setActiveTab('applied'); setVisibleCount(10); }}
        >
          <Text style={[styles.tabText, activeTab === 'applied' && styles.activeTabText]}>Já Inscritos</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'available' && (
        <View style={styles.compatRow}>
          <Text style={styles.compatText}>Somente compatíveis com minha idade e sexo</Text>
          <Switch
            value={apenasCompativeis}
            onValueChange={(v) => { setApenasCompativeis(v); setVisibleCount(10); }}
            trackColor={{ false: '#ccc', true: '#a7f3d0' }}
            thumbColor={apenasCompativeis ? '#15715A' : '#f4f3f4'}
          />
        </View>
      )}

      <FlatList
        data={displayList.slice(0, visibleCount)}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            {item.jaCandidatou && (
              <View style={styles.appliedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#856404" />
                <Text style={styles.appliedText}>Você já se candidatou para este estudo</Text>
              </View>
            )}
            <StudyCard
              study={item}
              onPress={() =>
                router.push({ pathname: '/(protected)/volunteer/available-research/[id]', params: { id: item.id } })
              }
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color="#ccc" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyText}>
              {activeTab === 'available'
                ? apenasCompativeis
                  ? 'Nenhum estudo compatível encontrado. Desative o filtro para ver todos.'
                  : 'Nenhum estudo novo encontrado.'
                : 'Você ainda não se candidatou a nenhum estudo.'}
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            {displayList.length > visibleCount ? (
              <TouchableOpacity style={styles.showMoreButton} onPress={() => setVisibleCount((v) => v + 10)}>
                <Text style={styles.showMoreText}>Ver mais resultados</Text>
                <Ionicons name="chevron-down" size={16} color="#15715A" />
              </TouchableOpacity>
            ) : (
              displayList.length > 0 && <Text style={styles.endText}>Você viu todos os resultados.</Text>
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
  emptyContainer: { alignItems: 'center', marginTop: 50, paddingHorizontal: 24 },
  emptyText: { color: '#adb5bd', fontSize: 16, textAlign: 'center' },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 4, marginHorizontal: 16, marginTop: 16, borderWidth: 1, borderColor: '#eee' },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  activeTabButton: { backgroundColor: '#E0F2F1' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6c757d' },
  activeTabText: { color: '#15715A', fontWeight: 'bold' },
  compatRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 12 },
  compatText: { fontSize: 14, color: '#495057', flex: 1, marginRight: 8 },
  cardContainer: { marginBottom: 16 },
  appliedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff3cd', paddingVertical: 8, paddingHorizontal: 12, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderWidth: 1, borderColor: '#ffeeba', borderBottomWidth: 0, marginBottom: -5, zIndex: 1 },
  appliedText: { marginLeft: 6, color: '#856404', fontSize: 13, fontWeight: 'bold' },
});
