import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import Header from '@/components/reusable/Header';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

// --- Mock de Dados ---
// Na vida real, isso viria de uma chamada à API usando o user.id
const mockVolunteerData = {
  id: 5,
  usuario: {
    id: 5,
    nome: 'Novo Voluntario',
    sobrenome: 'Teste',
    login: 'voluntario.teste',
    email: 'voluntario@teste.com',
    tipoEspecifico: 'VOLUNTARIO',
    sexo: 'OUTRO',
  },
  distancia: 200.0,
  nomeFicticio: 'VL_PR435',
};

const mockResearcherData = {
  id: 1,
  usuario: {
    id: 1,
    nome: 'Ana',
    sobrenome: 'Souza',
    login: 'ana.souza',
    email: 'ana.souza@institutopesquisa.br',
    tipoEspecifico: 'PESQUISADOR',
    sexo: 'FEMININO',
  },
  nomeFicticio: 'PS_RJ2343',
};
// --- Fim do Mock ---

// ✨ FIX: Criada uma interface para as props do InfoRow
interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
}

// Componente auxiliar para exibir linhas de informação
// ✨ FIX: Aplicada a interface de props para tipar os parâmetros
const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={20} color="#495057" style={styles.icon} />
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{String(value)}</Text>
  </View>
);

export default function ProfilePage() {
//   const { userType } = useAuth(); // Pega o tipo de usuário do contexto
    const userType = 'VOLUNTARIO'; // Substitua por useAuth().userType quando estiver implementado

  // Seleciona os dados corretos com base no tipo de usuário
  const profileData =
    userType === 'VOLUNTARIO' ? mockVolunteerData : mockResearcherData;

  const { usuario, nomeFicticio } = profileData;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#fff" />
          </View>
          <Text style={styles.name}>{`${usuario.nome} ${usuario.sobrenome}`}</Text>
          <Text style={styles.fictionalName}>{nomeFicticio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados da Conta</Text>
          <InfoRow icon="mail-outline" label="Email" value={usuario.email} />
          <InfoRow icon="at-outline" label="Login" value={usuario.login} />
          <InfoRow icon="person-circle-outline" label="Tipo" value={usuario.tipoEspecifico} />
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
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
    backgroundColor: '#15715A', // Cor verde principal
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  fictionalName: {
    fontSize: 16,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
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
    paddingVertical: 8,
  },
  icon: {
    marginRight: 15,
  },
  label: {
    fontSize: 16,
    color: '#495057',
  },
  value: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
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
