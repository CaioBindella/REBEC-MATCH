import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import VolunteerCard from '@/components/volunteerComponents/VolunteerCard';
import FilterPicker from '@/components/reusable/FilterPicker';

// --- Mock Data ---
const mockVolunteers = [
  { id: 'VOL2666RJ', location: 'Rio de Janeiro', age: 34, sex: 'Masculino', gender: 'Homem Cis', education: 'Ensino Superior Completo', description: 'Candidato com ampla disponibilidade e interesse em estudos sobre enxaqueca.', studyApplied: 'Estudo sobre Enxaqueca' },
  { id: 'VOL0453SP', location: 'São Paulo', age: 28, sex: 'Feminino', gender: 'Mulher Cis', education: 'Mestrado', description: 'Voluntária com experiência prévia em pesquisas sobre saúde mental.', studyApplied: 'Avaliação de App de Saúde Mental' },
  { id: 'VOL06327BA', location: 'Bahia', age: 45, sex: 'Masculino', gender: 'Não-binário', education: 'Ensino Médio Completo', description: 'Participante interessado em pesquisas sobre nutrição e dieta.', studyApplied: 'Impacto da Dieta Mediterrânea' },
  { id: 'VOL1122MG', location: 'Minas Gerais', age: 22, sex: 'Feminino', gender: 'Mulher Trans', education: 'Ensino Superior Incompleto', description: 'Jovem voluntária, estudante de psicologia.', studyApplied: 'Estudo sobre Enxaqueca' },
  { id: 'VOL9876RS', location: 'Rio Grande do Sul', age: 52, sex: 'Masculino', gender: 'Homem Cis', education: 'Doutorado', description: 'Professor universitário com interesse em estudos de longo prazo.', studyApplied: 'Impacto da Dieta Mediterrânea' },
];

// --- Dados dos filtros ---
// FIX #2: GARANTA QUE ESTAS CONSTANTES ESTEJAM FORA E ANTES DA FUNÇÃO DO COMPONENTE
const researcherStudies = [
  { label: 'Estudo sobre Enxaqueca', value: 'Estudo sobre Enxaqueca' },
  { label: 'Avaliação de App de Saúde Mental', value: 'Avaliação de App de Saúde Mental' },
  { label: 'Impacto da Dieta Mediterrânea', value: 'Impacto da Dieta Mediterrânea' },
];

const regions = [
  { label: 'Rio de Janeiro', value: 'Rio de Janeiro' },
  { label: 'São Paulo', value: 'São Paulo' },
  { label: 'Bahia', value: 'Bahia' },
  { label: 'Minas Gerais', value: 'Minas Gerais' },
  { label: 'Rio Grande do Sul', value: 'Rio Grande do Sul' },
];

const sexes = [
  { label: 'Masculino', value: 'Masculino' },
  { label: 'Feminino', value: 'Feminino' },
];

const genders = [
  { label: 'Homem Cis', value: 'Homem Cis' },
  { label: 'Mulher Cis', value: 'Mulher Cis' },
  { label: 'Homem Trans', value: 'Homem Trans' },
  { label: 'Mulher Trans', value: 'Mulher Trans' },
  { label: 'Não-binário', value: 'Não-binário' },
];

const educationLevels = [
  { label: 'Ensino Médio Incompleto', value: 'Ensino Médio Incompleto' },
  { label: 'Ensino Médio Completo', value: 'Ensino Médio Completo' },
  { label: 'Ensino Superior Incompleto', value: 'Ensino Superior Incompleto' },
  { label: 'Ensino Superior Completo', value: 'Ensino Superior Completo' },
  { label: 'Mestrado', value: 'Mestrado' },
  { label: 'Doutorado', value: 'Doutorado' },
];


