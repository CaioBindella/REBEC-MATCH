import React, { useState } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  Alert 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/reusable/Header';
import { useAuth } from '@/context/AuthContext';
import { push } from 'expo-router/build/global-state/routing';

export default function SettingsPage() {
  const router = useRouter();
  const { logOut } = useAuth();
  
  // Estados para os Switches
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive", 
          onPress: async () => {
             await logOut(); 
             // router.replace('/login');
             router.replace('/(auth)/login');
          } 
        }
      ]
    );
  };

  // Componente auxiliar para item de menu
  const SettingItem = ({ icon, title, subtitle, onPress, showArrow = true }: any) => (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color="#15715A" />
        </View>
        <View>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
    </TouchableOpacity>
  );

  // Componente auxiliar para Toggle
  const SettingToggle = ({ icon, title, value, onValueChange }: any) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={22} color="#15715A" />
        </View>
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      <Switch 
        trackColor={{ false: "#767577", true: "#a7f3d0" }}
        thumbColor={value ? "#15715A" : "#f4f3f4"}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Configurações</Text>

        {/* Seção de Conta */}
        <Text style={styles.sectionHeader}>Conta</Text>
        <View style={styles.sectionContainer}>
          <SettingItem 
            icon="person-outline" 
            title="Dados Pessoais" 
            subtitle="Nome, e-mail e telefone"
            onPress={() => router.push('/(protected)/profile/page')} 
          />
          <SettingItem 
            icon="lock-closed-outline" 
            title="Segurança" 
            subtitle="Alterar senha"
            onPress={() => router.push('/(protected)/settings/change-password')} 
          />
        </View>

        {/* Seção de Preferências */}
        <Text style={styles.sectionHeader}>Preferências</Text>
        <View style={styles.sectionContainer}>
          <SettingToggle 
            icon="notifications-outline" 
            title="Notificações Push" 
            value={pushEnabled} 
            onValueChange={setPushEnabled} 
          />
        </View>

        {/* Seção de Suporte */}
        <Text style={styles.sectionHeader}>Suporte</Text>
        <View style={styles.sectionContainer}>
          <SettingItem 
            icon="document-text-outline" 
            title="Termos de Uso" 
            onPress={() => { router.push('/(public)/terms/page')}} 
          />
          <SettingItem 
            icon="information-circle-outline" 
            title="Sobre o App" 
            subtitle="Versão 1.0.0" 
            onPress={() => {}} 
            showArrow={false}
          />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>ReBEC Match © 2026</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#212529', marginBottom: 20 },
  
  sectionHeader: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#6c757d', 
    marginBottom: 8, 
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    color: '#212529',
    fontWeight: '500',
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#ccc',
    fontSize: 12,
  },
});