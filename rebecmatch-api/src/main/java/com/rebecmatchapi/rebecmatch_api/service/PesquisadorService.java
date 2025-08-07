package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Pesquisador.PesquisadorCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Pesquisador.PesquisadorUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Pesquisador;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoEspecifico;
import com.rebecmatchapi.rebecmatch_api.exception.BusinessException;
import com.rebecmatchapi.rebecmatch_api.repository.PesquisadorRepository;
import com.rebecmatchapi.rebecmatch_api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PesquisadorService {
    private final PesquisadorRepository pesquisadorRepository;
    private final UsuarioRepository usuarioRepository;

    public Pesquisador createPesquisador(PesquisadorCreateDTO dto){
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(
                        () -> new RuntimeException("Usuario com ID" + dto.getUsuarioId() + "não encontrado.")
                );

        if (usuario.getPesquisador() != null || usuario.getVoluntario() != null) {
            throw new BusinessException("Usuário com ID " + usuario.getId() + " já possui um perfil de pesquisador ou voluntário associado.");
        }

        // 3. VERIFICAÇÃO DE TIPO: Garante que o usuário foi criado como PESQUISADOR.
        if (usuario.getTipoEspecifico() != TipoEspecifico.PESQUISADOR) {
            throw new BusinessException("Não é possível criar um perfil de pesquisador para um usuário que não é do tipo PESQUISADOR.");
        }

        Pesquisador novoPesquisador = new Pesquisador();

        novoPesquisador.setNomeFicticio(dto.getNomeFicticio());
        novoPesquisador.setUsuario(usuario);

        return pesquisadorRepository.save(novoPesquisador);
    }

    public Pesquisador updatePesquisador(Integer id, PesquisadorUpdateDTO dto){
        Pesquisador pesquisadorExistente = pesquisadorRepository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Pesquisador não encontrado.")
                );

        pesquisadorExistente.setNomeFicticio(dto.getNomeFicticio());

        return pesquisadorRepository.save(pesquisadorExistente);
    }

    public  Pesquisador getById(Integer id){
        return pesquisadorRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Pesquisador não encontrado.")
                );
    }

    public List<Pesquisador> listAll() {
        return pesquisadorRepository.findAll();
    }

    public void delete(Integer id){
        pesquisadorRepository.deleteById(id);
    }
}
