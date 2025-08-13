import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import InfoCard from '@/components/reusable/InfoCard';

// Este componente é apenas o conteúdo específico do voluntário.
// O Header e o SafeAreaView ficam na página principal (home/page.tsx).
export default function VolunteerDashboard() {
  return (
    <View style={styles.container}>
      <View style={styles.headerTitle}>
        <Text style={styles.mainTitle}>Voluntário</Text>
      </View>

      <InfoCard
        imageSource={require('@/assets/images/CardPesquisasDisponiveis.png')}
        title="Ver pesquisas disponíveis"
        description="Encontre estudos clínicos e pesquisas científicas perto de si. A sua participação voluntária é fundamental para o avanço da ciência e o desenvolvimento de novos tratamentos."
        buttonText="Veja detalhes"
        linkTo="/available-research/page"
      />

      <InfoCard
        imageSource={require('@/assets/images/CardPesquisasAndamento.png')}
        title="Meus Estudos"
        description="Acesse a área dedicada aos estudos para os quais você foi selecionado. Acompanhe o progresso e comunique-se diretamente com os pesquisadores através do chat."
        buttonText="Acompanhar"
        linkTo="/my-studies/page"
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