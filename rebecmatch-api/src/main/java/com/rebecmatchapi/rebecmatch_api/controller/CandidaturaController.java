package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Candidatura.CandidatoDetalhadoDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Candidatura.CandidaturaCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Candidatura.CandidaturaResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.DtoMapper;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.service.CandidaturaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/candidaturas")
@RequiredArgsConstructor
public class CandidaturaController {

    private final CandidaturaService candidaturaService;

    // Voluntário autenticado se candidata a um estudo
    @PostMapping
    public ResponseEntity<CandidaturaResponseDTO> candidatar(@Valid @RequestBody CandidaturaCreateDTO dto,
                                                             @AuthenticationPrincipal Usuario usuario) {
        var candidatura = candidaturaService.criarCandidatura(dto.getEstudoId(), usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(DtoMapper.toCandidatura(candidatura));
    }

    // Pesquisador responsável aprova ou recusa a candidatura inicial. Corpo JSON: true ou false
    @PatchMapping("/{id}/analise-pesquisador")
    public ResponseEntity<CandidaturaResponseDTO> analisePesquisador(@PathVariable Integer id,
                                                                     @RequestBody boolean aprovado,
                                                                     @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(DtoMapper.toCandidatura(candidaturaService.processarPeloPesquisador(id, aprovado, usuario)));
    }

    // Voluntário confirma (ou recusa) a participação final. Corpo JSON: true ou false
    @PatchMapping("/{id}/confirmacao-voluntario")
    public ResponseEntity<CandidaturaResponseDTO> confirmacaoVoluntario(@PathVariable Integer id,
                                                                        @RequestBody boolean aceito,
                                                                        @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(DtoMapper.toCandidatura(candidaturaService.confirmarPeloVoluntario(id, aceito, usuario)));
    }

    @GetMapping("/estudo/{estudoId}")
    public ResponseEntity<List<CandidaturaResponseDTO>> listarPorEstudo(@PathVariable Integer estudoId,
                                                                        @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(candidaturaService.listarPorEstudo(estudoId, usuario).stream()
                .map(DtoMapper::toCandidatura).toList());
    }

    @GetMapping("/voluntario/{voluntarioId}")
    public ResponseEntity<List<CandidaturaResponseDTO>> listarPorVoluntario(@PathVariable Integer voluntarioId,
                                                                            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(candidaturaService.listarPorVoluntario(voluntarioId, usuario).stream()
                .map(DtoMapper::toCandidatura).toList());
    }

    @GetMapping("/pesquisador/{pesquisadorId}")
    public ResponseEntity<List<CandidatoDetalhadoDTO>> listarPorPesquisador(@PathVariable Integer pesquisadorId,
                                                                            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(candidaturaService.listarPorPesquisador(pesquisadorId, usuario));
    }
}
