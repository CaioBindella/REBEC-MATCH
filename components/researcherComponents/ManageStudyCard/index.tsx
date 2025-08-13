import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Interface para os dados que este card vai mostrar
export interface StudySummary {
  id: number;
  titulo: string;
  status: string;
}

interface ManageStudyCardProps {
  study: StudySummary;
  onEdit: () => void;
}

export default function ManageStudyCard({ study, onEdit }: ManageStudyCardProps) {
  const isRecruiting = study.status === 'RECRUTANDO';
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onEdit}>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{study.titulo}</Text>
        <View style={[styles.statusBadge, isRecruiting ? styles.recruiting : styles.ongoing]}>
          <Text style={styles.statusText}>{study.status.replace('_', ' ')}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#6c757d" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  recruiting: { backgroundColor: '#E0F5EB' },
  ongoing: { backgroundColor: '#DCEEFF' },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#15715A',
  },
});