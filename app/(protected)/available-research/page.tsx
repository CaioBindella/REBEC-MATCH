import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { StudyCard } from '@/components/StudyCard'; 
import { getAvailableStudies } from '@/services/api/apiClient';
import Header from '@/components/Header';

// Definindo a interface para o tipo de dado de um estudo
interface Study {
  id: number;
  titulo: string;
  informacoesGerais: string;
  busca?: {
    anuncio?: {
      mensagem: string;
    };
    criterios?: {
      texto: string;
    }[];
  };
}

export default function AvailableStudiesScreen() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudies() {
      try {
        setLoading(true);
        setError(null);
        const response = await getAvailableStudies();
        setStudies(response);
      } catch (err) {
        setError('Não foi possível carregar as pesquisas. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadStudies();
  }, []);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#004A7F" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Stack.Screen
        options={{
          title: 'Pesquisas Disponíveis',
          headerStyle: { backgroundColor: '#f0f2f5' },
          headerTintColor: '#212529',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <FlatList
        data={studies}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <StudyCard study={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
});