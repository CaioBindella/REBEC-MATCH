package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Voluntario.VoluntarioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.Voluntario;
import com.rebecmatchapi.rebecmatch_api.exception.ForbiddenException;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.VoluntarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * O perfil de voluntário é criado junto com a conta (UsuarioService) e removido junto com ela.
 */
@Service
@RequiredArgsConstructor
public class VoluntarioService {
    private final VoluntarioRepository voluntarioRepository;
    private final AcessoService acessoService;

    @Transactional(readOnly = true)
    public Voluntario getById(Integer id, Usuario usuario) {
        Voluntario voluntario = buscar(id);
        acessoService.exigirAcessoAoVoluntario(usuario, voluntario);
        return voluntario;
    }

    @Transactional
    public Voluntario updateVoluntario(Integer id, VoluntarioUpdateDTO dto, Usuario usuario) {
        Voluntario voluntarioExistente = buscar(id);
        if (!voluntarioExistente.getUsuario().getId().equals(usuario.getId())) {
            throw new ForbiddenException("Você só pode alterar o seu próprio perfil.");
        }
        voluntarioExistente.setDistancia(dto.getDistancia());
        return voluntarioRepository.save(voluntarioExistente);
    }

    private Voluntario buscar(Integer id) {
        return voluntarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Voluntário não encontrado."));
    }
}
