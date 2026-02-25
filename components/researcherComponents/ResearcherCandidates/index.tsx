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

// --- Função de Conversão CEP -> UF ---
const convertCepToState = (cep: string | null): string => {
  if (!cep) return 'BR';
  const cepClean = cep.replace(/\D/g, '');
  if (cepClean.length < 5) return 'BR';

  const prefix = parseInt(cepClean.substring(0, 5));

  if (prefix >= 1000 && prefix <= 19999) return 'SP';
  if (prefix >= 20000 && prefix <= 28999) return 'RJ';
  if (prefix >= 29000 && prefix <= 29999) return 'ES';
  if (prefix >= 30000 && prefix <= 39999) return 'MG';
  if (prefix >= 40000 && prefix <= 48999) return 'PR';
  if (prefix >= 49000 && prefix <= 49999) return 'SE';
  if (prefix >= 50000 && prefix <= 56999) return 'PE';
  if (prefix >= 57000 && prefix <= 57999) return 'AL';
  if (prefix >= 58000 && prefix <= 58999) return 'PB';
  if (prefix >= 59000 && prefix <= 59999) return 'RN';
  if (prefix >= 60000 && prefix <= 63999) return 'CE';
  if (prefix >= 64000 && prefix <= 64999) return 'PI';
  if (prefix >= 65000 && prefix <= 65999) return 'MA';
  if (prefix >= 66000 && prefix <= 67999) return 'PA';
  if (prefix >= 68000 && prefix <= 68999) return 'AP';
  if (prefix >= 69000 && prefix <= 69999) return 'AM'; 
  if (prefix >= 70000 && prefix <= 76999) return 'DF'; 
  if (prefix >= 77000 && prefix <= 79999) return 'BA'; 
  if (prefix >= 80000 && prefix <= 87999) return 'PR';
  if (prefix >= 88000 && prefix <= 89999) return 'SC';
  if (prefix >= 90000 && prefix <= 99999) return 'RS';

  return 'BR';
};

interface VolunteerData {
  id: string;
  candidaturaId: number;
  estudoId: number;
  location: string;
  age: number;
  sex: string;
  gender: string;
  education: string;
  description: string;
  studyApplied: string;
  voluntarioIdReal: number;
  nomeFicticio: string;
  status: string;
}

// --- Dados dos filtros ---
const regions = [
  { label: 'Acre', value: 'AC' }, { label: 'Alagoas', value: 'AL' }, { label: 'Amapá', value: 'AP' },
  { label: 'Amazonas', value: 'AM' }, { label: 'Bahia', value: 'BA' }, { label: 'Ceará', value: 'CE' },
  { label: 'Distrito Federal', value: 'DF' }, { label: 'Espírito Santo', value: 'ES' }, { label: 'Goiás', value: 'GO' },
  { label: 'Maranhão', value: 'MA' }, { label: 'Mato Grosso', value: 'MT' }, { label: 'Mato Grosso do Sul', value: 'MS' },
  { label: 'Minas Gerais', value: 'MG' }, { label: 'Pará', value: 'PA' }, { label: 'Paraíba', value: 'PB' },
  { label: 'Paraná', value: 'PR' }, { label: 'Pernambuco', value: 'PE' }, { label: 'Piauí', value: 'PI' },
  { label: 'Rio de Janeiro', value: 'RJ' }, { label: 'Rio Grande do Norte', value: 'RN' }, { label: 'Rio Grande do Sul', value: 'RS' },
  { label: 'Rondônia', value: 'RO' }, { label: 'Roraima', value: 'RR' }, { label: 'Santa Catarina', value: 'SC' },
  { label: 'São Paulo', value: 'SP' }, { label: 'Sergipe', value: 'SE' }, { label: 'Tocantins', value: 'TO' },
];

const sexes = [
  { label: 'Masculino', value: 'MASCULINO' },
  { label: 'Feminino', value: 'FEMININO' },
];

const genders = [
  { label: 'Cisgênero', value: 'CISGENERO' },
  { label: 'Transgênero', value: 'TRANSGENERO' },
  { label: 'Não-binário', value: 'NAO_BINARIO' },
  { label: 'Outro', value: 'OUTRO' },
  { label: 'Prefere não responder', value: 'NAO_INFORMADO' },
];

