package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Voluntario.VoluntarioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Voluntario.VoluntarioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.Voluntario;
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
