import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importando ícones
import VolunteerCard from '@/components/volunteerComponents/VolunteerCard'; // Importando nosso card

// Dados mock para simular a lista de voluntários
const mockVolunteers = [
  { id: 'VOL2666RJ', location: 'Rio de Janeiro', description: 'Lorem ipsum dolor sit amet pretium consectetur adipiscing elit.', tags: ['Tag', 'Tag', 'Tag', 'Tag'] },
  { id: 'VOL0453SP', location: 'São Paulo', description: 'Lorem ipsum dolor sit amet pretium consectetur adipiscing elit.', tags: ['Tag', 'Tag', 'Tag', 'Tag'] },
  { id: 'VOL06327BA', location: 'Bahia', description: 'Lorem ipsum dolor sit amet pretium consectetur adipiscing elit.', tags: ['Tag', 'Tag', 'Tag', 'Tag'] },
  { id: 'VOL02378MT', location: 'Mato Grosso', description: 'Lorem ipsum dolor sit amet pretium consectetur adipiscing elit.', tags: ['Tag', 'Tag', 'Tag', 'Tag'] },
];

const ResearcherCandidates = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileTag}>
        <Text style={styles.profileTagText}>Perfil Pesquisador</Text>
      </View>

      <Text style={styles.title}>Buscar Voluntários</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Voluntários"
        />
        <Ionicons name="search" size={20} color="#6c757d" style={styles.searchIcon} />
      </View>
      
      <View style={styles.filtersContainer}>
        {['Filtro', 'Filtro', 'Filtro', 'Filtro'].map((filter, index) => (
          <TouchableOpacity key={index} style={styles.filterButton}>
            <Text style={styles.filterText}>{filter}</Text>
            <Ionicons name="chevron-down" size={16} color="#495057" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Renderizando a lista de voluntários */}
      {mockVolunteers.map((volunteer) => (
        <VolunteerCard
          key={volunteer.id}
          id={volunteer.id}
          location={volunteer.location}
          description={volunteer.description}
          tags={volunteer.tags}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    paddingBottom: 40, // Espaço no final da lista
  },
  profileTag: {
    backgroundColor: '#E0F2F1', // Um verde claro
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start', // Alinha à esquerda
    marginBottom: 16,
  },
  profileTagText: {
    color: '#166865', // Verde escuro do seu tema
    fontWeight: '500',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ced4da',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 8,
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    color: '#495057',
  },
});

export default ResearcherCandidates;