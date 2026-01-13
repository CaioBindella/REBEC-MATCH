package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Match.MatchDataDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Match.MatchResultCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Match.MatchResultResponseDTO;
import com.rebecmatchapi.rebecmatch_api.entity.MatchResult;
import com.rebecmatchapi.rebecmatch_api.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/match")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;
    @GetMapping("/dados")
    public ResponseEntity<MatchDataDTO> gerarDadosParaMatch() {
        MatchDataDTO matchData = matchService.gerarDadosParaMatch();
        return ResponseEntity.ok(matchData);
    }

    @GetMapping("/DadosFiltrados")
    public ResponseEntity<MatchDataDTO> getDadosFiltradosGlobais() {
        MatchDataDTO dadosFiltrados = matchService.generateGlobalFilteredMatchData();
        return ResponseEntity.ok(dadosFiltrados);
    }

    @PostMapping("/save")
    public ResponseEntity<MatchResultResponseDTO> saveMatchResult(@RequestBody MatchResultCreateDTO dto) {
        MatchResult savedMatch = matchService.saveMatchResult(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(savedMatch));
    }

    @GetMapping
    public ResponseEntity<List<MatchResultResponseDTO>> getAllMatchResults() {
        List<MatchResult> matches = matchService.getAllMatchResults();
        List<MatchResultResponseDTO> dtos = matches.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatchResultResponseDTO> getMatchResultById(@PathVariable Integer id) {
        MatchResult match = matchService.getMatchResultById(id);
        return ResponseEntity.ok(toResponseDTO(match));
    }

    private MatchResultResponseDTO toResponseDTO(MatchResult matchResult) {
        MatchResultResponseDTO dto = new MatchResultResponseDTO();
        dto.setId(matchResult.getId());
        dto.setCriteriosAtendidos(matchResult.getCriteriosAtendidos());
        dto.setDataMatch(matchResult.getDataMatch());
        dto.setJustificativa(matchResult.getJustificativa());

        if (matchResult.getVoluntario() != null) {
            dto.setVoluntarioId(matchResult.getVoluntario().getId());
            dto.setVoluntarioNomeFicticio(matchResult.getVoluntario().getNomeFicticio());
        }

        if (matchResult.getEstudo() != null) {
            dto.setEstudoId(matchResult.getEstudo().getId());
            dto.setEstudoPublicTitle(matchResult.getEstudo().getPublicTitle());
        }

        return dto;
    }
}
