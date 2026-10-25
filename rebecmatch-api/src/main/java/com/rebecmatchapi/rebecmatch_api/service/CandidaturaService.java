package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Candidatura.CandidatoDetalhadoDTO;
import com.rebecmatchapi.rebecmatch_api.entity.*;
import com.rebecmatchapi.rebecmatch_api.entity.enums.StatusCandidatura;
import com.rebecmatchapi.rebecmatch_api.entity.enums.StatusRecrutamento;
import com.rebecmatchapi.rebecmatch_api.exception.BusinessException;
import com.rebecmatchapi.rebecmatch_api.exception.ForbiddenException;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.CandidaturaRepository;
import com.rebecmatchapi.rebecmatch_api.repository.EstudoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.RespostaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

/**
 * Fluxo de candidatura modelado como máquina de estados com confirmação em duas etapas:
 * <pre>
 * PENDENTE --(pesquisador aprova)--> ACEITO_PELO_PESQUISADOR --(voluntário confirma)--> CONCLUIDO (+ MatchResult)
 *    |                                        |
 *    +--(pesquisador recusa)--> RECUSADO <----+--(voluntário recusa)
 * </pre>
 * Cada transição dispara notificações às partes envolvidas.
 */
@Service
@RequiredArgsConstructor
public class CandidaturaService {

    private final CandidaturaRepository candidaturaRepository;
    private final EstudoRepository estudoRepository;
    private final RespostaRepository respostaRepository;
    private final MatchService matchService;
    private final NotificacaoService notificacaoService;
    private final AcessoService acessoService;

    // Voluntário se candidata
    @Transactional
    public Candidatura criarCandidatura(Integer estudoId, Usuario usuario) {
        Voluntario voluntario = acessoService.voluntarioDo(usuario);

        if (!respostaRepository.existsByVoluntarioIdAndQuestaoFormularioId(voluntario.getId(), Formulario.ID_FORMULARIO_PERFIL)) {
            throw new BusinessException("Preencha o formulário de perfil antes de se candidatar a um estudo.");
        }

        Estudo estudo = estudoRepository.findById(estudoId)
                .orElseThrow(() -> new ResourceNotFoundException("Estudo não encontrado."));

        if (!StatusRecrutamento.RECRUTANDO.getRotulo().equalsIgnoreCase(estudo.getRecruitmentStatus())) {
            throw new BusinessException("Este estudo não está recrutando voluntários no momento.");
        }
        if (candidaturaRepository.existsByVoluntarioIdAndEstudoId(voluntario.getId(), estudo.getId())) {
            throw new BusinessException("Voluntário já se candidatou a este estudo.");
        }

        Candidatura candidatura = new Candidatura();
        candidatura.setVoluntario(voluntario);
        candidatura.setEstudo(estudo);
        candidatura.setStatus(StatusCandidatura.PENDENTE);
        Candidatura salva = candidaturaRepository.save(candidatura);

        notificacaoService.notificar(usuarioDoPesquisador(estudo), "Novo Candidato", NotificacaoService.TIPO_INFO,
                "O voluntário " + voluntario.getNomeFicticio() + " se candidatou ao estudo " + estudo.getPublicTitle() + ".");
        notificacaoService.notificar(usuario.getId(), "Candidatura Enviada", NotificacaoService.TIPO_SUCESSO,
                "Sua candidatura para " + estudo.getPublicTitle() + " foi enviada com sucesso.");

        return salva;
    }

    // Pesquisador aprova (ou recusa) a candidatura inicial
    @Transactional
    public Candidatura processarPeloPesquisador(Integer id, boolean aprovado, Usuario usuario) {
        Candidatura candidatura = buscar(id);
        acessoService.exigirDonoDoEstudo(usuario, candidatura.getEstudo());

        if (candidatura.getStatus() != StatusCandidatura.PENDENTE) {
            throw new BusinessException("Esta candidatura não está pendente de análise.");
        }

        Integer usuarioVoluntario = candidatura.getVoluntario().getUsuario().getId();
        String titulo = candidatura.getEstudo().getPublicTitle();
        if (aprovado) {
            // Estado intermediário: aguarda a confirmação do voluntário
            candidatura.setStatus(StatusCandidatura.ACEITO_PELO_PESQUISADOR);
            notificacaoService.notificar(usuarioVoluntario, "Candidatura Aprovada", NotificacaoService.TIPO_SUCESSO,
                    "O pesquisador aprovou sua candidatura ao estudo " + titulo + ". Confirme sua participação em Meus Estudos.");
        } else {
            candidatura.setStatus(StatusCandidatura.RECUSADO);
            notificacaoService.notificar(usuarioVoluntario, "Candidatura Não Aprovada", NotificacaoService.TIPO_INFO,
                    "Sua candidatura ao estudo " + titulo + " não foi aprovada pelo pesquisador.");
        }
        return candidaturaRepository.save(candidatura);
    }

