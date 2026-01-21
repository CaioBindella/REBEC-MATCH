package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Candidatura.CandidaturaCreateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.*;
import com.rebecmatchapi.rebecmatch_api.entity.enums.StatusCandidatura;
import com.rebecmatchapi.rebecmatch_api.exception.BusinessException;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.CandidaturaRepository;
import com.rebecmatchapi.rebecmatch_api.repository.EstudoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.MatchResultRepository;
import com.rebecmatchapi.rebecmatch_api.repository.VoluntarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidaturaService {

    private final CandidaturaRepository candidatureRepository;
    private final VoluntarioRepository voluntarioRepository;
    private final EstudoRepository estudoRepository;
    private final MatchResultRepository matchResultRepository;

    // Voluntário se candidata
    public Candidatura criarCandidatura(CandidaturaCreateDTO dto) {
        if (candidatureRepository.existsByVoluntarioIdAndEstudoId(dto.getVoluntarioId(), dto.getEstudoId())) {
            throw new BusinessException("Voluntário já se candidatou a este estudo.");
        }

        Voluntario voluntario = voluntarioRepository.findById(dto.getVoluntarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Voluntário não encontrado"));
        Estudo estudo = estudoRepository.findById(dto.getEstudoId())
                .orElseThrow(() -> new ResourceNotFoundException("Estudo não encontrado"));

        Candidatura candidatura = new Candidatura();
        candidatura.setVoluntario(voluntario);
        candidatura.setEstudo(estudo);
        candidatura.setStatus(StatusCandidatura.PENDENTE); // Começa como Pendente

        return candidatureRepository.save(candidatura);
    }

    // Pesquisador aprova (ou recusa)
    public Candidatura processarPeloPesquisador(Integer id, boolean aprovado) {
        Candidatura candidatura = candidatureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidatura não encontrada"));

        if (candidatura.getStatus() != StatusCandidatura.PENDENTE) {
            throw new BusinessException("Esta candidatura não está pendente de análise.");
        }

        if (aprovado) {
            // Muda para o estado intermediário: Esperando o voluntário confirmar
            candidatura.setStatus(StatusCandidatura.ACEITO_PELO_PESQUISADOR);
        } else {
            candidatura.setStatus(StatusCandidatura.RECUSADO);
        }

        return candidatureRepository.save(candidatura);
    }

    // Voluntário confirma participação (Finaliza e Gera Match)
    @Transactional // Importante para garantir que salva a candidatura e o match juntos
    public Candidatura confirmarPeloVoluntario(Integer id, boolean aceito) {
        Candidatura candidatura = candidatureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidatura não encontrada"));

        // Só pode confirmar se o pesquisador já tiver aceitado
        if (candidatura.getStatus() != StatusCandidatura.ACEITO_PELO_PESQUISADOR) {
            throw new BusinessException("Esta candidatura não está aguardando confirmação do voluntário.");
        }

        if (aceito) {
            candidatura.setStatus(StatusCandidatura.CONCLUIDO);
            candidatureRepository.save(candidatura);

            gerarMatchResult(candidatura);

        } else {
            candidatura.setStatus(StatusCandidatura.RECUSADO);
            candidatureRepository.save(candidatura);
        }

        return candidatura;
    }

    private void gerarMatchResult(Candidatura candidatura) {
        MatchResult match = new MatchResult();
        match.setVoluntario(candidatura.getVoluntario());
        match.setEstudo(candidatura.getEstudo());

        // Como foi um match manual via candidatura, a justificativa é automática
        match.setJustificativa("Match confirmado via processo de candidatura manual.");

        // Podemos calcular os critérios ou definir um valor padrão.
        // Como o pesquisador aprovou manualmente, assume-se 100% de interesse.
        match.setCriteriosAtendidos(1);

        matchResultRepository.save(match);
    }

    public List<Candidatura> listarPorEstudo(Integer estudoId) {
        return candidatureRepository.findByEstudoId(estudoId);
    }

    public List<Candidatura> listarPorVoluntario(Integer voluntarioId) {
        return candidatureRepository.findByVoluntarioId(voluntarioId);
    }
}