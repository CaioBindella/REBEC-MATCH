package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Questao.QuestaoCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Questao.QuestaoResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Questao.QuestaoUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Questao;
import com.rebecmatchapi.rebecmatch_api.service.QuestaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/questoes")
@RequiredArgsConstructor
public class QuestaoController {

    private final QuestaoService questaoService;

    @PostMapping
    public ResponseEntity<QuestaoResponseDTO> createQuestao(@RequestBody QuestaoCreateDTO dto) {
        Questao novaQuestao = questaoService.createQuestao(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(novaQuestao));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestaoResponseDTO> getQuestaoById(@PathVariable Integer id) {
        Questao questao = questaoService.getQuestaoById(id);
        return ResponseEntity.ok(toResponseDTO(questao));
    }

    @GetMapping
    public ResponseEntity<List<QuestaoResponseDTO>> getAllQuestoes() {
        List<Questao> questoes = questaoService.getAllQuestoes();
        List<QuestaoResponseDTO> dtos = questoes.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestaoResponseDTO> updateQuestao(@PathVariable Integer id, @RequestBody QuestaoUpdateDTO dto) {
        Questao questaoAtualizada = questaoService.updateQuestao(id, dto);
        return ResponseEntity.ok(toResponseDTO(questaoAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestao(@PathVariable Integer id) {
        questaoService.deleteQuestao(id);
        return ResponseEntity.noContent().build();
    }

    private QuestaoResponseDTO toResponseDTO(Questao questao) {
        QuestaoResponseDTO dto = new QuestaoResponseDTO();
        dto.setId(questao.getId());
        dto.setTexto(questao.getTexto());
        dto.setTipo(questao.getTipo());
        dto.setOpcoes(questao.getOpcoes());
        dto.setObrigatorio(questao.isObrigatorio());
        if (questao.getFormulario() != null) {
            dto.setFormularioId(questao.getFormulario().getId());
        }
        return dto;
    }
}
