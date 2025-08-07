package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Voluntario.VoluntarioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Voluntario.VoluntarioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.Voluntario;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoEspecifico;
import com.rebecmatchapi.rebecmatch_api.exception.BusinessException;
import com.rebecmatchapi.rebecmatch_api.repository.UsuarioRepository;
import com.rebecmatchapi.rebecmatch_api.repository.VoluntarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VoluntarioService {
    private final VoluntarioRepository voluntarioRepository;
    private final UsuarioRepository usuarioRepository;

    public Voluntario creteVoluntario(VoluntarioCreateDTO dto){
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(
                        () -> new RuntimeException("Usuario com ID" + dto.getUsuarioId() + "não encontrado.")
                );
        // Garante que o usuário já não tem um perfil associado.
        if (usuario.getPesquisador() != null || usuario.getVoluntario() != null) {
            throw new BusinessException("Usuário com ID " + usuario.getId() + " já possui um perfil de pesquisador ou voluntário associado.");
        }

        // Garante que o usuário foi criado como VOLUNTARIO.
        if (usuario.getTipoEspecifico() != TipoEspecifico.VOLUNTARIO) {
            throw new BusinessException("Não é possível criar um perfil de voluntário para um usuário que não é do tipo VOLUNTARIO.");
        }

        Voluntario novoVoluntario = new Voluntario();

        novoVoluntario.setDistancia(dto.getDistancia());
        novoVoluntario.setNomeFicticio(dto.getNomeFicticio());
        novoVoluntario.setUsuario(usuario);

        return voluntarioRepository.save(novoVoluntario);
    }

    public Voluntario updateVoluntario(Integer id, VoluntarioUpdateDTO dto) {
        Voluntario voluntarioExistente = voluntarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voluntário não encontrado."));

        // Atualiza os campos a partir do DTO
        voluntarioExistente.setDistancia(dto.getDistancia());
        voluntarioExistente.setNomeFicticio(dto.getNomeFicticio());

        return voluntarioRepository.save(voluntarioExistente);
    }

    public Voluntario getById(Integer id){
        return voluntarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Voluntário não encontrado.") );
    }

    public List<Voluntario> listAll() {
        return voluntarioRepository.findAll();
    }

    public void delete(Integer id){
        voluntarioRepository.deleteById(id);
    }
}
