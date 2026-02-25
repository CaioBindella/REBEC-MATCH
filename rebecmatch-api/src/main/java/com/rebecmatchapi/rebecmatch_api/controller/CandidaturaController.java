package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Candidatura.CandidatoDetalhadoDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Candidatura.CandidaturaCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Candidatura.CandidaturaResponseDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Candidatura;
import com.rebecmatchapi.rebecmatch_api.service.CandidaturaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/candidaturas")
@RequiredArgsConstructor
public class CandidaturaController {

    private final CandidaturaService candidaturaService;

    // Voluntário se candidata
    @PostMapping
    public ResponseEntity<CandidaturaResponseDTO> candidatar(@RequestBody CandidaturaCreateDTO dto) {
        Candidatura candidatura = candidaturaService.criarCandidatura(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTO(candidatura));
    }

    // Pesquisador aprova ou recusa a candidatura inicial
    // Exemplo de corpo JSON: true ou false
    @PatchMapping("/{id}/analise-pesquisador")
    public ResponseEntity<CandidaturaResponseDTO> analisePesquisador(
            @PathVariable Integer id,
            @RequestBody boolean aprovado) {
        Candidatura atualizada = candidaturaService.processarPeloPesquisador(id, aprovado);
        return ResponseEntity.ok(toDTO(atualizada));
    }

    // Voluntário confirma participação final
    @PatchMapping("/{id}/confirmacao-voluntario")
    public ResponseEntity<CandidaturaResponseDTO> confirmacaoVoluntario(
            @PathVariable Integer id,
            @RequestBody boolean aceito) {
        Candidatura atualizada = candidaturaService.confirmarPeloVoluntario(id, aceito);
        return ResponseEntity.ok(toDTO(atualizada));
    }

    @GetMapping("/estudo/{estudoId}")
    public ResponseEntity<List<CandidaturaResponseDTO>> listarPorEstudo(@PathVariable Integer estudoId) {
        List<Candidatura> list = candidaturaService.listarPorEstudo(estudoId);
        return ResponseEntity.ok(list.stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/voluntario/{voluntarioId}")
    public ResponseEntity<List<CandidaturaResponseDTO>> listarPorVoluntario(@PathVariable Integer voluntarioId) {
        List<Candidatura> list = candidaturaService.listarPorVoluntario(voluntarioId);
        return ResponseEntity.ok(list.stream().map(this::toDTO).collect(Collectors.toList()));
    }

    @GetMapping("/pesquisador/{pesquisadorId}")
    public ResponseEntity<List<CandidatoDetalhadoDTO>> listarPorPesquisador(@PathVariable Integer pesquisadorId) {
        List<CandidatoDetalhadoDTO> list = candidaturaService.listarPorPesquisador(pesquisadorId);
        return ResponseEntity.ok(list);
    }

    private CandidaturaResponseDTO toDTO(Candidatura c) {
        CandidaturaResponseDTO dto = new CandidaturaResponseDTO();
        dto.setId(c.getId());
        dto.setVoluntarioId(c.getVoluntario().getId());
        dto.setVoluntarioNome(c.getVoluntario().getNomeFicticio());
        dto.setEstudoId(c.getEstudo().getId());
        dto.setEstudoTitulo(c.getEstudo().getPublicTitle());
        dto.setStatus(c.getStatus());
        dto.setDataCandidatura(c.getDataCandidatura());

        if (c.getEstudo().getPesquisador() != null) {
            dto.setPesquisadorNomeFicticio(c.getEstudo().getPesquisador().getNomeFicticio());
            dto.setPesquisadorId(c.getEstudo().getPesquisador().getId());
        }

        return dto;
    }
}