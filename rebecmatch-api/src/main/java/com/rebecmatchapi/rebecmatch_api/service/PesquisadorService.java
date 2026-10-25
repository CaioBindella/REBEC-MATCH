package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.entity.Pesquisador;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.PesquisadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * O perfil de pesquisador é criado junto com a conta (UsuarioService ou importação automatizada)
 * e removido junto com ela. A consulta expõe apenas dados pseudonimizados.
 */
@Service
@RequiredArgsConstructor
public class PesquisadorService {
    private final PesquisadorRepository pesquisadorRepository;

    @Transactional(readOnly = true)
    public Pesquisador getById(Integer id) {
        return pesquisadorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pesquisador não encontrado."));
    }

    @Transactional(readOnly = true)
    public List<Pesquisador> listAll() {
        return pesquisadorRepository.findAll();
    }
}
