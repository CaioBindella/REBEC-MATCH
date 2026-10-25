package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.DtoMapper;
import com.rebecmatchapi.rebecmatch_api.dto.Estudo.EstudoResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Match.MatchResultResponseDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Compatibilidade automática e consulta dos matches. O registro de um match não é exposto como
 * endpoint: ele é gerado exclusivamente pelo fluxo de candidatura, após a confirmação das duas partes.
 */
@RestController
@RequestMapping("/api/v1/match")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    // Estudos em recrutamento compatíveis com a idade e o sexo do voluntário autenticado
    @GetMapping("/estudos-compativeis")
    public ResponseEntity<List<EstudoResponseDTO>> listarEstudosCompativeis(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(matchService.listarEstudosCompativeis(usuario).stream()
                .map(DtoMapper::toEstudo).toList());
    }

    // Matches do usuário autenticado (como voluntário ou como pesquisador responsável)
    @GetMapping
    public ResponseEntity<List<MatchResultResponseDTO>> listarMatches(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(matchService.listarMatches(usuario).stream().map(DtoMapper::toMatch).toList());
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<MatchResultResponseDTO> getMatchResultById(@PathVariable Integer id,
                                                                     @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(DtoMapper.toMatch(matchService.buscarMatch(id, usuario)));
    }
}
