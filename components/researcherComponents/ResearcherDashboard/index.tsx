import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import InfoCard from '@/components/reusable/InfoCard';

export default function ResearcherDashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.headerTitle}>
        <Text style={styles.mainTitle}>Pesquisador</Text>
      </View>

      <InfoCard
        icon={{ name: 'add-circle-outline', size: 60, color: '#15715A' }}
        title="Criar Novo Estudo"
        description="Inicie uma nova pesquisa, defina seus objetivos, critérios de inclusão e prepare-se para recrutar voluntários."
        buttonText="Criar Estudo"
        linkTo="/components/researcherComponents/ResearcherCreateStudy"
      />

      <InfoCard
        icon={{ name: 'people-outline', size: 60, color: '#15715A' }}
        title="Gerenciar Voluntários"
        description="Revise as candidaturas dos voluntários para seus estudos, verifique critérios e gerencie os participantes selecionados."
        buttonText="Ver Candidatos"
        linkTo="/components/researcherComponents/ResearcherCandidates"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  headerTitle: {
    width: '100%',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
  },
});