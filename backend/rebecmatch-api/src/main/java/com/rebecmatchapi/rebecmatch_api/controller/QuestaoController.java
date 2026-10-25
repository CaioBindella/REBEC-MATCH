package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.DtoMapper;
import com.rebecmatchapi.rebecmatch_api.dto.Questao.QuestaoCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Questao.QuestaoResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Questao.QuestaoUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.service.QuestaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/questoes")
@RequiredArgsConstructor
public class QuestaoController {

    private final QuestaoService questaoService;

    @PostMapping
    public ResponseEntity<QuestaoResponseDTO> createQuestao(@RequestBody QuestaoCreateDTO dto,
                                                            @AuthenticationPrincipal Usuario usuario) {
        var novaQuestao = questaoService.createQuestao(dto, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(DtoMapper.toQuestao(novaQuestao));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestaoResponseDTO> getQuestaoById(@PathVariable Integer id) {
        return ResponseEntity.ok(DtoMapper.toQuestao(questaoService.getQuestaoById(id)));
    }

    // Questões de um formulário (ou de todos, se o formulário não for informado)
    @GetMapping
    public ResponseEntity<List<QuestaoResponseDTO>> getQuestoes(@RequestParam(required = false) Integer formularioId) {
        return ResponseEntity.ok(questaoService.getQuestoes(formularioId).stream().map(DtoMapper::toQuestao).toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestaoResponseDTO> updateQuestao(@PathVariable Integer id, @RequestBody QuestaoUpdateDTO dto,
                                                            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(DtoMapper.toQuestao(questaoService.updateQuestao(id, dto, usuario)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestao(@PathVariable Integer id, @AuthenticationPrincipal Usuario usuario) {
        questaoService.deleteQuestao(id, usuario);
        return ResponseEntity.noContent().build();
    }
}
