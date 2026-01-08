import React, { useEffect, useState } from 'react';
import { 
  ActivityIndicator, 
  FlatList, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  TouchableOpacity 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/reusable/Header';

// --- Tipos de Dados ---
interface AcceptedCandidate {
  id: number;
  nomeVoluntario: string;
  tituloEstudo: string;
  dataInicio: string;
  status: 'ATIVO' | 'CONCLUIDO';
}

// --- Mock de Dados (Simulando API) ---
const mockCandidates: AcceptedCandidate[] = [
  { 
    id: 101, 
    nomeVoluntario: 'João Silva', 
    tituloEstudo: 'Estudo sobre Enxaqueca', 
    dataInicio: '10/01/2026',
    status: 'ATIVO'
  },
  { 
    id: 102, 
    nomeVoluntario: 'Maria Oliveira', 
    tituloEstudo: 'Impacto da Dieta Mediterrânea', 
    dataInicio: '12/01/2026',
    status: 'ATIVO'
  },
  { 
    id: 103, 
    nomeVoluntario: 'Carlos Souza', 
    tituloEstudo: 'Estudo sobre Enxaqueca', 
    dataInicio: '15/01/2026',
    status: 'CONCLUIDO'
  },
];

export default function ResearcherContactsPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<AcceptedCandidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<AcceptedCandidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula o carregamento da API
    setTimeout(() => {
      setCandidates(mockCandidates);
      setFilteredCandidates(mockCandidates);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filtra por nome do voluntário OU título do estudo
    if (searchTerm === '') {
      setFilteredCandidates(candidates);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = candidates.filter(item =>
        item.nomeVoluntario.toLowerCase().includes(lowerTerm) ||
        item.tituloEstudo.toLowerCase().includes(lowerTerm)
      );
      setFilteredCandidates(filtered);
    }
  }, [searchTerm, candidates]);

  // Função para renderizar cada card de voluntário
  const renderCandidateItem = ({ item }: { item: AcceptedCandidate }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
            <Ionicons name="person" size={24} color="#fff" />
        </View>
        <View style={styles.cardTextContainer}>
            <Text style={styles.volunteerName}>{item.nomeVoluntario}</Text>
            <Text style={styles.studyTitle} numberOfLines={1}>
                {item.tituloEstudo}
            </Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>Início: {item.dataInicio}</Text>
        <TouchableOpacity 
            style={styles.chatButton}
            onPress={() => router.push({
                pathname: "/chat/[id]",
                params: { id: item.id } // Passa o ID para o chat
            })}
        >
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.chatButtonText}>Conversar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color="#15715A" />
        </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      
      <View style={styles.content}>
        <Text style={styles.screenTitle}>Voluntários em Contato</Text>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar voluntário ou estudo..."
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {filteredCandidates.length > 0 ? (
          <FlatList
            data={filteredCandidates}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderCandidateItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              {searchTerm 
                ? 'Nenhum voluntário encontrado para essa busca.' 
                : 'Você ainda não tem voluntários ativos.'}
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  emptyText: { fontSize: 16, color: '#6c757d', textAlign: 'center' },
  
  // Estilos do Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2, // Sombra Android
    shadowColor: '#000', // Sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#15715A', // Verde padrão
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  volunteerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  studyTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  chatButton: {
    backgroundColor: '#15715A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});