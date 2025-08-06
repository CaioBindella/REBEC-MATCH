package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Criterio.CriterioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Criterio.CriterioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Criterio.CriterioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Criterio;
import com.rebecmatchapi.rebecmatch_api.service.CriterioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/criterios")
@RequiredArgsConstructor
public class CriterioController {

    private final CriterioService criterioService;

    @PostMapping
    public ResponseEntity<CriterioResponseDTO> createCriterio(@RequestBody CriterioCreateDTO dto) {
        Criterio novoCriterio = criterioService.createCriterio(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(novoCriterio));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CriterioResponseDTO> getCriterioById(@PathVariable Integer id) {
        Criterio criterio = criterioService.getCriterioById(id);
        return ResponseEntity.ok(toResponseDTO(criterio));
    }

    @GetMapping
    public ResponseEntity<List<CriterioResponseDTO>> getAllCriterios() {
        List<Criterio> criterios = criterioService.getAllCriterios();
        List<CriterioResponseDTO> dtos = criterios.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CriterioResponseDTO> updateCriterio(@PathVariable Integer id, @RequestBody CriterioUpdateDTO dto) {
        Criterio criterioAtualizado = criterioService.updateCriterio(id, dto);
        return ResponseEntity.ok(toResponseDTO(criterioAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCriterio(@PathVariable Integer id) {
        criterioService.deleteCriterio(id);
        return ResponseEntity.noContent().build();
    }

    private CriterioResponseDTO toResponseDTO(Criterio criterio) {
        CriterioResponseDTO dto = new CriterioResponseDTO();
        dto.setId(criterio.getId());
        dto.setTexto(criterio.getTexto());
        if (criterio.getBusca() != null) {
            dto.setBuscaId(criterio.getBusca().getId());
        }
        return dto;
    }
}