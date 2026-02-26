import { SelectedStudyCard } from '@/components/volunteerComponents/SelectedStudyCard';
import Header from '@/components/reusable/Header';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
  ActivityIndicator, 
  FlatList, 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { apiService } from '@/services/api/apiClient';
import { useAuth } from '@/context/AuthContext';

interface StudyData {
  id: number;           
  estudoId: number;     
  titulo: string;
  pesquisador: { nomeFicticio: string };
  pesquisadorId: number;
  status: string;
}

type TabOption = 'invites' | 'ongoing';

export default function MyStudiesScreen() {
  const router = useRouter();
  const { user } = useAuth(); 

  // Listas separadas
  const [invites, setInvites] = useState<StudyData[]>([]);
  const [ongoing, setOngoing] = useState<StudyData[]>([]);
  
  // Controle da visualização e busca
  const [activeTab, setActiveTab] = useState<TabOption>('invites');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Loading específico para ações de botão (aceitar/recusar)
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchMyStudies();
  }, []);

  const fetchMyStudies = async () => {
    try {
      setLoading(true);
      
      if (!user?.perfilId) {
        setLoading(false);
        return;
      }

      const response = await apiService.candidatura.listarPorVoluntario(user.perfilId);

      // Mapeia os dados brutos para o formato da tela
      const allStudies = response.map((item: any) => ({
        id: item.id,
        estudoId: item.estudoId,
        titulo: item.estudoTitulo,
        pesquisador: { 
            nomeFicticio: item.pesquisadorNomeFicticio || 'Pesquisador' 
        },
        pesquisadorId: item.pesquisadorId,
        status: item.status
      }));

      // Filtra e separa por status
      const invitesList = allStudies.filter((s: StudyData) => s.status === 'ACEITO_PELO_PESQUISADOR');
      const ongoingList = allStudies.filter((s: StudyData) => s.status === 'CONCLUIDO');

      setInvites(invitesList);
      setOngoing(ongoingList);

      // Define a aba inicial: se tiver convites, mostra convites, senão vai para andamento
      if (invitesList.length > 0) {
        setActiveTab('invites');
      } else {
        setActiveTab('ongoing');
      }

    } catch (error) {
      console.error("Erro ao buscar meus estudos:", error);
      Alert.alert("Erro", "Não foi possível carregar seus estudos.");
    } finally {
      setLoading(false);
    }
  };

  // Lógica para Aceitar ou Recusar o convite
  const handleResponse = async (candidaturaId: number, aceito: boolean) => {
    try {
      setActionLoading(candidaturaId);
      
      // Chama a rota de confirmação
      await apiService.candidatura.confirmacaoVoluntario(candidaturaId, aceito);

      if (aceito) {
        Alert.alert("Sucesso", "Você entrou no estudo! Acesse a aba 'Em Andamento' para ver o chat.");
        
        // Move o item da lista de convites para a lista de andamento localmente
        const study = invites.find(s => s.id === candidaturaId);
        if (study) {
          setInvites(prev => prev.filter(s => s.id !== candidaturaId));
          setOngoing(prev => [...prev, { ...study, status: 'CONCLUIDO' }]);
          setActiveTab('ongoing'); // Muda para a aba de andamento automaticamente
        }
      } else {
        Alert.alert("Recusado", "Você recusou o convite para este estudo.");
        // Apenas remove da lista de convites
        setInvites(prev => prev.filter(s => s.id !== candidaturaId));
      }

    } catch (error) {
      console.error("Erro ao responder convite:", error);
      Alert.alert("Erro", "Falha ao processar sua resposta.");
    } finally {
      setActionLoading(null);
    }
  };

  // Filtra a lista ativa com base no termo de busca
  const getDisplayList = () => {
    const sourceList = activeTab === 'invites' ? invites : ongoing;
    
    if (searchTerm === '') return sourceList;

    return sourceList.filter(study =>
      study.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const displayList = getDisplayList();

  if (loading) {
    return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color="#15715A" />
        </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Meus Estudos', headerShown: false }} />
      <Header />
      <View style={styles.content}>
        <Text style={styles.screenTitle}>Meus Estudos</Text>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título..."
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        {/* --- ABAS --- */}
        <View style={styles.tabsContainer}>
            <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'invites' && styles.activeTabButton]}
                onPress={() => setActiveTab('invites')}
            >
                <Text style={[styles.tabText, activeTab === 'invites' && styles.activeTabText]}>
                    Convites ({invites.length})
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.tabButton, activeTab === 'ongoing' && styles.activeTabButton]}
                onPress={() => setActiveTab('ongoing')}
            >
                <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>
                    Em Andamento ({ongoing.length})
                </Text>
            </TouchableOpacity>
        </View>

        {/* --- LISTA --- */}
        {displayList.length > 0 ? (
          <FlatList
            data={displayList}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
                
                // RENDERIZAÇÃO PARA ABA DE CONVITES
                if (activeTab === 'invites') {
                    return (
                        <View style={styles.inviteCard}>
                            <View style={styles.inviteHeader}>
                                <Text style={styles.inviteTitle}>{item.titulo}</Text>
                                <Text style={styles.inviteResearcher}>Pesquisador: {item.pesquisador.nomeFicticio}</Text>
                            </View>
                            
                            <Text style={styles.inviteStatusText}>
                                O pesquisador aprovou sua candidatura. Deseja participar?
                            </Text>

                            <View style={styles.inviteActions}>
                                {/* Botão Recusar */}
                                <TouchableOpacity 
                                    style={[styles.actionBtn, styles.rejectBtn]}
                                    onPress={() => handleResponse(item.id, false)}
                                    disabled={actionLoading === item.id}
                                >
                                    <Text style={styles.rejectText}>Recusar</Text>
                                </TouchableOpacity>

                                {/* Botão Aceitar */}
                                <TouchableOpacity 
                                    style={[styles.actionBtn, styles.acceptBtn]}
                                    onPress={() => handleResponse(item.id, true)}
                                    disabled={actionLoading === item.id}
                                >
                                    {actionLoading === item.id ? (
                                        <ActivityIndicator color="#fff" size="small" />
                                    ) : (
                                        <Text style={styles.acceptText}>Aceitar e Participar</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }

                // RENDERIZAÇÃO PARA ABA EM ANDAMENTO (CARD PADRÃO COM CHAT)
                return (
                    <SelectedStudyCard
                        study={item} 
                        onChatPress={() =>
                            router.push({
                                pathname: "/(protected)/chat/[id]", 
                                params: { 
                                    id: item.estudoId, 
                                    pesquisadorId: item.pesquisadorId,
                                    nomeContato: item.pesquisador.nomeFicticio,
                                    tituloEstudo: item.titulo 
                                },
                            })
                        }
                    />
                );
            }}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>
              {searchTerm 
                ? 'Nenhum estudo encontrado na busca.' 
                : activeTab === 'invites' 
                    ? 'Você não tem novos convites.' 
                    : 'Você ainda não participa de nenhum estudo.'}
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  // Estilos das Abas
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
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
    backgroundColor: '#E0F2F1', // Verde claro selecionado
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

  // Estilos do Card de Convite
  inviteCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b', // Laranja para indicar pendência
  },
  inviteHeader: {
    marginBottom: 8,
  },
  inviteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  inviteResearcher: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  inviteStatusText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 16,
    lineHeight: 20,
  },
  inviteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  acceptBtn: {
    backgroundColor: '#15715A',
  },
  rejectText: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  acceptText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Utilitários
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