package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Criterio.CriterioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Criterio.CriterioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Busca;
import com.rebecmatchapi.rebecmatch_api.entity.Criterio;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.BuscaRepository;
import com.rebecmatchapi.rebecmatch_api.repository.CriterioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CriterioService {

    private final CriterioRepository criterioRepository;
    private final BuscaRepository buscaRepository;

    public Criterio createCriterio(CriterioCreateDTO dto) {
        Busca busca = buscaRepository.findById(dto.getBuscaId())
                .orElseThrow(() -> new ResourceNotFoundException("Busca com ID " + dto.getBuscaId() + " não encontrada."));
        Criterio novoCriterio = new Criterio();
        novoCriterio.setTexto(dto.getTexto());
        novoCriterio.setBusca(busca);
        return criterioRepository.save(novoCriterio);
    }

    public Criterio getCriterioById(Integer id) {
        return criterioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Critério com ID " + id + " não encontrado."));
    }

    public List<Criterio> getAllCriterios() {
        return criterioRepository.findAll();
    }

    public Criterio updateCriterio(Integer id, CriterioUpdateDTO dto) {
        Criterio criterioExistente = getCriterioById(id);
        criterioExistente.setTexto(dto.getTexto());
        return criterioRepository.save(criterioExistente);
    }

    public void deleteCriterio(Integer id) {
        if (!criterioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Critério com ID " + id + " não encontrado para exclusão.");
        }
        criterioRepository.deleteById(id);
    }
}
