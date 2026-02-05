import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import InfoCard from '@/components/reusable/InfoCard';

export default function ResearcherDashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.headerTitle}>
        <Text style={styles.mainTitle}>Pesquisador</Text>
      </View>

      {/* <InfoCard
        icon={{ name: 'add-circle-outline', size: 60, color: '#15715A' }}
        title="Registrar Novo Estudo"
        description="Cadastre uma nova pesquisa, defina seus objetivos, critérios de inclusão e prepare-se para recrutar voluntários."
        buttonText="Registrar Estudo"
        linkTo="/(protected)/researcher/create-study/page"
      /> */}

      <InfoCard
        icon={{ name: 'list-outline', size: 60, color: '#15715A' }}
        title="Gerenciar Meus Estudos"
        description="Visualize e edite os detalhes dos seus estudos já existentes, acompanhe o status e acesse os dados dos participantes."
        buttonText="Gerenciar"
        linkTo="/(protected)/researcher/manage-studies/page"
      />

      <InfoCard
        icon={{ name: 'people-outline', size: 60, color: '#15715A' }}
        title="Gerenciar Candidaturas"
        description="Revise as candidaturas dos voluntários para seus estudos, verifique critérios e gerencie os participantes selecionados."
        buttonText="Ver Candidatos"
        linkTo="/(protected)/researcher/manage-candidates/page"
      />

      {/* <InfoCard
        icon={{ name: 'chatbubble-ellipses-outline', size: 60, color: '#15715A' }}
        title="Contato com Voluntários"
        description="Estabeleça comunicação direta com os voluntários inscritos para esclarecer dúvidas, fornecer informações adicionais ou coordenar detalhes do estudo."
        buttonText="Conversar"
        linkTo="/(protected)/researcher/contacts/page"
      /> */}
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