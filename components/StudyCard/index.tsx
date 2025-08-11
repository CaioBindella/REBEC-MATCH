import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface StudyCardProps {
  study: {
    id: number;
    titulo: string;
    informacoesGerais: string;
    status: 'Recrutando' | 'Em Andamento';
    busca?: {
      anuncio?: {
        mensagem: string;
      };
      criterios?: {
        texto: string;
      }[];
    };
  };
}

export function StudyCard({ study }: StudyCardProps) {
  const description = study.busca?.anuncio?.mensagem || study.informacoesGerais;
  const criteria = study.busca?.criterios || [];

  const statusInfo = {
    'Recrutando': {
      text: 'Recrutando',
      style: styles.tagRecruiting,
      textStyle: styles.tagTextRecruiting,
    },
    'Em Andamento': {
      text: 'Em Andamento',
      style: styles.tagOngoing,
      textStyle: styles.tagTextOngoing,
    },
  };
  
  const currentStatusInfo = statusInfo[study.status];

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.cardTitle}>{study.titulo}</Text>
        {currentStatusInfo && (
          <View style={[styles.tagBase, currentStatusInfo.style]}>
            <Text style={currentStatusInfo.textStyle}>
              {currentStatusInfo.text}
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.cardDescription}>{description}</Text>

      {criteria.length > 0 && (
        <View style={styles.criteriaSection}>
          <Text style={styles.criteriaTitle}>Critérios para participação:</Text>
          {criteria.map((criterio, index) => (
            <View key={index} style={styles.criteriaItem}>
              <Text style={styles.criteriaText}>• {criterio.texto}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.participateButton}
        onPress={() => alert('Navegar para detalhes do estudo ' + study.id)}
      >
        <Text style={styles.buttonText}>Quero Participar</Text>
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContainer: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tagBase: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  tagRecruiting: {
    backgroundColor: '#E0F5EB',
  },
  tagTextRecruiting: {
    color: '#15715A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tagOngoing: {
    backgroundColor: '#DCEEFF', // Fundo azul claro
  },
  tagTextOngoing: {
    color: '#15715A', // Texto azul escuro
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  criteriaSection: {
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  criteriaTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  criteriaItem: {
    marginBottom: 4,
  },
  criteriaText: {
    fontSize: 14,
    color: '#555',
  },
  participateButton: {
    backgroundColor: '#15715A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});