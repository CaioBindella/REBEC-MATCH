import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Header from '@/components/reusable/Header';
import ResearcherDashboard from '@/components/researcherComponents/ResearcherCandidates';

export default function ManageCandidatesPage() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <ResearcherDashboard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    alignItems: 'center',
  },
});