import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Interface atualizada para as props do card
interface VolunteerCardProps {
  id: string;
  location: string;
  description: string;
  studyApplied: string; // Nome do estudo ao qual se candidatou
  onAnalyze: () => void; // Função para o botão "Analisar"
}

export default function VolunteerCard({ id, location, description, studyApplied, onAnalyze }: VolunteerCardProps) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Text style={styles.volunteerId}>{id}</Text>
        <Text style={styles.location}>{location}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      
      {/* Tag para o estudo */}
      <View style={styles.studyTag}>
        <Text style={styles.studyTagText}>Candidato para: {studyApplied}</Text>
      </View>

      {/* Botão para analisar o perfil */}
      <TouchableOpacity style={styles.analyzeButton} onPress={onAnalyze}>
        <Text style={styles.analyzeButtonText}>Analisar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  volunteerId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  location: {
    fontSize: 14,
    color: '#6c757d',
  },
  description: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 16,
  },
  studyTag: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  studyTagText: {
    color: '#166865',
    fontWeight: '500',
    fontSize: 12,
  },
  analyzeButton: {
    backgroundColor: '#15715A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});