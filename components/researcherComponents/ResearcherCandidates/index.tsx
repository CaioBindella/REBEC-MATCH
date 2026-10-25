import React, { useState, useMemo, useCallback } from 'react';
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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';

import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import VolunteerCard from '@/components/volunteerComponents/VolunteerCard';
import FilterPicker from '@/components/reusable/FilterPicker';

import { apiService, getErrorMessage, ID_FORMULARIO_PERFIL } from '@/services/api/apiClient';
import { useAuth } from '@/context/AuthContext';
import { CandidatoDetalhadoDTO, RespostaResponseDTO } from '@/types/types';
import { cepParaUf, parseOpcoes, sexoLabel, UFS } from '@/utils/formatters';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Questões do formulário de perfil (migração V8) usadas como filtros de candidatos
const ID_QUESTAO_IDENTIDADE_GENERO = 4;
const ID_QUESTAO_ESCOLARIDADE = 7;

interface VolunteerData extends CandidatoDetalhadoDTO {
  uf: string;
  identidadeGenero: string | null;
  escolaridade: string | null;
}

const sexes = [
  { label: 'Masculino', value: 'MASCULINO' },
  { label: 'Feminino', value: 'FEMININO' },
  { label: 'Outro', value: 'OUTRO' },
];

type TabOption = 'candidates' | 'approved';

const respostaDe = (respostas: RespostaResponseDTO[], questaoId: number) =>
  respostas.find((r) => r.questaoId === questaoId)?.conteudo ?? null;

