import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Importa o Hook de Autenticação
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/reusable/Header';

// Interface para as props do InfoRow
interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number | null | undefined;
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={20} color="#495057" style={styles.icon} />
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value ? String(value) : '-'}</Text>
  </View>
);

export default function ProfilePage() {
  const { user } = useAuth();

  // Loading state manual caso o user não esteja pronto
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#15715A" />
        </View>
      </SafeAreaView>
    );
  }

  // Lógica ajustada: 
  // 1. Usamos APENAS o nome fictício.
  const nomeExibicao = user.nomeFicticio || 'Usuário Sem Código';
  
  // 2. As iniciais agora vêm do código (ex: PS1MG -> PS)
  const iniciais = nomeExibicao.substring(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Cabeçalho do Perfil */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciais}</Text>
          </View>
          {/* AQUI: Exibe apenas o Nome Fictício em destaque */}
          <Text style={styles.name}>{nomeExibicao}</Text>
          <Text style={styles.roleLabel}>{user.tipoEspecifico}</Text>
        </View>

        {/* Seção de Dados da Conta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados da Conta</Text>
          
          {/* Removemos nome/sobrenome daqui também para garantir privacidade visual */}
          <InfoRow icon="at-outline" label="Login" value={user.login} />
          <InfoRow icon="mail-outline" label="E-mail" value={user.email} />
          <InfoRow icon="finger-print-outline" label="ID" value={user.id} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 20 },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#15715A', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarText: {
    color: '#fff',
    fontSize: 36, // Ajustado levemente
    fontWeight: 'bold',
  },
  name: {
    fontSize: 26, // Maior destaque para o código
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 4,
  },
  roleLabel: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  icon: {
    marginRight: 15,
    width: 24, 
  },
  label: {
    fontSize: 16,
    color: '#495057',
    width: 70, 
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '400',
    flex: 1,
    textAlign: 'right',
  },
  editButton: {
    backgroundColor: '#15715A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});