const educationLevels = [
  { label: 'Sem instrução formal', value: 'SEM_INSTRUCAO' },
  { label: 'Ensino fundamental incompleto', value: 'FUNDAMENTAL_INCOMPLETO' },
  { label: 'Ensino fundamental completo', value: 'FUNDAMENTAL_COMPLETO' },
  { label: 'Ensino médio incompleto', value: 'MEDIO_INCOMPLETO' },
  { label: 'Ensino médio completo', value: 'MEDIO_COMPLETO' },
  { label: 'Ensino superior incompleto', value: 'SUPERIOR_INCOMPLETO' },
  { label: 'Ensino superior completo', value: 'SUPERIOR_COMPLETO' },
  { label: 'Pós-graduação', value: 'POS_GRADUACAO' },
];

type TabOption = 'candidates' | 'approved';

export default function ResearcherCandidates() {
  const router = useRouter();
  const { user } = useAuth();

  const [allVolunteers, setAllVolunteers] = useState<VolunteerData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<TabOption>('candidates');
  const [isExporting, setIsExporting] = useState(false);

  // NOVO ESTADO: Controle para ocultar recusados
  const [hideRefused, setHideRefused] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedSex, setSelectedSex] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<string | null>(null);
  
  const [filtersVisible, setFiltersVisible] = useState(false);

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

      const formattedData: VolunteerData[] = data.map((item: any) => {
        const uf = convertCepToState(item.localizacao);
        return {
            id: item.nomeFicticio || `CAND-${item.candidaturaId}`,
            nomeFicticio: item.nomeFicticio || item.voluntarioNome || `Candidato ${item.voluntarioId || ''}`,
            candidaturaId: item.candidaturaId,
            estudoId: item.estudoId,
            location: uf, 
            age: item.idade || 0,
            sex: item.sexo || 'Não informado',
            gender: 'Não informado', 
            education: 'Não informado', 
            description: item.descricao || `Interesse em ${item.estudoTitulo}`,
            studyApplied: item.estudoTitulo,
            voluntarioIdReal: item.voluntarioIdReal || item.voluntarioId,
            status: item.status
        };
      }).reverse(); // <--- INVERTE A ORDEM AQUI (Novos primeiro)

      setAllVolunteers(formattedData);
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
    return allVolunteers.filter(volunteer => {
      
      // Lógica das Abas
      if (activeTab === 'candidates') {
        // Exclui os concluídos
        if (volunteer.status === 'CONCLUIDO') return false; 
        
        // NOVO: Se o botão "Ocultar Recusados" estiver ativo e o status for RECUSADO, remove da lista
        if (hideRefused && volunteer.status === 'RECUSADO') return false;

      } else {
        // Aba Em Andamento: Apenas concluídos
        if (volunteer.status !== 'CONCLUIDO') return false;
      }

      // Filtros Padrão
      return (
        (!selectedRegion || volunteer.location === selectedRegion) && 
        (!selectedSex || volunteer.sex === selectedSex) &&
        (!selectedGender || volunteer.gender === selectedGender) &&
        (!selectedEducation || volunteer.education === selectedEducation)
      );
    });
  }, [allVolunteers, activeTab, selectedRegion, selectedSex, selectedGender, selectedEducation, hideRefused]); // Adicionado hideRefused

  const handleExport = async () => {
    if (filteredVolunteers.length === 0) {
      Alert.alert("Atenção", "Nenhum candidato encontrado na lista atual para exportar.");
      return;
    }

    setIsExporting(true);

    try {
      const dataForSheet = [
          ["Nome Fictício", "Estudo Aplicado", "Status", "Localização (UF)", "Sexo", "Respostas Completas"]
      ];

      for (const volunteer of filteredVolunteers) {
        let answersString = "";
        try {
            const answers = await apiService.resposta.getByVoluntario(volunteer.voluntarioIdReal);
            if (answers && answers.length > 0) {
                answersString = answers.map((a: any) => {
                    const question = a.questaoTexto || `Questão ${a.questaoId}`;
                    const answer = a.conteudo || (a.marcado ? "Sim" : "Não");
                    return `${question}: ${answer}`;
                }).join("\n");
            } else {
                answersString = "Nenhuma resposta registrada.";
            }
        } catch (err) {
            answersString = "Erro ao carregar respostas.";
        }

        dataForSheet.push([
            volunteer.nomeFicticio,
            volunteer.studyApplied,
            volunteer.status,
            volunteer.location,
            volunteer.sex,
            answersString
        ]);
      }

      const ws = XLSX.utils.aoa_to_sheet(dataForSheet);
      ws['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 100 }];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Candidatos");

      const base64 = XLSX.write(wb, { type: "base64" });
      const filename = FileSystem.cacheDirectory + `candidatos_${activeTab}.xlsx`;
      
      await FileSystem.writeAsStringAsync(filename, base64, { encoding: FileSystem.EncodingType.Base64 });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Erro", "O compartilhamento não está disponível.");
        return;
      }
      await Sharing.shareAsync(filename);

    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Ocorreu um erro ao gerar o arquivo.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCardPress = (volunteer: VolunteerData) => {
    if (activeTab === 'candidates') {
        if (volunteer.status === 'PENDENTE') {
            router.push({
                pathname: "/(protected)/researcher/volunteer-details/[id]",
                params: { 
                  id: volunteer.candidaturaId,
                  voluntarioId: volunteer.voluntarioIdReal,
                  nomeFicticio: volunteer.nomeFicticio
                 }, 
            });
        } else if (volunteer.status === 'ACEITO_PELO_PESQUISADOR') {
            Alert.alert("Aguardando", "Você já aprovou este candidato. Aguarde o voluntário aceitar o convite para iniciar o chat.");
        } else if (volunteer.status === 'RECUSADO') {
            Alert.alert("Recusado", "Esta candidatura foi recusada.");
        }
    } else {
        console.log("EstudoId:", volunteer.estudoId);
        router.push({
              pathname: "/(protected)/chat/[id]", 
              params: {
                id: volunteer.estudoId,
                pesquisadorId: user?.perfilId
              },
        });
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
        <Text style={styles.title}>Gerenciar Candidatos</Text>
        
        <TouchableOpacity 
            style={[styles.exportButton, isExporting && { opacity: 0.7 }]} 
            onPress={handleExport}
            disabled={isExporting}
        >
            {isExporting ? <ActivityIndicator size="small" color="#15715A" /> : <Ionicons name="download-outline" size={18} color="#15715A" />}
            <Text style={styles.exportButtonText}>Exportar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'candidates' && styles.activeTabButton]}
            onPress={() => setActiveTab('candidates')}
        >
            <Text style={[styles.tabText, activeTab === 'candidates' && styles.activeTabText]}>
                Candidatos
            </Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'approved' && styles.activeTabButton]}
            onPress={() => setActiveTab('approved')}
        >
            <Text style={[styles.tabText, activeTab === 'approved' && styles.activeTabText]}>
                Em Andamento
            </Text>
        </TouchableOpacity>
      </View>

      {/* NOVO BOTÃO: Ocultar Recusados (Apenas na aba Candidatos) */}
      {activeTab === 'candidates' && (
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={styles.toggleButton} 
            onPress={() => setHideRefused(!hideRefused)}
          >
            <Ionicons 
                name={hideRefused ? "eye" : "eye-off"} 
                size={16} 
                color="#6c757d" 
                style={{ marginRight: 6 }}
            />
            <Text style={styles.toggleButtonText}>
                {hideRefused ? "Mostrar Recusados" : "Ocultar Recusados"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
                <Text style={styles.mainFilterTitle}>Filtrar {activeTab === 'candidates' ? 'Candidatos' : 'Ativos'}</Text>
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
                <FilterPicker label="Região (UF)" value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as string | null)} items={regions} placeholder={{ label: "Todas as regiões", value: null }} />
            </View>
            <View style={styles.inputSpacing}>
                <FilterPicker label="Sexo Biológico" value={selectedSex} onValueChange={(value) => setSelectedSex(value as string | null)} items={sexes} placeholder={{ label: "Todos os sexos", value: null }} />
            </View>
            <View style={styles.inputSpacing}>
                <FilterPicker label="Identidade de Gênero" value={selectedGender} onValueChange={(value) => setSelectedGender(value as string | null)} items={genders} placeholder={{ label: "Todos os gêneros", value: null }} />
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
            status={volunteer.status}
            onAnalyze={() => handleCardPress(volunteer)}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
            <Ionicons name={activeTab === 'candidates' ? "people-outline" : "chatbubbles-outline"} size={48} color="#ccc" />
            <Text style={styles.noResultsText}>
                {activeTab === 'candidates' 
                    ? "Nenhum candidato pendente." 
                    : "Nenhum estudo ativo no momento."}
            </Text>
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
      fontSize: 24,
      fontWeight: 'bold',
      color: '#212529',
    },
    exportButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#E0F2F1',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
    },
    exportButtonText: {
      marginLeft: 6,
      fontSize: 14,
      fontWeight: '600',
      color: '#15715A',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 4,
        marginBottom: 10, // Reduzi um pouco para caber o novo botão
        borderWidth: 1,
        borderColor: '#eee',
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTabButton: {
        backgroundColor: '#E0F2F1', 
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6c757d',
    },
    activeTabText: {
        color: '#15715A',
        fontWeight: 'bold',
    },
    
    // Estilos do Botão Ocultar
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    toggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    toggleButtonText: {
        fontSize: 13,
        color: '#6c757d',
        fontWeight: '500',
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