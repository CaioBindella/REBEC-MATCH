import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import Header from '@/components/reusable/Header';

// Simulação de busca de um voluntário por ID
const getVolunteerById = (id: String) => ({
    id: id,
    nomeCompleto: 'João da Silva',
    dataNascimento: '15/05/1990',
    localizacao: 'Rio de Janeiro, RJ',
    contato: '(21) 99999-8888',
    estudoInteresse: 'Estudo sobre Enxaqueca',
    respostasFormulario: [
        { pergunta: 'Você possui diagnóstico de enxaqueca crônica?', resposta: 'Sim' },
        { pergunta: 'Participou de outros estudos nos últimos 6 meses?', resposta: 'Não' },
        { pergunta: 'Possui alguma alergia a medicamentos?', resposta: 'Nenhuma conhecida.' },
    ],
});

export default function VolunteerDetailsPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const volunteer = getVolunteerById(id);

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header />
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Perfil do Voluntário</Text>
                <Text style={styles.volunteerId}>{volunteer.id}</Text>

                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dados Pessoais</Text>
                    <InfoRow label="Nome" value={volunteer.nomeCompleto} />
                    <InfoRow label="Nascimento" value={volunteer.dataNascimento} />
                    <InfoRow label="Localização" value={volunteer.localizacao} />
                    <InfoRow label="Contato" value={volunteer.contato} />
                </View> */}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Respostas do Formulário</Text>
                    {volunteer.respostasFormulario.map((item, index) => (
                        <View key={index} style={styles.qaContainer}>
                            <Text style={styles.question}>{item.pergunta}</Text>
                            <Text style={styles.answer}>{item.resposta}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={[styles.actionButton, styles.approveButton]}>
                        <Text style={styles.actionButtonText}>Aprovar Candidatura</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.rejectButton]}>
                        <Text style={styles.actionButtonText}>Rejeitar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const InfoRow = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    content: { padding: 20 },
    title: { fontSize: 26, fontWeight: 'bold', color: '#212529' },
    volunteerId: { fontSize: 16, color: '#6c757d', marginBottom: 24 },
    section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    label: { fontSize: 16, color: '#495057' },
    value: { fontSize: 16, color: '#212529', fontWeight: '500' },
    qaContainer: { marginBottom: 12 },
    question: { fontSize: 15, color: '#6c757d' },
    answer: { fontSize: 16, fontWeight: 'bold', color: '#212529', marginTop: 4 },
    actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
    actionButton: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
    approveButton: { backgroundColor: '#15715A' },
    rejectButton: { backgroundColor: '#dc3545' },
    actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});