import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  LayoutAnimation, 
  Platform, 
  UIManager,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import VolunteerCard from '@/components/volunteerComponents/VolunteerCard';
import FilterPicker from '@/components/reusable/FilterPicker';

import { apiService } from '@/services/api/apiClient';
import { useAuth } from '@/context/AuthContext';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 1. Atualizei a Interface para incluir o STATUS
interface VolunteerData {
  id: string;
  candidaturaId: number;
  location: string;
  age: number;
  sex: string;
  gender: string;
  education: string;
  description: string;
  studyApplied: string;
  voluntarioIdReal: number;
  nomeFicticio: string;
  status: string; // <--- NOVO CAMPO
}

// --- Dados dos filtros ---
const researcherStudies = [
  { label: 'Estudo sobre Enxaqueca', value: 'Estudo sobre Enxaqueca' },
  { label: 'Avaliação de App de Saúde Mental', value: 'Avaliação de App de Saúde Mental' },
  { label: 'Impacto da Dieta Mediterrânea', value: 'Impacto da Dieta Mediterrânea' },
];

const regions = [
  { label: 'Rio de Janeiro', value: 'RJ' },
  { label: 'São Paulo', value: 'SP' },
  { label: 'Bahia', value: 'BA' },
  { label: 'Minas Gerais', value: 'MG' },
  { label: 'Rio Grande do Sul', value: 'RS' },
];

const sexes = [
  { label: 'Masculino', value: 'MASCULINO' },
  { label: 'Feminino', value: 'FEMININO' },
];

const genders = [
  { label: 'Homem Cis', value: 'Homem Cis' },
  { label: 'Mulher Cis', value: 'Mulher Cis' },
];

const educationLevels = [
  { label: 'Ensino Superior Completo', value: 'Ensino Superior Completo' },
];

export default function ResearcherCandidates() {
  const router = useRouter();
  const { user } = useAuth();

  const [volunteers, setVolunteers] = useState<VolunteerData[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [selectedStudy, setSelectedStudy] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedSex, setSelectedSex] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<string | null>(null);
  
  const [filtersVisible, setFiltersVisible] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const pesquisadorId = user?.perfilId; 

      if (!pesquisadorId) {
        console.warn("ID do pesquisador não encontrado.");
        setLoading(false);
        return;
      }

      const data = await apiService.candidatura.listarPorPesquisador(pesquisadorId);

      // 2. Mapeamento atualizado incluindo o status
      const formattedData: VolunteerData[] = data.map((item: any) => ({
        id: item.nomeFicticio || `CAND-${item.candidaturaId}`,
        nomeFicticio: item.nomeFicticio || item.voluntarioNome || `Candidato ${item.voluntarioId || ''}`,
        candidaturaId: item.candidaturaId,
        location: item.localizacao || 'Não informado',
        age: item.idade || 0,
        sex: item.sexo || 'Não informado',
        gender: item.sexo === 'MASCULINO' ? 'Homem Cis' : item.sexo === 'FEMININO' ? 'Mulher Cis' : 'Outro',
        education: 'Não informado',
        description: item.descricao || `Interesse em ${item.estudoTitulo}`,
        studyApplied: item.estudoTitulo,
        voluntarioIdReal: item.voluntarioIdReal || item.voluntarioId,
        status: item.status // <--- PEGANDO O STATUS DO BACKEND
      }));

      setVolunteers(formattedData);
    } catch (error) {
      console.error("Erro ao buscar voluntários:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de candidatos.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFilters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFiltersVisible(!filtersVisible);
  };

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter(volunteer => {
      return (
        (!selectedStudy || volunteer.studyApplied === selectedStudy) &&
        (!selectedRegion || volunteer.location.includes(selectedRegion)) &&
        (!selectedSex || volunteer.sex === selectedSex) &&
        (!selectedGender || volunteer.gender === selectedGender) &&
        (!selectedEducation || volunteer.education === selectedEducation)
      );
    });
  }, [volunteers, selectedStudy, selectedRegion, selectedSex, selectedGender, selectedEducation]);

  const handleExport = async () => {
    if (filteredVolunteers.length === 0) {
      alert("Nenhum candidato encontrado para exportar.");
      return;
    }

    const dataForSheet = [
        ["ID", "Localização", "Sexo", "Gênero", "Escolaridade", "Descrição", "Estudo Aplicado", "Status"],
        ...filteredVolunteers.map(item => [
            item.id,
            item.location,
            item.sex,
            item.gender,
            item.education,
            item.description,
            item.studyApplied,
            item.status
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

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#15715A" />
      </View>
    );
  }

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
            key={volunteer.candidaturaId}
            id={volunteer.id}
            location={volunteer.location}
            description={volunteer.description}
            studyApplied={volunteer.studyApplied}
            // Passamos o status para o card (para você poder estilizar se quiser, ex: opacity)
            // @ts-ignore - Caso o VolunteerCard ainda não tenha essa prop na tipagem
            status={volunteer.status}
            
            // 3. Lógica para impedir acesso se RECUSADO
            onAnalyze={() => {
              if (volunteer.status === 'RECUSADO') {
                Alert.alert("Candidatura Recusada", "Este candidato já foi recusado e não está mais disponível para análise.");
                return; 
              }

              router.push({
                pathname: "/(protected)/researcher/volunteer-details/[id]",
                params: { 
                  id: volunteer.candidaturaId,
                  voluntarioId: volunteer.voluntarioIdReal,
                  nomeFicticio: volunteer.nomeFicticio
                 }, 
              })
            }}
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
      backgroundColor: '#E0F2F1',
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
    filtersWrapper: {
      backgroundColor: '#fff',
      borderRadius: 16,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
      overflow: 'hidden',
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
        backgroundColor: '#F0FDF4',
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