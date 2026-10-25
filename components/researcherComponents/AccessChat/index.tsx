import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AccessChatProps {
  tituloEstudo: string;
  nomeContato: string; // nome fictício do voluntário
  detalhe?: string;
  onChatPress: () => void;
}

/** Card de acesso ao chat com um voluntário de participação confirmada (match). */
export function AccessChat({ tituloEstudo, nomeContato, detalhe, onChatPress }: AccessChatProps) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={22} color="#fff" />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{nomeContato}</Text>
          <Text style={styles.title} numberOfLines={2}>{tituloEstudo}</Text>
          {!!detalhe && <Text style={styles.detail}>{detalhe}</Text>}
        </View>
      </View>
      <TouchableOpacity style={styles.chatButton} onPress={onChatPress}>
        <Ionicons name="chatbubble-ellipses-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#15715A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#212529',
  },
  title: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  detail: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  chatButton: {
    flexDirection: 'row',
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