// --- Tela principal ---
export default function ResearcherCandidates() {
  const router = useRouter();

  const [selectedStudy, setSelectedStudy] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedSex, setSelectedSex] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<string | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(true);

  const filteredVolunteers = useMemo(() => {
    // FIX #1: A FUNÇÃO DENTRO DO useMemo PRECISA DE UM 'return'
    return mockVolunteers.filter(volunteer => {
      return (
        (!selectedStudy || volunteer.studyApplied === selectedStudy) &&
        (!selectedRegion || volunteer.location === selectedRegion) &&
        (!selectedSex || volunteer.sex === selectedSex) &&
        (!selectedGender || volunteer.gender === selectedGender) &&
        (!selectedEducation || volunteer.education === selectedEducation)
      );
    });
  }, [selectedStudy, selectedRegion, selectedSex, selectedGender, selectedEducation]);

  const handleExport = async () => {
    if (filteredVolunteers.length === 0) {
      alert("Nenhum candidato encontrado para exportar.");
      return;
    }

    const dataForSheet = [
        ["ID", "Localização", "Sexo", "Gênero", "Escolaridade", "Descrição", "Estudo Aplicado"],
        ...filteredVolunteers.map(item => [
            item.id,
            item.location,
            item.sex,
            item.gender,
            item.education,
            item.description,
            item.studyApplied
        ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(dataForSheet);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Candidatos");

    const base64 = XLSX.write(wb, { type: "base64" });
    const filename = FileSystem.cacheDirectory + "candidatos_filtrados.xlsx";
    
    try {
      await FileSystem.writeAsStringAsync(filename, base64, {
        encoding: FileSystem.EncodingType.Base64
      });
      if (!(await Sharing.isAvailableAsync())) {
        alert("O compartilhamento não está disponível no seu dispositivo.");
        return;
      }
      await Sharing.shareAsync(filename);
    } catch (e) {
      console.error(e);
      alert("Ocorreu um erro ao exportar os dados.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Candidatos</Text>
        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
            <Ionicons name="download-outline" size={18} color="#15715A" />
            <Text style={styles.exportButtonText}>Exportar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersWrapper}>
        <View style={styles.filterHeader}>
            <Text style={styles.mainFilterTitle}>Filtrar por:</Text>
            <TouchableOpacity onPress={() => setFiltersVisible(!filtersVisible)}>
                <Ionicons 
                    name={filtersVisible ? 'chevron-up' : 'chevron-down'} 
                    size={26} 
                    color="#495057" 
                />
            </TouchableOpacity>
        </View>
        
        {filtersVisible && (
          <View style={styles.filterContainer}>
            <FilterPicker label="Estudo" value={selectedStudy} onValueChange={(value) => setSelectedStudy(value as string | null)} items={researcherStudies} placeholder={{ label: "Todos os estudos", value: null }} />
            <FilterPicker label="Região" value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as string | null)} items={regions} placeholder={{ label: "Todas as regiões", value: null }} />
            <FilterPicker label="Sexo" value={selectedSex} onValueChange={(value) => setSelectedSex(value as string | null)} items={sexes} placeholder={{ label: "Todos os sexos", value: null }} />
            <FilterPicker label="Gênero" value={selectedGender} onValueChange={(value) => setSelectedGender(value as string | null)} items={genders} placeholder={{ label: "Todos os gêneros", value: null }} />
            <FilterPicker label="Escolaridade" value={selectedEducation} onValueChange={(value) => setSelectedEducation(value as string | null)} items={educationLevels} placeholder={{ label: "Todos os níveis", value: null }} />
          </View>
        )}
      </View>

      {filteredVolunteers.length > 0 ? (
        filteredVolunteers.map((volunteer) => (
          <VolunteerCard
            key={volunteer.id}
            id={volunteer.id}
            location={volunteer.location}
            description={volunteer.description}
            studyApplied={volunteer.studyApplied}
            onAnalyze={() =>
              router.push({
                pathname: "/volunteer-details/[id]",
                params: { id: volunteer.id },
              })
            }
          />
        ))
      ) : (
        <Text style={styles.noResultsText}>Nenhum candidato encontrado com os filtros selecionados.</Text>
      )}
    </ScrollView>
  );
}

// --- Estilos (sem alterações) ---
const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: '#f8f9fa',
    },
    contentContainer: {
      padding: 20,
      paddingBottom: 40,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#212529',
    },
    exportButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#e9ecef',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    exportButtonText: {
      marginLeft: 6,
      fontSize: 15,
      fontWeight: '600',
      color: '#15715A',
    },
    filtersWrapper: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    filterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    mainFilterTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#343a40',
    },
    filterContainer: {
      marginTop: 16,
    },
    noResultsText: {
      textAlign: 'center',
      marginTop: 30,
      fontSize: 16,
      color: '#6c757d',
    },
  });