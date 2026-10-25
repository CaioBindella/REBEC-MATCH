import React, { useState, useCallback } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import Header from '@/components/reusable/Header';
import ManageStudyCard, { StudySummary } from '@/components/researcherComponents/ManageStudyCard';

// Imports de Lógica
import { useAuth } from '@/context/AuthContext';
import { apiService, getErrorMessage } from '@/services/api/apiClient';

export default function ManageStudiesPage() {
  const router = useRouter();
  const { user } = useAuth(); // Pega o usuário logado do Contexto

  const [studies, setStudies] = useState<StudySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar dados na API
  const fetchStudies = useCallback(async () => {
    if (!user?.perfilId) return;

    try {
      setIsLoading(true);
      // Estudos do perfil de pesquisador (perfilId devolvido no login)
      const rawData = await apiService.estudo.getByPesquisador(user.perfilId);
      const formattedData: StudySummary[] = rawData.map((item) => ({
        id: item.id,
        titulo: item.publicTitle,
        status: item.recruitmentStatus,
      }));

      setStudies(formattedData);
    } catch (error) {
      Alert.alert('Erro', getErrorMessage(error, 'Não foi possível carregar seus estudos.'));
    } finally {
      setIsLoading(false);
    }
  }, [user?.perfilId]);

  // Recarrega a lista toda vez que a tela ganha foco (ex.: ao voltar de 'Criar Estudo')
  useFocusEffect(
    useCallback(() => {
      fetchStudies();
    }, [fetchStudies])
  );

  if (isLoading) {
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
        <View style={styles.profileTag}>
          {/* Exibe o nome fictício do pesquisador se disponível */}
          <Text style={styles.profileTagText}>
             {user?.nomeFicticio ? user.nomeFicticio : 'Pesquisador'}
          </Text>
        </View>
        
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Gerenciar Meus Estudos</Text>
          <TouchableOpacity style={styles.newButton} onPress={() => router.push('/(protected)/researcher/create-study/page')}>
            <Text style={styles.newButtonText}>+ Novo</Text>
          </TouchableOpacity>
        </View>

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
            // Permite arrastar para baixo para atualizar manualmente
            refreshing={isLoading}
            onRefresh={fetchStudies}
          />
        ) : (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Você ainda não registrou nenhum estudo.</Text>
            <TouchableOpacity 
              style={styles.createButton} 
              onPress={() => router.push('/(protected)/researcher/create-study/page')}
            >
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
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#212529', flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  newButton: { backgroundColor: '#15715A', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  newButtonText: { color: '#fff', fontWeight: 'bold' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, color: '#6c757d', textAlign: 'center', marginBottom: 20 },
  createButton: { backgroundColor: '#15715A', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  createButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  profileTag: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  profileTagText: {
    color: '#166865',
    fontWeight: '500',
  },
});