import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '@/components/reusable/Header';
import { apiService, getErrorMessage } from '@/services/api/apiClient';
import { RespostaResponseDTO } from '@/types/types';
import { sexoLabel } from '@/utils/formatters';

const primeiro = (valor: string | string[] | undefined) => (Array.isArray(valor) ? valor[0] : valor);

export default function VolunteerDetailsScreen() {
  const router = useRouter();
  
  // id = candidatura; voluntarioId = perfil do voluntário; demais dados já pseudonimizados pela API
  const params = useLocalSearchParams();
  const id = primeiro(params.id);
  const voluntarioId = primeiro(params.voluntarioId);
  const nomeDisplay = primeiro(params.nomeFicticio);
  const estudoTitulo = primeiro(params.estudoTitulo);
  const idade = primeiro(params.idade);
  const sexo = primeiro(params.sexo);
  const uf = primeiro(params.uf);

  const [respostas, setRespostas] = useState<RespostaResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function loadData() {
        if (!voluntarioId) {
            Alert.alert("Erro", "ID do voluntário não identificado.");
            setLoading(false);
            return;
        }

        try {
            const data = await apiService.resposta.getByVoluntario(Number(voluntarioId));
            setRespostas(data);
        } catch (error) {
            Alert.alert('Erro', getErrorMessage(error, 'Não foi possível carregar as respostas.'));
        } finally {
            setLoading(false);
        }
    }
    loadData();
  }, [voluntarioId]);

  // A aprovação não conclui o match: ela envia um convite que o voluntário ainda precisa confirmar
  const handleAnalise = async (aprovado: boolean) => {
      try {
          setEnviando(true);
          await apiService.candidatura.analisePesquisador(Number(id), aprovado);
          Alert.alert(
              'Sucesso',
              aprovado
                ? 'Candidato aprovado! O voluntário foi notificado e o chat será liberado quando ele confirmar a participação.'
                : 'Candidatura recusada. O voluntário foi notificado.',
              [{ text: 'OK', onPress: () => router.back() }]
          );
      } catch (error) {
          Alert.alert('Erro', getErrorMessage(error, 'Falha ao processar a análise.'));
      } finally {
          setEnviando(false);
      }
  };

  return (
    <View style={styles.container}>
        <Header/> 
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Título com o Nome do Candidato (Fora do Header) */}
            <View style={styles.candidateHeader}>
                <Text style={styles.candidateLabel}>Candidato:</Text>
                <Text style={styles.candidateName}>{nomeDisplay || 'Não informado'}</Text>
                <Text style={styles.candidateInfo}>
                    {idade ? `${idade} anos` : 'Idade não informada'} · {sexoLabel(sexo)} · {uf || 'BR'}
                </Text>
                {!!estudoTitulo && <Text style={styles.candidateInfo}>Estudo: {estudoTitulo}</Text>}
            </View>
            
            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Respostas do Formulário</Text>
            
            {loading ? (
                <ActivityIndicator size="large" color="#15715A" style={{ marginTop: 20 }} />
            ) : respostas.length === 0 ? (
                <Text style={styles.emptyText}>Este voluntário não possui respostas registradas.</Text>
            ) : (
                respostas.map((resp, index) => (
                    <View key={resp.id || index} style={styles.qaContainer}>
                        <Text style={styles.question}>
                            {resp.questaoTexto || "Pergunta não identificada"}
                        </Text>
                        <Text style={styles.answer}>{resp.conteudo || 'Sem resposta'}</Text>
                    </View>
                ))
            )}
            
            <View style={styles.actionsContainer}>
                <Text style={styles.actionLabel}>Avaliar Candidatura:</Text>
                <View style={styles.buttonsRow}>
                    <TouchableOpacity 
                        style={[styles.btn, styles.btnReject]} 
                        onPress={() => handleAnalise(false)}
                        disabled={enviando}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.btnText, styles.btnTextReject]}>Recusar</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.btn, styles.btnApprove]} 
                        onPress={() => handleAnalise(true)}
                        disabled={enviando}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.btnText}>Aprovar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f8f9fa' 
    },
    scrollContent: { 
        padding: 20,
        paddingBottom: 40
    },
    // Estilos para o Nome do Candidato no topo
    candidateHeader: {
        marginBottom: 10,
        alignItems: 'center',
    },
    candidateLabel: {
        fontSize: 14,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    candidateInfo: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
        textAlign: 'center',
    },
    candidateName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#15715A',
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 15,
    },
    sectionTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        color: '#212529',
        marginBottom: 15,
        marginTop: 10,
    },
    qaContainer: { 
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    question: { 
        fontSize: 16, 
        fontWeight: '600', 
        color: '#333',
        marginBottom: 8 
    },
    answer: { 
        fontSize: 16, 
        color: '#15715A', 
        fontWeight: '500' 
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 20,
        fontSize: 16
    },
    actionsContainer: {
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 20
    },
    actionLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#444'
    },
    buttonsRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between',
        gap: 15
    },
    btn: { 
        flex: 1, 
        paddingVertical: 14, 
        borderRadius: 8, 
        alignItems: 'center', 
        justifyContent: 'center',
        elevation: 3
    },
    btnReject: { 
        backgroundColor: '#fff',
        borderWidth: 1.5, // Borda um pouco mais grossa
        borderColor: '#d9534f'
    },
    btnApprove: { 
        backgroundColor: '#15715A' 
    },
    btnText: { 
        fontSize: 16, 
        fontWeight: 'bold',
        color: '#fff' // Cor padrão (para o botão Aprovar)
    },
    // Estilo específico para o texto do botão Recusar
    btnTextReject: {
        color: '#d9534f'
    }
});