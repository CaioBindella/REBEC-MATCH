package com.rebecmatchapi.rebecmatch_api.dto;

import com.rebecmatchapi.rebecmatch_api.dto.Candidatura.CandidaturaResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Criterio.CriterioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Doenca.DoencaResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Estudo.EstudoResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Formulario.FormularioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Match.MatchResultResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Notificacao.NotificacaoResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Pesquisador.PesquisadorResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Questao.QuestaoResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostaResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Voluntario.VoluntarioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.entity.*;

import java.util.Comparator;
import java.util.List;

/**
 * Conversões centralizadas entre entidades JPA e DTOs de resposta.
 * <p>
 * Regra de privacidade: dados civis (nome, sobrenome, e-mail, telefone, documento) só aparecem em
 * {@link #toUsuario(Usuario)}, devolvido exclusivamente ao titular da conta. Sempre que um perfil é
 * exibido ao outro lado da plataforma, apenas o nome fictício e identificadores são expostos.
 */
public final class DtoMapper {

    private DtoMapper() {
    }

    public static UsuarioResponseDTO toUsuario(Usuario usuario) {
        if (usuario == null) return null;
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setSobrenome(usuario.getSobrenome());
        dto.setLogin(usuario.getLogin());
        dto.setEmail(usuario.getEmail());
        dto.setTipoEspecifico(usuario.getTipoEspecifico());
        dto.setSexo(usuario.getSexo());
        dto.setTester(usuario.isTester());
        return dto;
    }

    public static PesquisadorResponseDTO toPesquisador(Pesquisador pesquisador) {
        if (pesquisador == null) return null;
        PesquisadorResponseDTO dto = new PesquisadorResponseDTO();
        dto.setId(pesquisador.getId());
        dto.setNomeFicticio(pesquisador.getNomeFicticio());
        if (pesquisador.getUsuario() != null) {
            dto.setUsuarioId(pesquisador.getUsuario().getId());
        }
        return dto;
    }

    public static VoluntarioResponseDTO toVoluntario(Voluntario voluntario) {
        if (voluntario == null) return null;
        VoluntarioResponseDTO dto = new VoluntarioResponseDTO();
        dto.setId(voluntario.getId());
        dto.setNomeFicticio(voluntario.getNomeFicticio());
        dto.setDistancia(voluntario.getDistancia());
        if (voluntario.getUsuario() != null) {
            dto.setUsuarioId(voluntario.getUsuario().getId());
        }
        return dto;
    }

    public static EstudoResponseDTO toEstudo(Estudo estudo) {
        if (estudo == null) return null;
        EstudoResponseDTO dto = new EstudoResponseDTO();
        dto.setId(estudo.getId());
        dto.setPublicTitle(estudo.getPublicTitle());
        dto.setScientificTitle(estudo.getScientificTitle());
        dto.setRecruitmentStatus(estudo.getRecruitmentStatus());
        dto.setStudyType(estudo.getStudyType());
        dto.setPhase(estudo.getPhase());
        dto.setDateRegistration(estudo.getDateRegistration());
        dto.setDateEnrolment(estudo.getDateEnrolment());
        dto.setUrl(estudo.getUrl());
        dto.setPrimarySponsor(estudo.getPrimarySponsor());
        dto.setHcFreetext(estudo.getHcFreetext());
        dto.setIFreetext(estudo.getIFreetext());
        dto.setApprovalDate(estudo.getApprovalDate());
        dto.setSecId(estudo.getSecId());
        dto.setTrialId(estudo.getTrialId());
        if (estudo.getPesquisador() != null) {
            dto.setPesquisadorId(estudo.getPesquisador().getId());
            dto.setPesquisador(toPesquisador(estudo.getPesquisador()));
        }
        dto.setCriterios(estudo.getCriterios() == null ? List.of()
                : estudo.getCriterios().stream().map(DtoMapper::toCriterio).toList());
        dto.setNomesDoencas(estudo.getDoencas() == null ? List.of()
                : estudo.getDoencas().stream()
                .map(Doenca::getNomePopular)
                .sorted(Comparator.nullsLast(Comparator.naturalOrder()))
                .toList());
        return dto;
    }

    public static CriterioResponseDTO toCriterio(Criterio criterio) {
        if (criterio == null) return null;
        CriterioResponseDTO dto = new CriterioResponseDTO();
        dto.setId(criterio.getId());
        dto.setInclusionCriteria(criterio.getInclusionCriteria());
        dto.setAgeMin(criterio.getAgeMin());
        dto.setAgeMax(criterio.getAgeMax());
        dto.setGender(criterio.getGender());
        dto.setExclusionCriteria(criterio.getExclusionCriteria());
        if (criterio.getEstudo() != null) {
            dto.setEstudoId(criterio.getEstudo().getId());
        }
        return dto;
    }

