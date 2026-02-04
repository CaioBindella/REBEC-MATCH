import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VolunteerCardProps {
  id: string;
  location: string;
  description: string;
  studyApplied: string;
  status?: string; // Status vindo do banco
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

  const isRefused = status === 'RECUSADO';
  const isWaiting = status === 'ACEITO_PELO_PESQUISADOR';
  const isConcluded = status === 'CONCLUIDO';

  return (
    <View style={[
        styles.card, 
        isRefused && styles.cardRefusedOpacity,
        isWaiting && styles.cardWaitingOpacity // Opcional: destaca levemente se estiver aguardando
    ]}>
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

      {/* Rodapé: Muda de acordo com o STATUS */}
      <View style={styles.footer}>
        
        {/* CASO 1: RECUSADO (Caixa Vermelha) */}
        {isRefused && (
          <View style={styles.statusContainerRefused}>
            <Ionicons name="close-circle" size={20} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.statusTextRefused}>RECUSADO</Text>
          </View>
        )}

        {/* CASO 2: AGUARDANDO ACEITE (Caixa Amarela - SEM BOTÃO DE CLIQUE) */}
        {isWaiting && (
          <View style={styles.statusContainerWaiting}>
            <Ionicons name="time-outline" size={20} color="#856404" style={{ marginRight: 6 }} />
            <Text style={styles.statusTextWaiting}>Aguardando Aceite do Voluntário</Text>
          </View>
        )}

        {/* CASO 3: CONCLUÍDO (Botão Azul de Chat) */}
        {isConcluded && (
          <TouchableOpacity 
            style={[styles.button, styles.buttonChat]} 
            onPress={onAnalyze}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Acessar Chat</Text>
            <Ionicons name="chatbubbles-outline" size={18} color="#fff" />
          </TouchableOpacity>
        )}

        {/* CASO 4: PADRÃO / PENDENTE (Botão Verde de Analisar) */}
        {!isRefused && !isWaiting && !isConcluded && (
          <TouchableOpacity 
            style={[styles.button, styles.buttonAnalyze]} 
            onPress={onAnalyze}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Analisar Candidato</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  cardRefusedOpacity: {
    opacity: 0.8,
    backgroundColor: '#fafafa',
  },
  cardWaitingOpacity: {
    backgroundColor: '#fffcf5', // Fundo levemente amarelado (opcional)
    borderColor: '#ffeeba',
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

  // --- ESTILOS DOS BOTÕES E CAIXAS DE STATUS ---

  // Botão Padrão (Base)
  button: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  
  // Variação: Analisar (Verde)
  buttonAnalyze: {
    backgroundColor: '#15715A',
  },
  
  // Variação: Chat (Azul)
  buttonChat: {
    backgroundColor: '#007bff',
  },

  // Caixa de Status: RECUSADO (Vermelho)
  statusContainerRefused: {
    flexDirection: 'row',
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#c9302c',
  },
  statusTextRefused: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },

  // Caixa de Status: AGUARDANDO (Amarelo)
  statusContainerWaiting: {
    flexDirection: 'row',
    backgroundColor: '#fff3cd', // Amarelo claro bootstrap
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ffeeba',
  },
  statusTextWaiting: {
    color: '#856404', // Marrom/Dourado escuro para contraste
    fontSize: 14,
    fontWeight: 'bold',
  },
});