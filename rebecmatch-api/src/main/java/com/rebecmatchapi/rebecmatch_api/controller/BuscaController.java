package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Busca.BuscaCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Busca.BuscaResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Busca.BuscaUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Busca;
import com.rebecmatchapi.rebecmatch_api.service.BuscaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/buscas")
@RequiredArgsConstructor
public class BuscaController {

    private final BuscaService buscaService;

    @PostMapping
    public ResponseEntity<BuscaResponseDTO> createBusca(@RequestBody BuscaCreateDTO dto) {
        Busca novaBusca = buscaService.createBusca(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(novaBusca));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuscaResponseDTO> getBuscaById(@PathVariable Integer id) {
        Busca busca = buscaService.getBuscaById(id);
        return ResponseEntity.ok(toResponseDTO(busca));
    }

    @GetMapping
    public ResponseEntity<List<BuscaResponseDTO>> getAllBuscas() {
        List<Busca> buscas = buscaService.getAllBuscas();
        List<BuscaResponseDTO> dtos = buscas.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BuscaResponseDTO> updateBusca(@PathVariable Integer id, @RequestBody BuscaUpdateDTO dto) {
        Busca buscaAtualizada = buscaService.updateBusca(id, dto);
        return ResponseEntity.ok(toResponseDTO(buscaAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBusca(@PathVariable Integer id) {
        buscaService.deleteBusca(id);
        return ResponseEntity.noContent().build();
    }

    private BuscaResponseDTO toResponseDTO(Busca busca) {
        BuscaResponseDTO dto = new BuscaResponseDTO();
        dto.setId(busca.getId());
        dto.setNome(busca.getNome());
        if (busca.getPesquisador() != null) {
            dto.setPesquisadorId(busca.getPesquisador().getId());
        }
        return dto;
    }
}
