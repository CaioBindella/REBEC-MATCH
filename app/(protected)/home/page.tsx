import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '@/services/api/apiClient';

// Context
import { useAuth } from '@/context/AuthContext';

// Components
import ResearcherDashboard from '@/components/researcherComponents/ResearcherDashboard';
import Header from "@/components/reusable/Header";
import VolunteerDashboard from '@/components/volunteerComponents/VolunteerDashboard';

const checkVolunteerFormStatus = async (voluntarioId: number): Promise<boolean> => {
  try {
    console.log(`Verificando respostas para o voluntário ID: ${voluntarioId}...`);
    const respostas = await apiService.resposta.getByVoluntario(voluntarioId);
    
    return respostas && respostas.length > 0;
  } catch (error) {
    console.error("Erro ao verificar status do formulário:", error);
    return false;
  }
};

export default function HomePage() {
  const { user, isReady } = useAuth();
  const router = useRouter();

  const [checkingForm, setCheckingForm] = useState(true);
  const [hasCompletedForm, setHasCompletedForm] = useState<boolean | null>(null);

  // Identificação do tipo de usuário baseada na resposta da API (objeto user)
  // O backend retorna 'tipoEspecifico': 'PESQUISADOR' ou 'VOLUNTARIO'
  const isResearcher = user?.tipoEspecifico === 'PESQUISADOR';
  const isVolunteer = user?.tipoEspecifico === 'VOLUNTARIO';

  useEffect(() => {
    // Só roda a lógica quando o AuthContext estiver pronto (user carregado do storage)
    if (!isReady) return;

    if (isVolunteer && user?.perfilId) {
      // Se for voluntário, verifica se já preencheu o formulário inicial
      setCheckingForm(true);
      checkVolunteerFormStatus(user.perfilId)
        .then((status) => {
          setHasCompletedForm(status);
        })
        .catch((err) => {
          console.error("Erro na verificação do formulário", err);
          setHasCompletedForm(false); // Em caso de erro, assume que não preencheu (segurança)
        })
        .finally(() => {
          setCheckingForm(false);
        });
    } else {
      // Se for Pesquisador ou user não identificado, não precisa verificar formulário
      setCheckingForm(false);
    }
  }, [isReady, user, isVolunteer]);

  // Loading Inicial do App ou da Verificação de Formulário
  if (!isReady || (isVolunteer && checkingForm)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#15715A" />
          <Text style={styles.loadingText}>
            {isReady ? "Verificando perfil..." : "Carregando sessão..."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* --- Lógica do PESQUISADOR --- */}
        {isResearcher && <ResearcherDashboard />}

        {/* --- Lógica do VOLUNTÁRIO --- */}
        {isVolunteer && (
          <>
            {/* Cenário 1: Já preencheu o formulário -> Acessa o Dashboard */}
            {hasCompletedForm === true && <VolunteerDashboard />}

            {/* Cenário 2: NÃO preencheu -> Tela de Bloqueio obrigando o cadastro */}
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

        {/* Fallback caso o tipo de usuário não seja reconhecido (ex: erro no login) */}
        {!isResearcher && !isVolunteer && user && (
          <View style={styles.centered}>
            <Text style={{ color: 'red' }}>Tipo de usuário desconhecido: {user.tipoEspecifico}</Text>
          </View>
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
  loadingText: {
    marginTop: 15, 
    color: '#666', 
    fontSize: 16 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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