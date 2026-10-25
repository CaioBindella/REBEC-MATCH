package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Criterio.CriterioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Criterio.CriterioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Criterio.CriterioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.DtoMapper;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.service.CriterioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/criterios")
@RequiredArgsConstructor
public class CriterioController {

    private final CriterioService criterioService;

    @PostMapping
    public ResponseEntity<CriterioResponseDTO> createCriterio(@Valid @RequestBody CriterioCreateDTO dto,
                                                              @AuthenticationPrincipal Usuario usuario) {
        var novoCriterio = criterioService.createCriterio(dto, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(DtoMapper.toCriterio(novoCriterio));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CriterioResponseDTO> getCriterioById(@PathVariable Integer id) {
        return ResponseEntity.ok(DtoMapper.toCriterio(criterioService.getCriterioById(id)));
    }

    // Critérios de elegibilidade de um estudo
    @GetMapping
    public ResponseEntity<List<CriterioResponseDTO>> getCriteriosDoEstudo(@RequestParam Integer estudoId) {
        return ResponseEntity.ok(criterioService.getCriteriosDoEstudo(estudoId).stream()
                .map(DtoMapper::toCriterio).toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CriterioResponseDTO> updateCriterio(@PathVariable Integer id, @Valid @RequestBody CriterioUpdateDTO dto,
                                                              @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(DtoMapper.toCriterio(criterioService.updateCriterio(id, dto, usuario)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCriterio(@PathVariable Integer id, @AuthenticationPrincipal Usuario usuario) {
        criterioService.deleteCriterio(id, usuario);
        return ResponseEntity.noContent().build();
    }
}