    public static CandidaturaResponseDTO toCandidatura(Candidatura c) {
        CandidaturaResponseDTO dto = new CandidaturaResponseDTO();
        dto.setId(c.getId());
        dto.setVoluntarioId(c.getVoluntario().getId());
        dto.setVoluntarioUsuarioId(c.getVoluntario().getUsuario().getId());
        dto.setVoluntarioNome(c.getVoluntario().getNomeFicticio());
        dto.setEstudoId(c.getEstudo().getId());
        dto.setEstudoTitulo(c.getEstudo().getPublicTitle());
        dto.setStatus(c.getStatus());
        dto.setDataCandidatura(c.getDataCandidatura());
        Pesquisador pesquisador = c.getEstudo().getPesquisador();
        if (pesquisador != null) {
            dto.setPesquisadorId(pesquisador.getId());
            dto.setPesquisadorNomeFicticio(pesquisador.getNomeFicticio());
            dto.setPesquisadorUsuarioId(pesquisador.getUsuario().getId());
        }
        return dto;
    }

    public static MatchResultResponseDTO toMatch(MatchResult matchResult) {
        MatchResultResponseDTO dto = new MatchResultResponseDTO();
        dto.setId(matchResult.getId());
        dto.setCriteriosAtendidos(matchResult.getCriteriosAtendidos());
        dto.setDataMatch(matchResult.getDataMatch());
        dto.setJustificativa(matchResult.getJustificativa());
        if (matchResult.getVoluntario() != null) {
            dto.setVoluntarioId(matchResult.getVoluntario().getId());
            dto.setVoluntarioUsuarioId(matchResult.getVoluntario().getUsuario().getId());
            dto.setVoluntarioNomeFicticio(matchResult.getVoluntario().getNomeFicticio());
        }
        if (matchResult.getEstudo() != null) {
            dto.setEstudoId(matchResult.getEstudo().getId());
            dto.setEstudoPublicTitle(matchResult.getEstudo().getPublicTitle());
            Pesquisador pesquisador = matchResult.getEstudo().getPesquisador();
            if (pesquisador != null) {
                dto.setPesquisadorUsuarioId(pesquisador.getUsuario().getId());
                dto.setPesquisadorNomeFicticio(pesquisador.getNomeFicticio());
            }
        }
        return dto;
    }

    public static NotificacaoResponseDTO toNotificacao(Notificacao n) {
        NotificacaoResponseDTO dto = new NotificacaoResponseDTO();
        dto.setId(n.getId());
        dto.setTitulo(n.getTitulo());
        dto.setMensagem(n.getMensagem());
        dto.setTipo(n.getTipo());
        dto.setLida(n.isLida());
        dto.setDataCriacao(n.getDataCriacao());
        dto.setUsuarioId(n.getUsuario().getId());
        return dto;
    }

    public static RespostaResponseDTO toResposta(Resposta resposta) {
        RespostaResponseDTO dto = new RespostaResponseDTO();
        dto.setId(resposta.getId());
        dto.setConteudo(resposta.getConteudo());
        dto.setMarcado(resposta.isMarcado());
        if (resposta.getVoluntario() != null) {
            dto.setVoluntarioId(resposta.getVoluntario().getId());
        }
        if (resposta.getQuestao() != null) {
            dto.setQuestaoId(resposta.getQuestao().getId());
            dto.setQuestaoTexto(resposta.getQuestao().getTexto());
        }
        return dto;
    }

    public static QuestaoResponseDTO toQuestao(Questao questao) {
        QuestaoResponseDTO dto = new QuestaoResponseDTO();
        dto.setId(questao.getId());
        dto.setTexto(questao.getTexto());
        dto.setTipo(questao.getTipo());
        dto.setOpcoes(questao.getOpcoes());
        dto.setObrigatorio(questao.isObrigatorio());
        dto.setSecao(questao.getSecao());
        if (questao.getFormulario() != null) {
            dto.setFormularioId(questao.getFormulario().getId());
        }
        return dto;
    }

    public static FormularioResponseDTO toFormulario(Formulario formulario) {
        FormularioResponseDTO dto = new FormularioResponseDTO();
        dto.setId(formulario.getId());
        dto.setTitulo(formulario.getTitulo());
        dto.setTextoParaRespostaLivre(formulario.getTextoParaRespostaLivre());
        dto.setDataCriacao(formulario.getDataCriacao());
        if (formulario.getEstudo() != null) {
            dto.setEstudoId(formulario.getEstudo().getId());
        }
        return dto;
    }

    public static DoencaResponseDTO toDoenca(Doenca doenca) {
        DoencaResponseDTO dto = new DoencaResponseDTO();
        dto.setId(doenca.getId());
        dto.setCodigo(doenca.getCodigo());
        dto.setNomeCientifico(doenca.getNomeCientifico());
        dto.setNomePopular(doenca.getNomePopular());
        dto.setVocabulario(doenca.getVocabulario());
        return dto;
    }
}
