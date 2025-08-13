import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Interface para os dados do estudo que o card da lista precisa
export interface StudySummary {
  id: number;
  titulo: string;
  informacoesGerais: string;
  status: string; // 'EM_ANDAMENTO', 'RECRUTANDO', etc.
}

interface StudyCardProps {
  study: StudySummary;
  onPress: () => void; // Função para navegar
}

export function StudyCard({ study, onPress }: StudyCardProps) {
  const statusMap = {
    EM_ANDAMENTO: { text: 'Em Andamento', style: styles.tagOngoing, textStyle: styles.tagTextOngoing },
    RECRUTANDO: { text: 'Recrutando', style: styles.tagRecruiting, textStyle: styles.tagTextRecruiting },
    DEFAULT: { text: 'Verificar', style: styles.tagDefault, textStyle: styles.tagTextDefault },
  };

  const statusInfo = statusMap[study.status as keyof typeof statusMap] || statusMap.DEFAULT;
  
  const briefDescription = study.informacoesGerais.length > 100
    ? `${study.informacoesGerais.substring(0, 100)}...`
    : study.informacoesGerais;

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{study.titulo}</Text>
      
      <View style={[styles.tagBase, statusInfo.style]}>
        <Text style={statusInfo.textStyle}>{statusInfo.text}</Text>
      </View>

      <Text style={styles.cardDescription}>{briefDescription}</Text>
      
      <TouchableOpacity style={styles.participateButton} onPress={onPress}>
        <Text style={styles.buttonText}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  tagBase: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  tagRecruiting: { backgroundColor: '#E0F5EB' },
  tagTextRecruiting: { color: '#15715A', fontWeight: 'bold', fontSize: 12 },
  tagOngoing: { backgroundColor: '#DCEEFF' },
  tagTextOngoing: { color: '#004A7F', fontWeight: 'bold', fontSize: 12 },
  tagDefault: { backgroundColor: '#E9ECEF' },
  tagTextDefault: { color: '#495057', fontWeight: 'bold', fontSize: 12 },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 21,
    marginBottom: 16,
  },
  participateButton: {
    backgroundColor: '#15715A',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});