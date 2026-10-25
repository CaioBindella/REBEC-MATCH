package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.entity.Estudo;
import com.rebecmatchapi.rebecmatch_api.entity.Pesquisador;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.Voluntario;
import com.rebecmatchapi.rebecmatch_api.exception.ForbiddenException;
import com.rebecmatchapi.rebecmatch_api.repository.CandidaturaRepository;
import com.rebecmatchapi.rebecmatch_api.repository.PesquisadorRepository;
import com.rebecmatchapi.rebecmatch_api.repository.VoluntarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Regras de propriedade e de compartilhamento de dados entre os perfis.
 * <p>
 * O perfil do usuário (voluntário ou pesquisador) é sempre obtido a partir do usuário autenticado
 * pelo token, nunca de um identificador enviado pelo cliente.
 */
@Service
@RequiredArgsConstructor
public class AcessoService {

    private final VoluntarioRepository voluntarioRepository;
    private final PesquisadorRepository pesquisadorRepository;
    private final CandidaturaRepository candidaturaRepository;

    public Voluntario voluntarioDo(Usuario usuario) {
        return voluntarioRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new ForbiddenException("Esta operação é exclusiva de voluntários."));
    }

    public Pesquisador pesquisadorDo(Usuario usuario) {
        return pesquisadorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new ForbiddenException("Esta operação é exclusiva de pesquisadores."));
    }

    public Optional<Voluntario> voluntarioOpcional(Usuario usuario) {
        return voluntarioRepository.findByUsuarioId(usuario.getId());
    }

    public Optional<Pesquisador> pesquisadorOpcional(Usuario usuario) {
        return pesquisadorRepository.findByUsuarioId(usuario.getId());
    }

    /** Garante que o estudo pertence ao pesquisador autenticado. */
    public void exigirDonoDoEstudo(Usuario usuario, Estudo estudo) {
        Pesquisador pesquisador = pesquisadorDo(usuario);
        if (estudo.getPesquisador() == null || !estudo.getPesquisador().getId().equals(pesquisador.getId())) {
            throw new ForbiddenException("Você só pode gerenciar os seus próprios estudos.");
        }
    }

    /** Garante que o identificador de usuário informado é o do próprio usuário autenticado. */
    public void exigirTitular(Usuario usuario, Integer usuarioId) {
        if (!usuario.getId().equals(usuarioId)) {
            throw new ForbiddenException("Você só pode acessar os dados da sua própria conta.");
        }
    }

    /**
     * Os dados de perfil e de saúde de um voluntário são visíveis ao próprio voluntário e, de forma
     * pseudonimizada, apenas aos pesquisadores responsáveis por estudos aos quais ele se candidatou.
     */
    public void exigirAcessoAoVoluntario(Usuario usuario, Voluntario voluntario) {
        if (voluntario.getUsuario() != null && voluntario.getUsuario().getId().equals(usuario.getId())) {
            return;
        }
        Optional<Pesquisador> pesquisador = pesquisadorOpcional(usuario);
        if (pesquisador.isPresent()
                && candidaturaRepository.existsByVoluntarioIdAndEstudoPesquisadorId(voluntario.getId(), pesquisador.get().getId())) {
            return;
        }
        throw new ForbiddenException("Os dados deste voluntário só são compartilhados com pesquisadores dos estudos aos quais ele se candidatou.");
    }
}
