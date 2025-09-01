package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Criterio.CriterioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Criterio.CriterioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Criterio;
import com.rebecmatchapi.rebecmatch_api.entity.Estudo;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.CriterioRepository;
import com.rebecmatchapi.rebecmatch_api.repository.EstudoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CriterioService {

    private final CriterioRepository criterioRepository;
    private final EstudoRepository estudoRepository;

    public Criterio createCriterio(CriterioCreateDTO dto) {
        Estudo estudo = estudoRepository.findById(dto.getEstudoId())
                .orElseThrow(() -> new ResourceNotFoundException("Estudo com ID " + dto.getEstudoId() + " não encontrado."));
        Criterio novoCriterio = new Criterio();

        novoCriterio.setInclusionCriteria(dto.getInclusionCriteria());
        novoCriterio.setAgeMin(dto.getAgeMin());
        novoCriterio.setAgeMax(dto.getAgeMax());
        novoCriterio.setGender(dto.getGender());
        novoCriterio.setExclusionCriteria(dto.getExclusionCriteria());
        novoCriterio.setEstudo(estudo);

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

        criterioExistente.setInclusionCriteria(dto.getInclusionCriteria());
        criterioExistente.setAgeMin(dto.getAgeMin());
        criterioExistente.setAgeMax(dto.getAgeMax());
        criterioExistente.setGender(dto.getGender());
        criterioExistente.setExclusionCriteria(dto.getExclusionCriteria());

        return criterioRepository.save(criterioExistente);
    }

    public void deleteCriterio(Integer id) {
        if (!criterioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Critério com ID " + id + " não encontrado para exclusão.");
        }
        criterioRepository.deleteById(id);
    }
}