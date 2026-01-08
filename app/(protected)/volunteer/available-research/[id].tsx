import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';

import Header from '@/components/reusable/Header';

const mockStudyDetails = {
  '1': {
    id: 1,
    titulo: "Estudo sobre Eficácia de Novo Medicamento para Enxaqueca",
    pesquisador: { nomeFicticio: "PS_RJ2343" },
    codigoRegistro: "REBEC-XYZ-987",
    status: "EM_ANDAMENTO",
    dataInicio: "10 de Agosto de 2025",
    dataFim: "10 de Agosto de 2026",
    informacoesGerais: "Este estudo visa avaliar a redução na frequência de crises de enxaqueca em pacientes que utilizam o novo composto experimental X.",
    criterios: [
      "Deve ter diagnóstico de enxaqueca crónica...",
      "Não deve estar a participar noutros estudos...",
      "Idade entre 18 e 65 anos.",
    ]
  },
};

export default function StudyDetailScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>(); 
  
  const study = mockStudyDetails[id as keyof typeof mockStudyDetails]; 

  if (!study) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Stack.Screen options={{ title: 'Detalhes do Estudo' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{study.titulo}</Text>
        <Text style={styles.sectionTitle}>Informações Gerais</Text>
        <Text style={styles.description}>{study.informacoesGerais}</Text>

        <View style={styles.infoBox}>
          {/* O componente InfoRow agora recebe props tipadas */}
          <InfoRow label="Status" value={study.status.replace('_', ' ')} />
          <InfoRow label="Código de Registro" value={study.codigoRegistro} />
        </View>

        <Text style={styles.sectionTitle}>Critérios para Participação</Text>
        
        {study.criterios.map((criterio: string, index: number) => (
          <Text key={index} style={styles.criteriaItem}>• {criterio}</Text>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.formButton}>
          <Text style={styles.formButtonText}>Canditar para o Estudo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 24, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
  description: { fontSize: 16, color: '#555', lineHeight: 24 },
  infoBox: { marginTop: 20, backgroundColor: '#f8f9fa', borderRadius: 8, padding: 16 },
  infoRow: { paddingVertical: 4 },
  infoLabel: { fontSize: 14, color: '#666', fontWeight: 'bold' },
  infoValue: { fontSize: 15, color: '#333' },
  criteriaItem: { fontSize: 16, color: '#555', lineHeight: 24, marginBottom: 8, marginLeft: 8 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#ffffff' },
  formButton: { backgroundColor: '#15715A', padding: 16, borderRadius: 8, alignItems: 'center' },
  formButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});