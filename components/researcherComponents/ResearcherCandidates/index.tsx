import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  LayoutAnimation, 
  Platform, 
  UIManager 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import VolunteerCard from '@/components/volunteerComponents/VolunteerCard';
import FilterPicker from '@/components/reusable/FilterPicker';

// Ativar LayoutAnimation no Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Mock Data ---
const mockVolunteers = [
  { id: 'VOL2666RJ', location: 'Rio de Janeiro', age: 34, sex: 'Masculino', gender: 'Homem Cis', education: 'Ensino Superior Completo', description: 'Candidato com ampla disponibilidade e interesse em estudos sobre enxaqueca.', studyApplied: 'Estudo sobre Enxaqueca' },
  { id: 'VOL0453SP', location: 'São Paulo', age: 28, sex: 'Feminino', gender: 'Mulher Cis', education: 'Mestrado', description: 'Voluntária com experiência prévia em pesquisas sobre saúde mental.', studyApplied: 'Avaliação de App de Saúde Mental' },
  { id: 'VOL06327BA', location: 'Bahia', age: 45, sex: 'Masculino', gender: 'Não-binário', education: 'Ensino Médio Completo', description: 'Participante interessado em pesquisas sobre nutrição e dieta.', studyApplied: 'Impacto da Dieta Mediterrânea' },
  { id: 'VOL1122MG', location: 'Minas Gerais', age: 22, sex: 'Feminino', gender: 'Mulher Trans', education: 'Ensino Superior Incompleto', description: 'Jovem voluntária, estudante de psicologia.', studyApplied: 'Estudo sobre Enxaqueca' },
  { id: 'VOL9876RS', location: 'Rio Grande do Sul', age: 52, sex: 'Masculino', gender: 'Homem Cis', education: 'Doutorado', description: 'Professor universitário com interesse em estudos de longo prazo.', studyApplied: 'Impacto da Dieta Mediterrânea' },
];

// --- Dados dos filtros ---
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
  
  // Inicia fechado (false) ou aberto (true) conforme preferir
  const [filtersVisible, setFiltersVisible] = useState(true);

  const toggleFilters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFiltersVisible(!filtersVisible);
  };

  const filteredVolunteers = useMemo(() => {
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
        <TouchableOpacity 
          style={styles.filterHeader} 
          onPress={toggleFilters}
          activeOpacity={0.7}
        >
            <View style={styles.filterTitleContainer}>
                <View style={styles.iconCircle}>
                    <Ionicons name="options" size={20} color="#15715A" />
                </View>
                <Text style={styles.mainFilterTitle}>Filtrar Resultados</Text>
            </View>
            <Ionicons 
                name={filtersVisible ? 'chevron-up' : 'chevron-down'} 
                size={22} 
                color="#6c757d" 
            />
        </TouchableOpacity>
        
        {filtersVisible && (
          <View style={styles.filterContent}>
            <View style={styles.inputSpacing}>
                <FilterPicker label="Estudo" value={selectedStudy} onValueChange={(value) => setSelectedStudy(value as string | null)} items={researcherStudies} placeholder={{ label: "Todos os estudos", value: null }} />
            </View>
            <View style={styles.inputSpacing}>
                <FilterPicker label="Região" value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as string | null)} items={regions} placeholder={{ label: "Todas as regiões", value: null }} />
            </View>
            <View style={styles.inputSpacing}>
                <FilterPicker label="Sexo" value={selectedSex} onValueChange={(value) => setSelectedSex(value as string | null)} items={sexes} placeholder={{ label: "Todos os sexos", value: null }} />
            </View>
            <View style={styles.inputSpacing}>
                <FilterPicker label="Gênero" value={selectedGender} onValueChange={(value) => setSelectedGender(value as string | null)} items={genders} placeholder={{ label: "Todos os gêneros", value: null }} />
            </View>
            <View style={styles.inputSpacing}>
                <FilterPicker label="Escolaridade" value={selectedEducation} onValueChange={(value) => setSelectedEducation(value as string | null)} items={educationLevels} placeholder={{ label: "Todos os níveis", value: null }} />
            </View>
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
                pathname: "/(protected)/researcher/volunteer-details/[id]",
                params: { id: volunteer.id },
              })
            }
          />
        ))
      ) : (
        <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={styles.noResultsText}>Nenhum candidato encontrado com os filtros selecionados.</Text>
        </View>
      )}
    </ScrollView>
  );
}

// --- Estilos Melhorados ---
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
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#212529',
    },
    exportButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E0F2F1', // Fundo verde bem claro
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    exportButtonText: {
      marginLeft: 6,
      fontSize: 14,
      fontWeight: '600',
      color: '#15715A',
    },
    
    // Novo Estilo do Card de Filtros
    filtersWrapper: {
      backgroundColor: '#fff',
      borderRadius: 16,
      marginBottom: 24,
      // Sombra
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
      overflow: 'hidden', // Importante para o border radius com filhos
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.03)'
    },
    filterHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#fff',
    },
    filterTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0FDF4', // Verde muito sutil
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    mainFilterTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#343a40',
    },
    filterContent: {
      paddingHorizontal: 16,
      paddingBottom: 20,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
      paddingTop: 16,
    },
    inputSpacing: {
        marginBottom: 12,
    },

    // Empty State
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    noResultsText: {
      textAlign: 'center',
      marginTop: 12,
      fontSize: 16,
      color: '#6c757d',
      maxWidth: '80%',
    },
});