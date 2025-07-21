import React from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

// Context
import { useAuth } from '@/context/AuthContext';

// Components
import Header from "@/components/Header";
import VolunteerDashboard from '@/components/VolunteerDashboard';
import ResearcherDashboard from '@/components/ResearcherDashboard';

export default function HomePage() {
  // 1. Pega os dados do usuário do nosso contexto
  const { user, isReady } = useAuth();

  // Enquanto o contexto carrega o usuário, mostramos uma tela de loading
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      <ScrollView contentContainerStyle={styles.container}>
        {user?.userType === 'VOLUNTARIO' && <VolunteerDashboard />}
        {user?.userType === 'PESQUISADOR' && <ResearcherDashboard />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
});