import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/reusable/Header';
import { useAuth } from '@/context/AuthContext';
import { apiService, getErrorMessage } from '@/services/api/apiClient';
import { CandidaturaResponseDTO, EstudoResponseDTO } from '@/types/types';
import {
  estaRecrutando,
  faixaEtaria,
  formatDate,
  generoElegivelLabel,
  statusCandidaturaLabel,
  statusRecrutamentoLabel,
} from '@/utils/formatters';

export default function StudyDetailScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [study, setStudy] = useState<EstudoResponseDTO | null>(null);
  const [candidatura, setCandidatura] = useState<CandidaturaResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function fetchStudyDetails() {
      if (!id || !user?.perfilId) return;
      try {
        setLoading(true);
        const [estudoData, candidaturasData] = await Promise.all([
          apiService.estudo.getById(Number(id)),
          apiService.candidatura.listarPorVoluntario(user.perfilId),
        ]);
        setStudy(estudoData);
        setCandidatura(candidaturasData.find((c) => c.estudoId === Number(id)) ?? null);
      } catch (error) {
        Alert.alert('Erro', getErrorMessage(error, 'Não foi possível carregar os detalhes do estudo.'));
        router.back();
      } finally {
        setLoading(false);
      }
    }
    fetchStudyDetails();
  }, [id, user?.perfilId, router]);

  const handleCandidatura = () => {
    if (!study) return;
    Alert.alert(
      'Confirmar Candidatura',
      `Deseja se candidatar para o estudo "${study.publicTitle}"? O pesquisador responsável terá acesso às respostas do seu formulário de perfil, identificadas apenas pelo seu nome fictício.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              setSending(true);
              const criada = await apiService.candidatura.criar({ estudoId: study.id });
              setCandidatura(criada);
              Alert.alert('Sucesso', 'Candidatura enviada! Você será notificado sobre o progresso.');
            } catch (error) {
              Alert.alert('Erro', getErrorMessage(error, 'Não foi possível realizar a candidatura.'));
            } finally {
              setSending(false);
            }
          },
        },
      ]
    );
  };

  if (loading || !study) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#15715A" />
      </View>
    );
  }

  const criterioPrincipal = study.criterios.length > 0 ? study.criterios[0] : null;

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Stack.Screen options={{ title: 'Detalhes do Estudo' }} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{study.publicTitle}</Text>

        {candidatura && (
          <View style={styles.appliedTopBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#856404" />
            <Text style={styles.appliedTopText}>Sua candidatura: {statusCandidaturaLabel(candidatura.status)}.</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Informações Gerais</Text>
        <Text style={styles.description}>{study.scientificTitle || 'Sem descrição científica disponível.'}</Text>

        {!!study.hcFreetext && (
          <View style={styles.interventionBox}>
            <Text style={styles.interventionLabel}>Condição de saúde:</Text>
            <Text style={styles.interventionText}>{study.hcFreetext}</Text>
          </View>
        )}
        {!!study.iFreetext && (
          <View style={styles.interventionBox}>
            <Text style={styles.interventionLabel}>Intervenção:</Text>
            <Text style={styles.interventionText}>{study.iFreetext}</Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <InfoRow label="Status" value={statusRecrutamentoLabel(study.recruitmentStatus)} />
          <InfoRow label="Número de Registro" value={study.trialId} />
          <InfoRow label="Data de Registro" value={formatDate(study.dateRegistration)} />
          <InfoRow label="Aprovação Ética (CEP)" value={study.approvalDate || 'Não informada'} />
          <InfoRow label="Patrocinador" value={study.primarySponsor || 'Não informado'} />
          <InfoRow label="Pesquisador Responsável" value={study.pesquisador?.nomeFicticio || 'Não informado'} />
        </View>

        {criterioPrincipal && (
          <>
            <Text style={styles.sectionTitle}>Público Alvo</Text>
            <View style={styles.demographicContainer}>
              <View style={styles.demographicItem}>
                <Ionicons name="people" size={20} color="#15715A" />
                <Text style={styles.demographicText}>{generoElegivelLabel(criterioPrincipal.gender)}</Text>
              </View>
              <View style={styles.demographicItem}>
                <Ionicons name="calendar" size={20} color="#15715A" />
                <Text style={styles.demographicText}>{faixaEtaria(criterioPrincipal.agemin, criterioPrincipal.agemax)}</Text>
              </View>
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Critérios para Participação</Text>
        {study.criterios.length > 0 ? (
          study.criterios.map((criterio) => (
            <View key={criterio.id} style={styles.criteriaContainer}>
              {!!criterio.inclusion_criteria && (
                <View style={styles.criteriaRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#15715A" style={{ marginTop: 3 }} />
                  <Text style={styles.criteriaText}>
                    <Text style={{ fontWeight: 'bold', color: '#15715A' }}>Inclusão: </Text>
                    {criterio.inclusion_criteria}
                  </Text>
                </View>
              )}
              {!!criterio.exclusion_criteria && (
                <View style={[styles.criteriaRow, { marginTop: 8 }]}>
                  <Ionicons name="close-circle" size={18} color="#d9534f" style={{ marginTop: 3 }} />
                  <Text style={styles.criteriaText}>
                    <Text style={{ fontWeight: 'bold', color: '#d9534f' }}>Exclusão: </Text>
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

      <View style={styles.footer}>
        {candidatura ? (
          <View style={styles.appliedFooterWarning}>
            <Ionicons name="information-circle" size={24} color="#856404" />
            <Text style={styles.appliedFooterText}>Candidatura já enviada. Acompanhe o status em "Meus Estudos".</Text>
          </View>
        ) : estaRecrutando(study.recruitmentStatus) ? (
          <TouchableOpacity style={[styles.formButton, sending && { opacity: 0.7 }]} onPress={handleCandidatura} disabled={sending}>
            {sending ? <ActivityIndicator color="#fff" /> : <Text style={styles.formButtonText}>Candidatar-se para o Estudo</Text>}
          </TouchableOpacity>
        ) : (
          <View style={styles.appliedFooterWarning}>
            <Ionicons name="information-circle" size={24} color="#856404" />
            <Text style={styles.appliedFooterText}>Este estudo não está recrutando voluntários no momento.</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#212529', marginBottom: 16 },
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
  demographicContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#E0F2F1', padding: 15, borderRadius: 8, marginTop: 10, gap: 8 },
  demographicItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  demographicText: { marginLeft: 8, fontSize: 15, color: '#333', fontWeight: '500', flexShrink: 1 },
  criteriaContainer: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  criteriaRow: { flexDirection: 'row', alignItems: 'flex-start' },
  criteriaText: { fontSize: 15, color: '#555', lineHeight: 22, marginLeft: 8, flex: 1 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: '#ffffff' },
  formButton: { backgroundColor: '#15715A', padding: 16, borderRadius: 8, alignItems: 'center' },
  formButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});
