import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Header from '@/components/reusable/Header';
import { apiService } from '@/services/api/apiClient';

export default function VolunteerDetailsScreen() {
  const router = useRouter();
  const { id, candidaturaId } = useLocalSearchParams(); // id do voluntário, id da candidatura
  const [respostas, setRespostas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        try {
            // Busca as respostas do questionário do voluntário
            const data = await apiService.resposta.getByVoluntario(Number(id));
            setRespostas(data);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível carregar as respostas.");
        } finally {
            setLoading(false);
        }
    }
    loadData();
  }, [id]);

  const handleAnalise = async (aprovado: boolean) => {
      try {
          await apiService.candidatura.analisePesquisador(Number(candidaturaId), aprovado);
          Alert.alert("Sucesso", aprovado ? "Candidato Aprovado!" : "Candidato Recusado.");
          router.back();
      } catch (error) {
          Alert.alert("Erro", "Falha ao processar análise.");
      }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Header />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.title}>Ficha do Voluntário</Text>
            
            {loading ? <ActivityIndicator color="#15715A" /> : (
                respostas.map((resp, index) => (
                    <View key={index} style={styles.qaContainer}>
                        <Text style={styles.question}>{resp.questaoTexto}</Text>
                        <Text style={styles.answer}>{resp.textoResposta || resp.opcaoEscolhida}</Text>
                    </View>
                ))
            )}
            
            <View style={styles.actions}>
                <TouchableOpacity style={[styles.btn, styles.btnReject]} onPress={() => handleAnalise(false)}>
                    <Text style={styles.btnText}>Recusar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnApprove]} onPress={() => handleAnalise(true)}>
                    <Text style={styles.btnText}>Aprovar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    qaContainer: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
    question: { fontSize: 16, fontWeight: 'bold', color: '#555' },
    answer: { fontSize: 16, color: '#15715A', marginTop: 5 },
    actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, marginBottom: 50 },
    btn: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
    btnReject: { backgroundColor: '#d9534f' },
    btnApprove: { backgroundColor: '#15715A' },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});