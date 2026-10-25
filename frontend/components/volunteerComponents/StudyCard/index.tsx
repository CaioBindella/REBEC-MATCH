import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { estaRecrutando, statusRecrutamentoLabel } from '@/utils/formatters';

// Dados do estudo exibidos no card da lista
export interface StudySummary {
  id: number;
  titulo: string;
  informacoesGerais: string;
  status: string; // rótulo ICTRP (ex.: "Recruiting")
  doencas?: string[];
  compativel?: boolean;
}

interface StudyCardProps {
  study: StudySummary;
  onPress: () => void;
}

export function StudyCard({ study, onPress }: StudyCardProps) {
  const recrutando = estaRecrutando(study.status);

  const briefDescription = study.informacoesGerais.length > 100
    ? `${study.informacoesGerais.substring(0, 100)}...`
    : study.informacoesGerais;

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{study.titulo}</Text>

      <View style={styles.tagsRow}>
        <View style={[styles.tagBase, recrutando ? styles.tagRecruiting : styles.tagDefault]}>
          <Text style={recrutando ? styles.tagTextRecruiting : styles.tagTextDefault}>{statusRecrutamentoLabel(study.status)}</Text>
        </View>
        {study.compativel && (
          <View style={[styles.tagBase, styles.tagCompatible]}>
            <Ionicons name="checkmark-done" size={13} color="#004A7F" style={{ marginRight: 4 }} />
            <Text style={styles.tagTextCompatible}>Compatível com seu perfil</Text>
          </View>
        )}
      </View>

      <Text style={styles.cardDescription}>{briefDescription}</Text>

      {!!study.doencas?.length && (
        <Text style={styles.doencas} numberOfLines={2}>
          Condições: {study.doencas.join(', ')}
        </Text>
      )}

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
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tagBase: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  tagRecruiting: { backgroundColor: '#E0F5EB' },
  tagTextRecruiting: { color: '#15715A', fontWeight: 'bold', fontSize: 12 },
  tagCompatible: { backgroundColor: '#DCEEFF' },
  tagTextCompatible: { color: '#004A7F', fontWeight: 'bold', fontSize: 12 },
  tagDefault: { backgroundColor: '#E9ECEF' },
  tagTextDefault: { color: '#495057', fontWeight: 'bold', fontSize: 12 },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 21,
    marginBottom: 8,
  },
  doencas: {
    fontSize: 13,
    color: '#6c757d',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  participateButton: {
    backgroundColor: '#15715A',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
