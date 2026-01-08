import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Context
import { useAuth } from '@/context/AuthContext';

// Components
import ResearcherDashboard from '@/components/researcherComponents/ResearcherDashboard';
import Header from "@/components/reusable/Header";
import VolunteerDashboard from '@/components/volunteerComponents/VolunteerDashboard';

// --- MOCK API ---
// Mude para 'false' para ver a tela de bloqueio, ou 'true' para ver o dashboard
const checkVolunteerFormStatus = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log("Verificando status do formulário...");
    setTimeout(() => {
      resolve(true); // <--- Mude aqui para testar
    }, 1000);
  });
};

export default function HomePage() {
  const { user, isReady } = useAuth();
  const router = useRouter();

  // Iniciamos checkingForm como true para garantir que ele mostre o loading logo de cara
  const [checkingForm, setCheckingForm] = useState(true);
  const [hasCompletedForm, setHasCompletedForm] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isReady) return;

    // Lógica ajustada: Se user for null (dev bypass) ou tipo indefinido/voluntário, rodamos a verificação
    const isVolunteerOrDev = !user || user?.userType === undefined || user?.userType === 'VOLUNTARIO';

    if (isVolunteerOrDev) {
      checkVolunteerFormStatus()
        .then((status) => {
          console.log("Status recebido:", status);
          setHasCompletedForm(status);
        })
        .catch((err) => {
          console.error("Erro na verificação", err);
          setHasCompletedForm(true); // Fallback seguro
        })
        .finally(() => {
          setCheckingForm(false);
        });
    } else {
      // Se for pesquisador, não precisa verificar formulário
      setCheckingForm(false);
    }
  }, [isReady, user]);

  // Loading Inicial
  if (!isReady || checkingForm) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#15715A" />
          <Text style={{ marginTop: 15, color: '#666', fontSize: 16 }}>
            Verificando seu perfil...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Identificação do tipo de usuário (Adaptado para quando user é null)
  const isResearcher = user?.userType === 'PESQUISADOR';
  // Se não é pesquisador, assumimos que é voluntário (mesmo que user seja null)
  const isVolunteer = !isResearcher;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Lógica do PESQUISADOR */}
        {isResearcher && <ResearcherDashboard />}

        {/* Lógica do VOLUNTÁRIO */}
        {isVolunteer && (
          <>
            {/* Se já preencheu -> Dashboard */}
            {hasCompletedForm === true && <VolunteerDashboard />}

            {/* Se NÃO preencheu -> Tela de Bloqueio */}
            {hasCompletedForm === false && (
              <View style={styles.blockedContainer}>
                <View style={styles.iconCircle}>
                    <Ionicons name="document-text" size={50} color="#15715A" />
                </View>
                <Text style={styles.blockedTitle}>Finalize seu Cadastro</Text>
                <Text style={styles.blockedText}>
                  Para participar das pesquisas e ter acesso ao painel completo, 
                  precisamos que você preencha o formulário de perfil inicial.
                </Text>

                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push('/(protected)/volunteer/form-study/page')}
                >
                  <Text style={styles.actionButtonText}>Preencher Agora</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" style={{marginLeft: 8}} />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  
  // Estilos da Tela de Bloqueio
  blockedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    marginTop: 20,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  blockedTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 12,
    textAlign: 'center',
  },
  blockedText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  actionButton: {
    backgroundColor: '#15715A',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra
    shadowColor: "#15715A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});