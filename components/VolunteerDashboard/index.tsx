import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Importe o InfoCard que você já tem
import InfoCard from '@/components/InfoCard';

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
        description="Lorem ipsum dolor sit amet pretium consectetur adipiscing elit. Lorem consectetur adipiscing elit."
        buttonText="Veja detalhes"
        linkTo="/available-research"
      />

      <InfoCard
        imageSource={require('@/assets/images/CardPesquisasAndamento.png')}
        title="Pesquisas em Andamento"
        description="Lorem ipsum dolor sit amet pretium consectetur adipiscing elit. Lorem consectetur adipiscing elit."
        buttonText="Veja detalhes"
        linkTo="/ongoing-research"
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