export default function ResearcherCandidates() {
  const router = useRouter();
  const { user } = useAuth();

  const [allVolunteers, setAllVolunteers] = useState<VolunteerData[]>([]);
  const [respostasPorVoluntario, setRespostasPorVoluntario] = useState<Record<number, RespostaResponseDTO[]>>({});
  const [opcoesGenero, setOpcoesGenero] = useState<string[]>([]);
  const [opcoesEscolaridade, setOpcoesEscolaridade] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<TabOption>('candidates');
  const [isExporting, setIsExporting] = useState(false);
  const [hideRefused, setHideRefused] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedSex, setSelectedSex] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedEducation, setSelectedEducation] = useState<string | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Candidatos (dados pseudonimizados) + respostas do formulário de perfil de cada voluntário,
  // compartilhadas pela API apenas com o pesquisador responsável pelos estudos candidatados
  const fetchCandidates = useCallback(async () => {
    if (!user?.perfilId) return;
    try {
      setLoading(true);
      const [candidatos, questoes] = await Promise.all([
        apiService.candidatura.listarPorPesquisador(user.perfilId),
        apiService.questao.listarPorFormulario(ID_FORMULARIO_PERFIL),
      ]);
      setOpcoesGenero(parseOpcoes(questoes.find((q) => q.id === ID_QUESTAO_IDENTIDADE_GENERO)?.opcoes));
      setOpcoesEscolaridade(parseOpcoes(questoes.find((q) => q.id === ID_QUESTAO_ESCOLARIDADE)?.opcoes));

      const voluntarios = [...new Set(candidatos.map((c) => c.voluntarioId))];
      const respostas = await Promise.all(voluntarios.map((id) => apiService.resposta.getByVoluntario(id)));
      const porVoluntario: Record<number, RespostaResponseDTO[]> = {};
      voluntarios.forEach((id, i) => (porVoluntario[id] = respostas[i]));
      setRespostasPorVoluntario(porVoluntario);

      setAllVolunteers(
        candidatos
          .map((c) => ({
            ...c,
            uf: cepParaUf(c.localizacao),
            identidadeGenero: respostaDe(porVoluntario[c.voluntarioId] ?? [], ID_QUESTAO_IDENTIDADE_GENERO),
            escolaridade: respostaDe(porVoluntario[c.voluntarioId] ?? [], ID_QUESTAO_ESCOLARIDADE),
          }))
          .reverse() // candidaturas mais recentes primeiro
      );
    } catch (error) {
      Alert.alert('Erro', getErrorMessage(error, 'Não foi possível carregar a lista de candidatos.'));
    } finally {
      setLoading(false);
    }
  }, [user?.perfilId]);

  useFocusEffect(
    useCallback(() => {
      fetchCandidates();
    }, [fetchCandidates])
  );

  const toggleFilters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFiltersVisible(!filtersVisible);
  };

  const filteredVolunteers = useMemo(
    () =>
      allVolunteers.filter((volunteer) => {
        if (activeTab === 'candidates') {
          if (volunteer.status === 'CONCLUIDO') return false;
          if (hideRefused && volunteer.status === 'RECUSADO') return false;
        } else if (volunteer.status !== 'CONCLUIDO') {
          return false;
        }
        return (
          (!selectedRegion || volunteer.uf === selectedRegion) &&
          (!selectedSex || volunteer.sexo === selectedSex) &&
          (!selectedGender || volunteer.identidadeGenero === selectedGender) &&
          (!selectedEducation || volunteer.escolaridade === selectedEducation)
        );
      }),
    [allVolunteers, activeTab, selectedRegion, selectedSex, selectedGender, selectedEducation, hideRefused]
  );

  const handleExport = async () => {
    if (filteredVolunteers.length === 0) {
      Alert.alert('Atenção', 'Nenhum candidato encontrado na lista atual para exportar.');
      return;
    }
    setIsExporting(true);
    try {
      const dataForSheet = [
        ['Nome Fictício', 'Estudo', 'Status', 'UF', 'Idade', 'Sexo', 'Respostas do Formulário de Perfil'],
      ];
      for (const volunteer of filteredVolunteers) {
        const answers = respostasPorVoluntario[volunteer.voluntarioId] ?? [];
        dataForSheet.push([
          volunteer.nomeFicticio,
          volunteer.estudoTitulo,
          volunteer.status,
          volunteer.uf,
          volunteer.idade != null ? String(volunteer.idade) : '',
          sexoLabel(volunteer.sexo),
          answers.length > 0
            ? answers.map((a) => `${a.questaoTexto}: ${a.conteudo}`).join('\n')
            : 'Nenhuma resposta registrada.',
        ]);
      }

      const ws = XLSX.utils.aoa_to_sheet(dataForSheet);
      ws['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 22 }, { wch: 6 }, { wch: 8 }, { wch: 14 }, { wch: 100 }];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Candidatos');

      const base64 = XLSX.write(wb, { type: 'base64' });
      const filename = FileSystem.cacheDirectory + `candidatos_${activeTab}.xlsx`;
      await FileSystem.writeAsStringAsync(filename, base64, { encoding: FileSystem.EncodingType.Base64 });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Erro', 'O compartilhamento não está disponível neste dispositivo.');
        return;
      }
      await Sharing.shareAsync(filename);
    } catch {
      Alert.alert('Erro', 'Ocorreu um erro ao gerar o arquivo.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCardPress = (volunteer: VolunteerData) => {
    if (volunteer.status === 'PENDENTE') {
      router.push({
        pathname: '/(protected)/researcher/volunteer-details/[id]',
        params: {
          id: volunteer.candidaturaId,
          voluntarioId: volunteer.voluntarioId,
          nomeFicticio: volunteer.nomeFicticio,
          estudoTitulo: volunteer.estudoTitulo,
          idade: volunteer.idade ?? '',
          sexo: volunteer.sexo ?? '',
          uf: volunteer.uf,
        },
      });
    } else if (volunteer.status === 'ACEITO_PELO_PESQUISADOR') {
      Alert.alert('Aguardando', 'Você já aprovou este candidato. Aguarde o voluntário confirmar a participação para iniciar o chat.');
    } else if (volunteer.status === 'RECUSADO') {
      Alert.alert('Recusado', 'Esta candidatura foi recusada.');
    } else {
      router.push({
        pathname: '/(protected)/chat/[id]',
        params: {
          id: volunteer.estudoId,
          contatoUsuarioId: volunteer.voluntarioUsuarioId,
          nomeContato: volunteer.nomeFicticio,
          tituloEstudo: volunteer.estudoTitulo,
        },
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingTop: 60 }]}>
        <ActivityIndicator size="large" color="#15715A" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Gerenciar Candidatos</Text>
        <TouchableOpacity style={[styles.exportButton, isExporting && { opacity: 0.7 }]} onPress={handleExport} disabled={isExporting}>
          {isExporting ? <ActivityIndicator size="small" color="#15715A" /> : <Ionicons name="download-outline" size={18} color="#15715A" />}
          <Text style={styles.exportButtonText}>Exportar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'candidates' && styles.activeTabButton]} onPress={() => setActiveTab('candidates')}>
          <Text style={[styles.tabText, activeTab === 'candidates' && styles.activeTabText]}>Candidatos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, activeTab === 'approved' && styles.activeTabButton]} onPress={() => setActiveTab('approved')}>
          <Text style={[styles.tabText, activeTab === 'approved' && styles.activeTabText]}>Em Andamento</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'candidates' && (
        <View style={styles.toggleContainer}>
          <TouchableOpacity style={styles.toggleButton} onPress={() => setHideRefused(!hideRefused)}>
            <Ionicons name={hideRefused ? 'eye' : 'eye-off'} size={16} color="#6c757d" style={{ marginRight: 6 }} />
            <Text style={styles.toggleButtonText}>{hideRefused ? 'Mostrar Recusados' : 'Ocultar Recusados'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.filtersWrapper}>
        <TouchableOpacity style={styles.filterHeader} onPress={toggleFilters} activeOpacity={0.7}>
          <View style={styles.filterTitleContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="options" size={20} color="#15715A" />
            </View>
            <Text style={styles.mainFilterTitle}>Filtrar {activeTab === 'candidates' ? 'Candidatos' : 'Ativos'}</Text>
          </View>
          <Ionicons name={filtersVisible ? 'chevron-up' : 'chevron-down'} size={22} color="#6c757d" />
        </TouchableOpacity>

        {filtersVisible && (
          <View style={styles.filterContent}>
            <View style={styles.inputSpacing}>
              <FilterPicker label="Região (UF)" value={selectedRegion} onValueChange={(v) => setSelectedRegion(v as string | null)} items={UFS} placeholder={{ label: 'Todas as regiões', value: null }} />
            </View>
            <View style={styles.inputSpacing}>
              <FilterPicker label="Sexo" value={selectedSex} onValueChange={(v) => setSelectedSex(v as string | null)} items={sexes} placeholder={{ label: 'Todos os sexos', value: null }} />
            </View>
            <View style={styles.inputSpacing}>
              <FilterPicker label="Identidade de Gênero" value={selectedGender} onValueChange={(v) => setSelectedGender(v as string | null)} items={opcoesGenero.map((o) => ({ label: o, value: o }))} placeholder={{ label: 'Todas as identidades', value: null }} />
            </View>
            <View style={styles.inputSpacing}>
              <FilterPicker label="Escolaridade" value={selectedEducation} onValueChange={(v) => setSelectedEducation(v as string | null)} items={opcoesEscolaridade.map((o) => ({ label: o, value: o }))} placeholder={{ label: 'Todos os níveis', value: null }} />
            </View>
          </View>
        )}
      </View>

      {filteredVolunteers.length > 0 ? (
        filteredVolunteers.map((volunteer) => (
          <VolunteerCard
            key={volunteer.candidaturaId}
            id={volunteer.nomeFicticio}
            location={volunteer.uf}
            description={`${volunteer.idade != null ? `${volunteer.idade} anos` : 'Idade não informada'} · ${sexoLabel(volunteer.sexo)}`}
            studyApplied={volunteer.estudoTitulo}
            status={volunteer.status}
            onAnalyze={() => handleCardPress(volunteer)}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name={activeTab === 'candidates' ? 'people-outline' : 'chatbubbles-outline'} size={48} color="#ccc" />
          <Text style={styles.noResultsText}>
            {activeTab === 'candidates' ? 'Nenhum candidato encontrado.' : 'Nenhum voluntário com participação confirmada.'}
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