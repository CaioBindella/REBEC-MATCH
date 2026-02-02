import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VolunteerCardProps {
  id: string;
  location: string;
  description: string;
  studyApplied: string;
  status?: string; // Recebe o status (RECUSADO, PENDENTE, etc.)
  onAnalyze: () => void;
}

export default function VolunteerCard({ 
  id, 
  location, 
  description, 
  studyApplied, 
  status, 
  onAnalyze 
}: VolunteerCardProps) {

  // Verifica se foi recusado para mudar o visual
  const isRefused = status === 'RECUSADO';

  return (
    <View style={[styles.card, isRefused && styles.cardRefusedOpacity]}>
      {/* Cabeçalho do Card */}
      <View style={styles.header}>
        <View style={styles.idContainer}>
            <Ionicons name="person-circle-outline" size={24} color="#15715A" />
            <Text style={styles.idText}>{id}</Text>
        </View>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>{location}</Text>
        </View>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.label}>Estudo:</Text>
        <Text style={styles.studyText} numberOfLines={1}>{studyApplied}</Text>
        
        <Text style={[styles.label, { marginTop: 8 }]}>Sobre:</Text>
        <Text style={styles.descriptionText} numberOfLines={2}>
          {description}
        </Text>
      </View>

      {/* Rodapé: Botão ou Caixa Vermelha */}
      <View style={styles.footer}>
        {isRefused ? (
          // --- CAIXA VERMELHA DE RECUSADO ---
          <View style={styles.refusedContainer}>
            <Ionicons name="close-circle" size={20} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.refusedText}>RECUSADO</Text>
          </View>
        ) : (
          // --- BOTÃO DE ANALISAR (Padrão) ---
          <TouchableOpacity 
            style={styles.analyzeButton} 
            onPress={onAnalyze}
            activeOpacity={0.8}
          >
            <Text style={styles.analyzeButtonText}>Analisar Candidato</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // Sombra suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  cardRefusedOpacity: {
    opacity: 0.8, // Deixa o card um pouco mais apagado se recusado
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  idText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  badge: {
    backgroundColor: '#E0F2F1',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#15715A',
    fontWeight: '600',
  },
  content: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#868e96',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  studyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#343a40',
  },
  descriptionText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  footer: {
    marginTop: 4,
  },
  
  // Estilo do Botão Padrão
  analyzeButton: {
    flexDirection: 'row',
    backgroundColor: '#15715A',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },

  // Estilo da Caixa VERMELHA (Recusado)
  refusedContainer: {
    flexDirection: 'row',
    backgroundColor: '#d9534f', // Vermelho bootstrap
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#c9302c',
  },
  refusedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});