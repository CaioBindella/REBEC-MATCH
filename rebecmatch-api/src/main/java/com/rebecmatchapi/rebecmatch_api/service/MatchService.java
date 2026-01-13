package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Match.*;
import com.rebecmatchapi.rebecmatch_api.entity.*;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.EstudoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.MatchResultRepository;
import com.rebecmatchapi.rebecmatch_api.repository.RespostaRepository;
import com.rebecmatchapi.rebecmatch_api.repository.VoluntarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final EstudoRepository estudoRepository;
    private final VoluntarioRepository voluntarioRepository;
    private final RespostaRepository respostaRepository;
    private final MatchResultRepository matchResultRepository;
    @Transactional
    public MatchResult saveMatchResult(MatchResultCreateDTO dto) {
        Voluntario voluntario = voluntarioRepository.findById(dto.getVoluntarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Voluntário com ID " + dto.getVoluntarioId() + " não encontrado."));

        Estudo estudo = estudoRepository.findById(dto.getEstudoId())
                .orElseThrow(() -> new ResourceNotFoundException("Estudo com ID " + dto.getEstudoId() + " não encontrado."));

        MatchResult newMatch = new MatchResult();
        newMatch.setVoluntario(voluntario);
        newMatch.setEstudo(estudo);
        newMatch.setCriteriosAtendidos(dto.getCriteriosAtendidos());
        newMatch.setJustificativa(dto.getJustificativa());

        return matchResultRepository.save(newMatch);
    }


    public MatchDataDTO gerarDadosParaMatch() {
        List<EstudoParaMatchDTO> estudos = getEstudosParaMatch();
        List<VoluntarioParaMatchDTO> voluntarios = getVoluntariosParaMatch();

        return new MatchDataDTO(estudos, voluntarios);
    }


    public List<MatchResult> getAllMatchResults() {
        return matchResultRepository.findAll();
    }

    public MatchResult getMatchResultById(Integer id) {
        return matchResultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match com ID " + id + " não encontrado."));
    }

    private List<EstudoParaMatchDTO> getEstudosParaMatch() {
        // Supondo que "recrutando" é um status válido. Ajuste se necessário.
        List<Estudo> estudosAtivos = estudoRepository.findByRecruitmentStatus("Recruiting");

        return estudosAtivos.stream()
                .map(this::toEstudoParaMatchDTO)
                .collect(Collectors.toList());
    }

    private List<VoluntarioParaMatchDTO> getVoluntariosParaMatch() {
        List<Voluntario> todosVoluntarios = voluntarioRepository.findAll();

        return todosVoluntarios.stream()
                .map(this::toVoluntarioParaMatchDTO)
                .collect(Collectors.toList());
    }

    private EstudoParaMatchDTO toEstudoParaMatchDTO(Estudo estudo) {
        EstudoParaMatchDTO dto = new EstudoParaMatchDTO();
        dto.setId(estudo.getId());
        dto.setScientificTitle(estudo.getScientificTitle());

        List<CriterioParaMatchDTO> criterios = estudo.getCriterios().stream()
                .map(this::toCriterioParaMatchDTO)
                .collect(Collectors.toList());
        dto.setCriterios(criterios);

        return dto;
    }

    private CriterioParaMatchDTO toCriterioParaMatchDTO(Criterio criterio) {
        CriterioParaMatchDTO dto = new CriterioParaMatchDTO();
        dto.setInclusionCriteria(criterio.getInclusionCriteria());
        dto.setExclusionCriteria(criterio.getExclusionCriteria());
        dto.setAgeMin(criterio.getAgeMin());
        dto.setAgeMax(criterio.getAgeMax());
        dto.setGender(criterio.getGender());
        return dto;
    }

    private VoluntarioParaMatchDTO toVoluntarioParaMatchDTO(Voluntario voluntario) {
        VoluntarioParaMatchDTO dto = new VoluntarioParaMatchDTO();
        dto.setId(voluntario.getId());
        dto.setNomeFicticio(voluntario.getNomeFicticio());
        // Mapear informações do usuário se necessário, ex:
        // dto.setDataNascimento(voluntario.getUsuario().getDataNascimento());
        // dto.setSexo(voluntario.getUsuario().getSexo().toString());

        List<Resposta> respostasDoVoluntario = respostaRepository.findByVoluntarioId(voluntario.getId());
        List<RespostaParaMatchDTO> respostasDTO = respostasDoVoluntario.stream()
                .map(this::toRespostaParaMatchDTO)
                .collect(Collectors.toList());
        dto.setRespostas(respostasDTO);

        return dto;
    }

    private RespostaParaMatchDTO toRespostaParaMatchDTO(Resposta resposta) {
        RespostaParaMatchDTO dto = new RespostaParaMatchDTO();
        dto.setConteudo(resposta.getConteudo());
        dto.setQuestao(toQuestaoParaMatchDTO(resposta.getQuestao()));
        return dto;
    }

    private QuestaoParaMatchDTO toQuestaoParaMatchDTO(Questao questao) {
        QuestaoParaMatchDTO dto = new QuestaoParaMatchDTO();
        dto.setId(questao.getId());
        dto.setTexto(questao.getTexto());
        return dto;
    }

    public MatchDataDTO generateGlobalFilteredMatchData() {
        // Busca todos os voluntários e todos os estudos ativos
        List<Voluntario> todosVoluntarios = voluntarioRepository.findAll();
        List<Estudo> todosEstudosAtivos = estudoRepository.findByRecruitmentStatus("Recruiting");

        // Usamos Sets para garantir que cada voluntário e estudo apareça apenas uma vez na lista final
        Set<Voluntario> voluntariosAptos = new HashSet<>();
        Set<Estudo> estudosAptos = new HashSet<>();

        // Itera por cada voluntário para testá-lo contra todos os estudos
        for (Voluntario voluntario : todosVoluntarios) {
            Usuario usuario = voluntario.getUsuario();
            // Pula voluntários sem dados de usuário, pois não podemos filtrar
            if (usuario == null || usuario.getDataNascimento() == null || usuario.getSexo() == null) {
                continue;
            }

            long idadeVoluntarioEmMeses = ChronoUnit.MONTHS.between(usuario.getDataNascimento(), LocalDate.now());
            String sexoVoluntario = usuario.getSexo().toString();

            // Itera pelos estudos para encontrar compatibilidade
            for (Estudo estudo : todosEstudosAtivos) {
                if (atendeAosCriterios(estudo, idadeVoluntarioEmMeses, sexoVoluntario)) {
                    // Se encontrou um match, adiciona ambos aos seus respectivos sets
                    voluntariosAptos.add(voluntario);
                    estudosAptos.add(estudo);
                }
            }
        }

        // Converte os Sets de entidades para Listas de DTOs
        List<VoluntarioParaMatchDTO> voluntariosDto = voluntariosAptos.stream()
                .map(this::toVoluntarioParaMatchDTO)
                .collect(Collectors.toList());

        List<EstudoParaMatchDTO> estudosDto = estudosAptos.stream()
                .map(this::toEstudoParaMatchDTO)
                .collect(Collectors.toList());

        // Retorna o DTO final com os dados filtrados
        return new MatchDataDTO(estudosDto, voluntariosDto);
    }

    private boolean atendeAosCriterios(Estudo estudo, long idadeVoluntarioEmMeses, String sexoVoluntario) {
        // Se um estudo não tiver critérios, consideramos como não compatível para evitar matches vazios.
        if (estudo.getCriterios() == null || estudo.getCriterios().isEmpty()) {
            return false;
        }

        // Um estudo é compatível se QUALQUER UM de seus critérios for compatível.
        return estudo.getCriterios().stream().anyMatch(criterio -> {
            // Converte as idades min e max do critério para meses.
            // Se a string for vazia, o método parse retornará um valor que representa "sem limite".
            long idadeMinEmMeses = parseAgeToMonths(criterio.getAgeMin(), true); // true para limite inferior
            long idadeMaxEmMeses = parseAgeToMonths(criterio.getAgeMax(), false); // false para limite superior

            // Verifica a compatibilidade de idade
            boolean idadeCompativel = idadeVoluntarioEmMeses >= idadeMinEmMeses && idadeVoluntarioEmMeses <= idadeMaxEmMeses;

            // Verifica a compatibilidade de gênero (aceita M, F ou "-")
            boolean generoCompativel = criterio.getGender().equals(sexoVoluntario) || criterio.getGender().equals("-");

            return idadeCompativel && generoCompativel;
        });
    }

    /**
     * Converte uma string de idade (ex: "18Y", "3M", "") para o total de meses.
     *
     * @param ageString A string de idade do critério.
     * @param isMin Se true, trata a string vazia como 0 (sem limite mínimo). Se false, trata como Long.MAX_VALUE (sem limite máximo).
     * @return O número total de meses como um long.
     */
    private long parseAgeToMonths(String ageString, boolean isMin) {
        // Se a string for nula ou vazia, aplicamos a lógica de "sem limite"
        if (ageString == null || ageString.isBlank()) {
            return isMin ? 0 : Long.MAX_VALUE;
        }

        String upperCaseAge = ageString.trim().toUpperCase();

        try {
            if (upperCaseAge.endsWith("M")) {
                return Long.parseLong(upperCaseAge.substring(0, upperCaseAge.length() - 1));
            } else if (upperCaseAge.endsWith("Y")) {
                long years = Long.parseLong(upperCaseAge.substring(0, upperCaseAge.length() - 1));
                return years * 12;
            }
        } catch (NumberFormatException e) {
            System.err.println("Formato de idade inválido: " + ageString);
            // Em caso de erro de formato, retornamos um valor que provavelmente fará a verificação falhar
            return -1;
        }

        // Retorna -1 se o formato não tiver M ou Y para evitar matches incorretos
        return -1;
    }
}