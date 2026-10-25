package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.DtoMapper;
import com.rebecmatchapi.rebecmatch_api.dto.Pesquisador.PesquisadorResponseDTO;
import com.rebecmatchapi.rebecmatch_api.service.PesquisadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Consulta do perfil público (pseudonimizado) dos pesquisadores. O perfil é criado junto com a conta.
 */
@RestController
@RequestMapping("/api/v1/pesquisadores")
@RequiredArgsConstructor
public class PesquisadorController {

    private final PesquisadorService pesquisadorService;

    @GetMapping("/{id}")
    public ResponseEntity<PesquisadorResponseDTO> getPesquisadorById(@PathVariable Integer id) {
        return ResponseEntity.ok(DtoMapper.toPesquisador(pesquisadorService.getById(id)));
    }

    @GetMapping
    public ResponseEntity<List<PesquisadorResponseDTO>> listAll() {
        return ResponseEntity.ok(pesquisadorService.listAll().stream().map(DtoMapper::toPesquisador).toList());
    }
}
