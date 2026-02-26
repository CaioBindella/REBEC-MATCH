package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Candidatura.CandidatoDetalhadoDTO;
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

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidaturaService {

    private final CandidaturaRepository candidatureRepository;
    private final VoluntarioRepository voluntarioRepository;
    private final EstudoRepository estudoRepository;
    private final MatchResultRepository matchResultRepository;
    private final NotificacaoService notificacaoService;

    // Voluntário se candidata
    public Candidatura criarCandidatura(CandidaturaCreateDTO dto) {
        Voluntario voluntario = voluntarioRepository.findByUsuarioId(dto.getVoluntarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Perfil de voluntário não encontrado. Complete seu cadastro antes de se candidatar."));

        // 2. Valida duplicidade usando o ID real do voluntário encontrado
        if (candidatureRepository.existsByVoluntarioIdAndEstudoId(voluntario.getId(), dto.getEstudoId())) {
            throw new BusinessException("Voluntário já se candidatou a este estudo.");
        }
        Estudo estudo = estudoRepository.findById(dto.getEstudoId())
                .orElseThrow(() -> new ResourceNotFoundException("Estudo não encontrado"));

        Candidatura candidatura = new Candidatura();
        candidatura.setVoluntario(voluntario);
        candidatura.setEstudo(estudo);
        candidatura.setStatus(StatusCandidatura.PENDENTE);

        Candidatura candidaturaSalva = candidatureRepository.save(candidatura);

        try {
            // NOTIFICAR PESQUISADOR
            Integer idPesquisador = candidaturaSalva.getEstudo().getPesquisador().getUsuario().getId();
            notificacaoService.criarNotificacao(
                    idPesquisador,
                    "Novo Candidato",
                    "info",
                    "O voluntário " + candidaturaSalva.getVoluntario().getNomeFicticio() + " aplicou para o estudo " + candidaturaSalva.getEstudo().getPublicTitle()

            );

            // NOTIFICAR VOLUNTÁRIO
            notificacaoService.criarNotificacao(
                    candidaturaSalva.getVoluntario().getUsuario().getId(),
                    "Candidatura Enviada",
                    "success",
                    "Sua candidatura para " + candidaturaSalva.getEstudo().getPublicTitle() + " foi enviada com sucesso."

            );
        } catch (Exception e) {
            System.err.println("Erro ao enviar notificação: " + e.getMessage());
        }

        return candidaturaSalva;
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

    public List<CandidatoDetalhadoDTO> listarPorPesquisador(Integer pesquisadorId) {
        List<Candidatura> candidaturas = candidatureRepository.findByPesquisadorId(pesquisadorId);

        return candidaturas.stream().map(c -> {
            CandidatoDetalhadoDTO dto = new CandidatoDetalhadoDTO();
            dto.setCandidaturaId(c.getId());

            Usuario user = c.getVoluntario().getUsuario();

            dto.setVoluntarioId(c.getVoluntario().getNomeFicticio()); // Ou gere o ID composto aqui
            dto.setNomeFicticio(c.getVoluntario().getNomeFicticio());

            // Calcular Idade
            if (user.getDataNascimento() != null) {
                dto.setIdade(Period.between(user.getDataNascimento(), LocalDate.now()).getYears());
            }

            // Sexo
            if (user.getSexo() != null) {
                dto.setSexo(user.getSexo().toString()); // MASCULINO, FEMININO
            }
            dto.setLocalizacao(user.getCep());
            dto.setEstudoId(c.getEstudo().getId());
            dto.setEstudoTitulo(c.getEstudo().getPublicTitle());
            dto.setStatus(c.getStatus().toString());

            // Descrição fictícia ou dados reais se tiver
            dto.setDescricao("Candidato interessado no estudo " + c.getEstudo().getScientificTitle());

            dto.setVoluntarioIdReal(c.getVoluntario().getUsuario().getId());

            return dto;
        }).collect(Collectors.toList());
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