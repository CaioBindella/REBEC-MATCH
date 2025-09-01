package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Match.*;
import com.rebecmatchapi.rebecmatch_api.entity.*;
import com.rebecmatchapi.rebecmatch_api.repository.EstudoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.RespostaRepository;
import com.rebecmatchapi.rebecmatch_api.repository.VoluntarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final EstudoRepository estudoRepository;
    private final VoluntarioRepository voluntarioRepository;
    private final RespostaRepository respostaRepository;

    /**
     * Coleta e estrutura todos os dados necessários para o processo de match.
     * * um DTO contendo a lista de estudos que estão recrutando e a lista de voluntários com suas respostas.
     */
    public MatchDataDTO gerarDadosParaMatch() {
        List<EstudoParaMatchDTO> estudos = getEstudosParaMatch();
        List<VoluntarioParaMatchDTO> voluntarios = getVoluntariosParaMatch();

        return new MatchDataDTO(estudos, voluntarios);
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

    // --- MÉTODOS DE MAPEAMENTO PARA DTOs ---
    private EstudoParaMatchDTO toEstudoParaMatchDTO(Estudo estudo) {
        EstudoParaMatchDTO dto = new EstudoParaMatchDTO();
        dto.setId(estudo.getId());
        dto.setPublicTitle(estudo.getPublicTitle());
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
}