    // Voluntário confirma participação (finaliza e gera o match)
    @Transactional // candidatura e match são gravados juntos
    public Candidatura confirmarPeloVoluntario(Integer id, boolean aceito, Usuario usuario) {
        Candidatura candidatura = buscar(id);
        Voluntario voluntario = acessoService.voluntarioDo(usuario);
        if (!candidatura.getVoluntario().getId().equals(voluntario.getId())) {
            throw new ForbiddenException("Você só pode responder às suas próprias candidaturas.");
        }

        // Só pode confirmar se o pesquisador já tiver aceitado
        if (candidatura.getStatus() != StatusCandidatura.ACEITO_PELO_PESQUISADOR) {
            throw new BusinessException("Esta candidatura não está aguardando confirmação do voluntário.");
        }

        Integer usuarioPesquisador = usuarioDoPesquisador(candidatura.getEstudo());
        String titulo = candidatura.getEstudo().getPublicTitle();
        if (aceito) {
            candidatura.setStatus(StatusCandidatura.CONCLUIDO);
            candidaturaRepository.save(candidatura);
            matchService.registrarMatch(candidatura);
            notificacaoService.notificar(usuarioPesquisador, "Participação Confirmada", NotificacaoService.TIPO_SUCESSO,
                    "O voluntário " + voluntario.getNomeFicticio() + " confirmou participação no estudo " + titulo
                            + ". O chat entre vocês está liberado.");
            notificacaoService.notificar(usuario.getId(), "Match Confirmado", NotificacaoService.TIPO_SUCESSO,
                    "Sua participação no estudo " + titulo + " foi confirmada. O chat com o pesquisador está liberado.");
        } else {
            candidatura.setStatus(StatusCandidatura.RECUSADO);
            candidaturaRepository.save(candidatura);
            notificacaoService.notificar(usuarioPesquisador, "Convite Recusado", NotificacaoService.TIPO_INFO,
                    "O voluntário " + voluntario.getNomeFicticio() + " recusou a participação no estudo " + titulo + ".");
        }
        return candidatura;
    }

    @Transactional(readOnly = true)
    public List<CandidatoDetalhadoDTO> listarPorPesquisador(Integer pesquisadorId, Usuario usuario) {
        Pesquisador pesquisador = acessoService.pesquisadorDo(usuario);
        if (!pesquisador.getId().equals(pesquisadorId)) {
            throw new ForbiddenException("Você só pode consultar candidatos dos seus próprios estudos.");
        }
        return candidaturaRepository.findByPesquisadorId(pesquisadorId).stream()
                .map(this::toCandidatoDetalhado)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Candidatura> listarPorEstudo(Integer estudoId, Usuario usuario) {
        Estudo estudo = estudoRepository.findById(estudoId)
                .orElseThrow(() -> new ResourceNotFoundException("Estudo não encontrado."));
        acessoService.exigirDonoDoEstudo(usuario, estudo);
        return candidaturaRepository.findByEstudoId(estudoId);
    }

    @Transactional(readOnly = true)
    public List<Candidatura> listarPorVoluntario(Integer voluntarioId, Usuario usuario) {
        Voluntario voluntario = acessoService.voluntarioDo(usuario);
        if (!voluntario.getId().equals(voluntarioId)) {
            throw new ForbiddenException("Você só pode consultar as suas próprias candidaturas.");
        }
        return candidaturaRepository.findByVoluntarioId(voluntarioId);
    }

    /**
     * Dados pseudonimizados do candidato: nome fictício, idade, sexo e os cinco primeiros dígitos do CEP.
     */
    private CandidatoDetalhadoDTO toCandidatoDetalhado(Candidatura c) {
        Usuario user = c.getVoluntario().getUsuario();
        CandidatoDetalhadoDTO dto = new CandidatoDetalhadoDTO();
        dto.setCandidaturaId(c.getId());
        dto.setVoluntarioId(c.getVoluntario().getId());
        dto.setVoluntarioUsuarioId(user.getId());
        dto.setNomeFicticio(c.getVoluntario().getNomeFicticio());
        if (user.getDataNascimento() != null) {
            dto.setIdade(Period.between(user.getDataNascimento(), LocalDate.now()).getYears());
        }
        if (user.getSexo() != null) {
            dto.setSexo(user.getSexo().name());
        }
        if (user.getCep() != null) {
            dto.setLocalizacao(user.getCep().length() >= 5 ? user.getCep().substring(0, 5) : user.getCep());
        }
        dto.setEstudoId(c.getEstudo().getId());
        dto.setEstudoTitulo(c.getEstudo().getPublicTitle());
        dto.setStatus(c.getStatus());
        return dto;
    }

    private Candidatura buscar(Integer id) {
        return candidaturaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidatura não encontrada."));
    }

    private Integer usuarioDoPesquisador(Estudo estudo) {
        return estudo.getPesquisador().getUsuario().getId();
    }
}
