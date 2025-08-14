import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import RNPickerSelect from 'react-native-picker-select'; // Importando o dropdown
import VolunteerCard from '@/components/volunteerComponents/VolunteerCard';

// Dados mock atualizados
const mockVolunteers = [
  { id: 'VOL2666RJ', location: 'Rio de Janeiro', description: 'Candidato com ampla disponibilidade e interesse em estudos sobre enxaqueca.', studyApplied: 'Estudo sobre Enxaqueca' },
  { id: 'VOL0453SP', location: 'São Paulo', description: 'Voluntária com experiência prévia em pesquisas sobre saúde mental.', studyApplied: 'Avaliação de App de Saúde Mental' },
  { id: 'VOL06327BA', location: 'Bahia', description: 'Participante interessado em pesquisas sobre nutrição e dieta.', studyApplied: 'Impacto da Dieta Mediterrânea' },
];

// Dados mock para o filtro de estudos
const researcherStudies = [
    { label: 'Estudo sobre Enxaqueca', value: 'Estudo sobre Enxaqueca' },
    { label: 'Avaliação de App de Saúde Mental', value: 'Avaliação de App de Saúde Mental' },
    { label: 'Impacto da Dieta Mediterrânea', value: 'Impacto da Dieta Mediterrânea' },
];

export default function ResearcherCandidates() {
  const router = useRouter();
  const [selectedStudy, setSelectedStudy] = useState(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Candidatos</Text>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar por Estudo:</Text>
        <RNPickerSelect
            onValueChange={(value) => setSelectedStudy(value)}
            items={researcherStudies}
            placeholder={{ label: "Selecione um estudo...", value: null }}
            style={pickerSelectStyles}
            useNativeAndroidPickerStyle={false}
            Icon={() => <Ionicons name="chevron-down" size={20} color="#495057" />}
        />
      </View>
      
      {mockVolunteers.map((volunteer) => (
        <VolunteerCard
          key={volunteer.id}
          id={volunteer.id}
          location={volunteer.location}
          description={volunteer.description}
          studyApplied={volunteer.studyApplied}
          onAnalyze={() =>
            router.push({
              pathname: "/volunteer-details/[id]",
              params: { id: volunteer.id },
            })
          }
        />
      ))}
    </ScrollView>
  );
};

// Estilos para o componente principal
const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', backgroundColor: '#f0f2f5' },
  contentContainer: { paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#212529', marginBottom: 20 },
  filterContainer: { marginBottom: 24 },
  filterLabel: { fontSize: 16, fontWeight: '600', color: '#495057', marginBottom: 8 },
});

// Estilos específicos para o componente Picker
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
  iconContainer: {
    top: 15,
    right: 15,
  },
});