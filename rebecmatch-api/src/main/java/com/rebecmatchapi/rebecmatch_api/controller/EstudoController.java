package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.DtoMapper;
import com.rebecmatchapi.rebecmatch_api.dto.Estudo.EstudoCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Estudo.EstudoResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Estudo.EstudoUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Estudo;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.service.EstudoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/estudos")
@RequiredArgsConstructor
public class EstudoController {

    private final EstudoService estudoService;

    // O estudo é vinculado ao pesquisador autenticado
    @PostMapping
    public ResponseEntity<EstudoResponseDTO> createEstudo(@Valid @RequestBody EstudoCreateDTO dto,
                                                          @AuthenticationPrincipal Usuario usuario) {
        Estudo novoEstudo = estudoService.createEstudo(dto, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(DtoMapper.toEstudo(novoEstudo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstudoResponseDTO> getEstudoById(@PathVariable Integer id) {
        return ResponseEntity.ok(DtoMapper.toEstudo(estudoService.getEstudoById(id)));
    }

    // Estudos em recrutamento por nome popular ou científico de doença
    @GetMapping("/busca")
    public ResponseEntity<List<EstudoResponseDTO>> buscarPorDoenca(@RequestParam String termo) {
        return ResponseEntity.ok(toDTOs(estudoService.buscarEstudosPorDoenca(termo)));
    }

    @GetMapping
    public ResponseEntity<List<EstudoResponseDTO>> getAllEstudos() {
        return ResponseEntity.ok(toDTOs(estudoService.getAllEstudos()));
    }

    @GetMapping("/pesquisador/{pesquisadorId}")
    public ResponseEntity<List<EstudoResponseDTO>> getEstudosByPesquisador(@PathVariable Integer pesquisadorId) {
        return ResponseEntity.ok(toDTOs(estudoService.getEstudosByPesquisadorId(pesquisadorId)));
    }

    @GetMapping("/recrutando")
    public ResponseEntity<List<EstudoResponseDTO>> getEstudosRecrutando() {
        return ResponseEntity.ok(toDTOs(estudoService.getEstudosRecrutando()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstudoResponseDTO> updateEstudo(@PathVariable Integer id, @Valid @RequestBody EstudoUpdateDTO dto,
                                                          @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(DtoMapper.toEstudo(estudoService.updateEstudo(id, dto, usuario)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstudo(@PathVariable Integer id, @AuthenticationPrincipal Usuario usuario) {
        estudoService.deleteEstudo(id, usuario);
        return ResponseEntity.noContent().build();
    }

    private static List<EstudoResponseDTO> toDTOs(List<Estudo> estudos) {
        return estudos.stream().map(DtoMapper::toEstudo).toList();
    }
}
