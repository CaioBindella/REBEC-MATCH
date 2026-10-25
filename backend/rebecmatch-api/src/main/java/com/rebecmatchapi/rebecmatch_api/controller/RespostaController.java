package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.DtoMapper;
import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostaCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostaResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostaUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostasBatchCreateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Resposta;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.service.RespostaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Respostas aos formulários. A gravação é feita sempre em nome do voluntário autenticado; a leitura é
 * permitida ao titular e aos pesquisadores dos estudos aos quais ele se candidatou.
 */
@RestController
@RequestMapping("/api/v1/respostas")
@RequiredArgsConstructor
public class RespostaController {

    private final RespostaService respostaService;

    @PostMapping
    public ResponseEntity<RespostaResponseDTO> createResposta(@Valid @RequestBody RespostaCreateDTO dto,
                                                              @AuthenticationPrincipal Usuario usuario) {
        Resposta novaResposta = respostaService.createResposta(dto, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(DtoMapper.toResposta(novaResposta));
    }

    // Envio de todas as respostas de um formulário em uma única requisição
    @PostMapping("/batch")
    public ResponseEntity<List<RespostaResponseDTO>> createRespostasEmLote(@Valid @RequestBody RespostasBatchCreateDTO dto,
                                                                           @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(toDTOs(respostaService.createRespostasEmLote(dto, usuario)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RespostaResponseDTO> getRespostaById(@PathVariable Integer id, @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(DtoMapper.toResposta(respostaService.getRespostaById(id, usuario)));
    }

    @GetMapping("/voluntario/{voluntarioId}")
    public ResponseEntity<List<RespostaResponseDTO>> getRespostasByVoluntario(@PathVariable Integer voluntarioId,
                                                                              @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(toDTOs(respostaService.getRespostasByVoluntarioId(voluntarioId, usuario)));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<RespostaResponseDTO>> getRespostasByUsuario(@PathVariable Integer usuarioId,
                                                                           @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(toDTOs(respostaService.listarPorUsuario(usuarioId, usuario)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RespostaResponseDTO> updateResposta(@PathVariable Integer id, @RequestBody RespostaUpdateDTO dto,
                                                              @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(DtoMapper.toResposta(respostaService.updateResposta(id, dto, usuario)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResposta(@PathVariable Integer id, @AuthenticationPrincipal Usuario usuario) {
        respostaService.deleteResposta(id, usuario);
        return ResponseEntity.noContent().build();
    }

    private static List<RespostaResponseDTO> toDTOs(List<Resposta> respostas) {
        return respostas.stream().map(DtoMapper::toResposta).toList();
    }
}
