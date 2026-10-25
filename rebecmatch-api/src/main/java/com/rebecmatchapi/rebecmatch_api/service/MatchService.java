package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.entity.*;
import com.rebecmatchapi.rebecmatch_api.entity.enums.StatusRecrutamento;
import com.rebecmatchapi.rebecmatch_api.exception.ForbiddenException;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.EstudoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.MatchResultRepository;
import com.rebecmatchapi.rebecmatch_api.service.ElegibilidadeService.ResultadoElegibilidade;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Mecanismo de compatibilidade automática e registro dos matches.
 * <p>
 * A compatibilidade é uma filtragem baseada em regras sobre os critérios estruturados (idade e sexo),
 * usada para reduzir o universo de estudos apresentados ao voluntário. Ela nunca decide a elegibilidade:
 * a aprovação de cada candidatura permanece com o pesquisador e o match só é registrado após a
 * confirmação das duas partes (ver CandidaturaService).
 */
@Service
@RequiredArgsConstructor
public class MatchService {

    private final EstudoRepository estudoRepository;
    private final MatchResultRepository matchResultRepository;
    private final AcessoService acessoService;
    private final ElegibilidadeService elegibilidadeService;

    /**
     * Estudos em recrutamento cujos critérios de idade e sexo são atendidos pelo voluntário autenticado.
     */
    @Transactional(readOnly = true)
    public List<Estudo> listarEstudosCompativeis(Usuario usuario) {
        acessoService.voluntarioDo(usuario);
        LocalDate hoje = LocalDate.now();
        return estudoRepository.findByRecruitmentStatusIgnoreCase(StatusRecrutamento.RECRUTANDO.getRotulo()).stream()
                .filter(estudo -> elegibilidadeService
                        .melhorResultado(estudo.getCriterios(), usuario.getDataNascimento(), usuario.getSexo(), hoje)
                        .map(ResultadoElegibilidade::elegivel)
                        .orElse(false))
                .toList();
    }

    /**
     * Registra o match de uma candidatura confirmada pelas duas partes, guardando quantos dos
     * critérios estruturados (idade mínima, idade máxima e sexo) o voluntário atende.
     */
    public MatchResult registrarMatch(Candidatura candidatura) {
        Usuario usuario = candidatura.getVoluntario().getUsuario();
        Optional<ResultadoElegibilidade> resultado = elegibilidadeService.melhorResultado(
                candidatura.getEstudo().getCriterios(), usuario.getDataNascimento(), usuario.getSexo(), LocalDate.now());

        MatchResult match = new MatchResult();
        match.setVoluntario(candidatura.getVoluntario());
        match.setEstudo(candidatura.getEstudo());
        match.setCriteriosAtendidos(resultado.map(ResultadoElegibilidade::criteriosAtendidos).orElse(0));
        match.setJustificativa(resultado
                .map(r -> "Match confirmado pelo pesquisador e pelo voluntário. Critérios estruturados atendidos: "
                        + r.criteriosAtendidos() + " de " + ElegibilidadeService.CRITERIOS_ESTRUTURADOS
                        + " (idade mínima, idade máxima e sexo).")
                .orElse("Match confirmado pelo pesquisador e pelo voluntário. O estudo não possui critérios estruturados cadastrados."));
        return matchResultRepository.save(match);
    }

    /** Matches do usuário autenticado: os seus, se voluntário; os dos seus estudos, se pesquisador. */
    @Transactional(readOnly = true)
    public List<MatchResult> listarMatches(Usuario usuario) {
        Optional<Voluntario> voluntario = acessoService.voluntarioOpcional(usuario);
        if (voluntario.isPresent()) {
            return matchResultRepository.findByVoluntarioId(voluntario.get().getId());
        }
        return matchResultRepository.findByEstudoPesquisadorId(acessoService.pesquisadorDo(usuario).getId());
    }

    @Transactional(readOnly = true)
    public MatchResult buscarMatch(Integer id, Usuario usuario) {
        MatchResult match = matchResultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match com ID " + id + " não encontrado."));
        boolean ehVoluntario = match.getVoluntario().getUsuario().getId().equals(usuario.getId());
        boolean ehPesquisador = match.getEstudo().getPesquisador().getUsuario().getId().equals(usuario.getId());
        if (!ehVoluntario && !ehPesquisador) {
            throw new ForbiddenException("Você só pode consultar matches dos quais participa.");
        }
        return match;
    }
}
