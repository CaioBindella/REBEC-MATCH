import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

import Header from '@/components/reusable/Header';
import { apiService } from '@/services/api/apiClient';

interface StudyDetail {
  id: number;
  publicTitle: string;
  scientificTitle: string;
  recruitmentStatus: string;
  trialId: string; 
  dateRegistration: string;
  iFreetext?: string;
  pesquisador?: {
    nomeFicticio?: string;
  };
  criterios?: {
    id: number;
    inclusion_criteria: string; 
    exclusion_criteria: string;
    agemin?: string;
    agemax?: string;
    gender?: string;
  }[];
}

export default function StudyDetailScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>(); 
  
  const [study, setStudy] = useState<StudyDetail | null>(null);
  const [isApplied, setIsApplied] = useState(false); // NOVO ESTADO: Controle se já se candidatou
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudyDetails() {
      try {
        if (!id) return;
        setLoading(true);
        
        const voluntarioId = user?.perfilId; // Pega o ID do perfil do voluntário logado

        // Busca os detalhes do estudo E as candidaturas ao mesmo tempo
        const [estudoData, candidaturasData] = await Promise.all([
            apiService.estudo.getById(Number(id)),
            voluntarioId ? apiService.candidatura.listarPorVoluntario(voluntarioId) : Promise.resolve([])
        ]);
        
        setStudy(estudoData as unknown as StudyDetail);

        // Verifica se o ID deste estudo está na lista de candidaturas
        const jaCandidatou = candidaturasData.some((c: any) => c.estudoId === Number(id));
        setIsApplied(jaCandidatou);

      } catch (error) {
        console.error("Erro ao carregar estudo:", error);
        Alert.alert("Erro", "Não foi possível carregar os detalhes do estudo.");
        router.back();
      } finally {
        setLoading(false);
      }
    }

    fetchStudyDetails();
  }, [id, user]);

  const handleCandidatura = () => {
    if (!study || !user || !user.id) {
      Alert.alert("Erro", "Não foi possível identificar a sua conta.");
      return;
    }

    const usuarioIdNumber = user.id;

    Alert.alert(
      "Confirmar Candidatura",
      `Deseja se candidatar para o estudo "${study.publicTitle}"? O pesquisador terá acesso ao seu perfil.`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Confirmar", 
          onPress: async () => {
            try {
              setLoading(true);
              await apiService.candidatura.criar({
                // Voltamos a enviar o ID do Usuário, que é o que a sua API realmente usa na query
                voluntarioId: usuarioIdNumber, 
                estudoId: study.id
              });
              Alert.alert("Sucesso", "Candidatura enviada! Você será notificado sobre o progresso.");
              
              setIsApplied(true); 
              router.push("/(protected)/home/page");
              
            } catch (error) {
              Alert.alert("Erro", "Não foi possível realizar a candidatura.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const formatGender = (gender?: string) => {
    if (gender === 'F') return 'Feminino';
    if (gender === 'M') return 'Masculino';
    if (gender === '-') return 'Ambos';
    return 'Não especificado';
  };

  if (loading || !study) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#15715A" />
      </View>
    );
  }

  const demographicData = study.criterios && study.criterios.length > 0 ? study.criterios[0] : null;

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Stack.Screen options={{ title: 'Detalhes do Estudo' }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{study.publicTitle}</Text>
        
        {/* Aviso no topo caso já tenha se candidatado */}
        {isApplied && (
            <View style={styles.appliedTopBadge}>
                <Ionicons name="checkmark-circle" size={18} color="#856404" />
                <Text style={styles.appliedTopText}>Você já está participando do recrutamento deste estudo.</Text>
            </View>
        )}
        
        <Text style={styles.sectionTitle}>Informações Gerais</Text>
        <Text style={styles.description}>
            {study.scientificTitle || "Sem descrição científica disponível."}
        </Text>

        {study.iFreetext && (
            <View style={styles.interventionBox}>
                <Text style={styles.interventionLabel}>Intervenção/Condição:</Text>
                <Text style={styles.interventionText}>{study.iFreetext}</Text>
            </View>
        )}

        <View style={styles.infoBox}>
          <InfoRow label="Status" value={study.recruitmentStatus?.replace(/_/g, ' ') || '-'} />
          <InfoRow label="Código de Registro" value={study.trialId || `ID Interno: ${study.id}`} />
          <InfoRow label="Pesquisador Responsável" value={study.pesquisador?.nomeFicticio || "Não informado"} />
        </View>

        {demographicData && (
             <>
                <Text style={styles.sectionTitle}>Público Alvo</Text>
                <View style={styles.demographicContainer}>
                    <View style={styles.demographicItem}>
                        <Ionicons name="people" size={20} color="#15715A" />
                        <Text style={styles.demographicText}>
                            Gênero: {formatGender(demographicData.gender)}
                        </Text>
                    </View>
                    <View style={styles.demographicItem}>
                        <Ionicons name="calendar" size={20} color="#15715A" />
                        <Text style={styles.demographicText}>
                            Idade: {demographicData.agemin || '?'} a {demographicData.agemax || '?'} anos
                        </Text>
                    </View>
                </View>
             </>
        )}

        <Text style={styles.sectionTitle}>Critérios para Participação</Text>
        
        {study.criterios && study.criterios.length > 0 ? (
          study.criterios.map((criterio, index) => (
            <View key={criterio.id || index} style={styles.criteriaContainer}>
                {criterio.inclusion_criteria && (
                    <View style={styles.criteriaRow}>
                        <Ionicons name="checkmark-circle" size={18} color="#15715A" style={{marginTop: 3}} />
                        <Text style={styles.criteriaText}>
                            <Text style={{fontWeight: 'bold', color: '#15715A'}}>Inclusão: </Text>
                            {criterio.inclusion_criteria}
                        </Text>
                    </View>
                )}
                
                {criterio.exclusion_criteria && (
                    <View style={[styles.criteriaRow, { marginTop: 8 }]}>
                        <Ionicons name="close-circle" size={18} color="#d9534f" style={{marginTop: 3}} />
                        <Text style={styles.criteriaText}>
                            <Text style={{fontWeight: 'bold', color: '#d9534f'}}>Exclusão: </Text>
                            {criterio.exclusion_criteria}
                        </Text>
                    </View>
                )}
            </View>
          ))
        ) : (
            <Text style={styles.description}>Nenhum critério específico listado.</Text>
        )}
      </ScrollView>

      {/* RODAPÉ DINÂMICO */}
      <View style={styles.footer}>
        {isApplied ? (
            // AVISO DE JÁ CANDIDATADO (Sem Botão)
            <View style={styles.appliedFooterWarning}>
                <Ionicons name="information-circle" size={24} color="#856404" />
                <Text style={styles.appliedFooterText}>Candidatura já enviada. Acompanhe o status na aba "Meus Estudos".</Text>
            </View>
        ) : (
            // BOTÃO DE CANDIDATAR (Disponível)
            <TouchableOpacity 
              style={styles.formButton}
              onPress={handleCandidatura}
            >
              <Text style={styles.formButtonText}>Candidatar-se para o Estudo</Text>
            </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginBottom: 16 },
  
  // Estilos de Aviso Aplicado
  appliedTopBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff3cd', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ffeeba', marginBottom: 16 },
  appliedTopText: { marginLeft: 8, color: '#856404', fontSize: 14, fontWeight: '600', flex: 1 },
  appliedFooterWarning: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff3cd', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#ffeeba' },
  appliedFooterText: { marginLeft: 12, color: '#856404', fontSize: 14, fontWeight: '600', flex: 1 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 24, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
  description: { fontSize: 16, color: '#555', lineHeight: 24 },
  interventionBox: { marginTop: 16, padding: 12, backgroundColor: '#e3f2fd', borderRadius: 8, borderWidth: 1, borderColor: '#bbdefb' },
  interventionLabel: { fontSize: 14, fontWeight: 'bold', color: '#0d47a1', marginBottom: 4 },
  interventionText: { fontSize: 15, color: '#1565c0' },
  infoBox: { marginTop: 20, backgroundColor: '#f8f9fa', borderRadius: 8, padding: 16 },
  infoRow: { paddingVertical: 4, flexDirection: 'row', flexWrap: 'wrap' },
  infoLabel: { fontSize: 14, color: '#666', fontWeight: 'bold', marginRight: 5 },
  infoValue: { fontSize: 15, color: '#333', flex: 1 },
  demographicContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#E0F2F1', padding: 15, borderRadius: 8, marginTop: 10 },
  demographicItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  demographicText: { marginLeft: 8, fontSize: 15, color: '#333', fontWeight: '500' },
  criteriaContainer: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  criteriaRow: { flexDirection: 'row', alignItems: 'flex-start' },
  criteriaText: { fontSize: 15, color: '#555', lineHeight: 22, marginLeft: 8, flex: 1 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#ffffff' },
  formButton: { backgroundColor: '#15715A', padding: 16, borderRadius: 8, alignItems: 'center' },
  formButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});