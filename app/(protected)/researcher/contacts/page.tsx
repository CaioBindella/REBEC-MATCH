import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';

import Header from '@/components/reusable/Header';
import { AccessChat } from '@/components/researcherComponents/AccessChat';
import { apiService, getErrorMessage } from '@/services/api/apiClient';
import { MatchResultResponseDTO } from '@/types/types';
import { formatDate } from '@/utils/formatters';

/**
 * Voluntários com participação confirmada (match) nos estudos do pesquisador autenticado,
 * com acesso direto à conversa correspondente.
 */
export default function ResearcherContactsPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchResultResponseDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      apiService.match
        .listar()
        .then(setMatches)
        .catch((error) => Alert.alert('Erro', getErrorMessage(error, 'Não foi possível carregar seus contatos.')))
        .finally(() => setLoading(false));
    }, [])
  );

  const filtrados = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();
    if (!termo) return matches;
    return matches.filter(
      (m) => m.voluntarioNomeFicticio.toLowerCase().includes(termo) || m.estudoPublicTitle.toLowerCase().includes(termo)
    );
  }, [matches, searchTerm]);

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

        <FlatList
          data={filtrados}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <AccessChat
              tituloEstudo={item.estudoPublicTitle}
              nomeContato={item.voluntarioNomeFicticio}
              detalhe={`Match confirmado em ${formatDate(item.dataMatch)}`}
              onChatPress={() =>
                router.push({
                  pathname: '/(protected)/chat/[id]',
                  params: {
                    id: item.estudoId,
                    contatoUsuarioId: item.voluntarioUsuarioId,
                    nomeContato: item.voluntarioNomeFicticio,
                    tituloEstudo: item.estudoPublicTitle,
                  },
                })
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>
                {searchTerm
                  ? 'Nenhum voluntário encontrado para essa busca.'
                  : 'Você ainda não tem voluntários com participação confirmada.'}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  content: { flex: 1, padding: 16 },
  screenTitle: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginBottom: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
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
});
