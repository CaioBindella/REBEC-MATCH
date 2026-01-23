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
import { apiService } from '@/services/api/apiClient'; // Ajuste o caminho conforme sua pasta real

export default function ManageStudiesPage() {
  const router = useRouter();
  const { user } = useAuth(); // Pega o usuário logado do Contexto

  const [studies, setStudies] = useState<StudySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar dados na API
  const fetchStudies = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      // Chama a nova função que criamos no apiService
      const rawData = await apiService.estudo.getByPesquisador(user.id);

      // MAPEAMENTO:
      // O banco retorna "public_title" e "recruitment_status".
      // O componente espera "titulo" e "status".
      const formattedData: StudySummary[] = rawData.map((item: any) => ({
        id: item.id,
        titulo: item.publicTitle,       // Mapeia do banco para o front
        status: item.recruitmentStatus, // Mapeia do banco para o front
      }));

      setStudies(formattedData);
    } catch (error) {
      console.error("Erro ao buscar estudos:", error);
      Alert.alert("Erro", "Não foi possível carregar seus estudos.");
    } finally {
      setIsLoading(false);
    }
  };

  // Recarrega a lista toda vez que a tela ganha foco (ex: ao voltar de 'Criar Estudo')
  useFocusEffect(
    useCallback(() => {
      fetchStudies();
    }, [user?.id])
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
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginBottom: 20 },
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