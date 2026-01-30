package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostaCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostaResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostaUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostasBatchCreateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Resposta;
import com.rebecmatchapi.rebecmatch_api.service.RespostaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/respostas")
@RequiredArgsConstructor
public class RespostaController {

    private final RespostaService respostaService;

    @PostMapping
    public ResponseEntity<RespostaResponseDTO> createResposta(@RequestBody RespostaCreateDTO dto) {
        Resposta novaResposta = respostaService.createResposta(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(novaResposta));
    }

    @PostMapping("/batch")
    public ResponseEntity<Void> createRespostasEmLote(@RequestBody RespostasBatchCreateDTO dto) {
        respostaService.createRespostasEmLote(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RespostaResponseDTO> getRespostaById(@PathVariable Integer id) {
        Resposta resposta = respostaService.getRespostaById(id);
        return ResponseEntity.ok(toResponseDTO(resposta));
    }

    @GetMapping
    public ResponseEntity<List<RespostaResponseDTO>> getAllRespostas() {
        List<Resposta> respostas = respostaService.getAllRespostas();
        List<RespostaResponseDTO> dtos = respostas.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/voluntario/{voluntarioId}")
    public ResponseEntity<List<RespostaResponseDTO>> getRespostasByVoluntario(@PathVariable Integer voluntarioId) {
        List<Resposta> respostas = respostaService.getRespostasByVoluntarioId(voluntarioId);
        List<RespostaResponseDTO> dtos = respostas.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RespostaResponseDTO> updateResposta(@PathVariable Integer id, @RequestBody RespostaUpdateDTO dto) {
        Resposta respostaAtualizada = respostaService.updateResposta(id, dto);
        return ResponseEntity.ok(toResponseDTO(respostaAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResposta(@PathVariable Integer id) {
        respostaService.deleteResposta(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<RespostaResponseDTO>> getRespostasByUsuario(@PathVariable Integer usuarioId) {
        List<Resposta> respostas = respostaService.listarPorUsuario(usuarioId);

        List<RespostaResponseDTO> dtos = respostas.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    private RespostaResponseDTO toResponseDTO(Resposta resposta) {
        RespostaResponseDTO dto = new RespostaResponseDTO();
        dto.setId(resposta.getId());
        dto.setConteudo(resposta.getConteudo());
        dto.setMarcado(resposta.isMarcado());
        if (resposta.getVoluntario() != null) {
            dto.setVoluntarioId(resposta.getVoluntario().getId());
        }
        if (resposta.getQuestao() != null) {
            dto.setQuestaoId(resposta.getQuestao().getId());
        }
        return dto;
    }
}