import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

// Tipo de dados para este card
export interface SelectedStudy {
  id: number;
  titulo: string;
  pesquisador: {
    nomeFicticio: string;
    avatarUrl?: string; // URL da foto do pesquisador (opcional)
  };
}

interface SelectedStudyCardProps {
  study: SelectedStudy;
  onChatPress: () => void;
}

export function AccessChat({ study, onChatPress }: SelectedStudyCardProps) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{study.titulo}</Text>
        <Text style={styles.researcher}>Voluntário: {study.pesquisador.nomeFicticio}</Text>
      </View>
      <TouchableOpacity style={styles.chatButton} onPress={onChatPress}>
        <Text style={styles.chatButtonText}>Acessar Chat</Text>
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
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
    textAlign: 'left',
  },
  researcher: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'left',
  },
  chatButton: {
    backgroundColor: '#15715A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});