package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Doenca.DoencaResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.DtoMapper;
import com.rebecmatchapi.rebecmatch_api.service.DoencaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/doencas")
@RequiredArgsConstructor
public class DoencaController {

    private final DoencaService doencaService;

    // Sugestões do autocompletar (até 20 condições), a partir de três caracteres digitados
    @GetMapping
    public ResponseEntity<List<DoencaResponseDTO>> sugerir(@RequestParam String termo) {
        return ResponseEntity.ok(doencaService.sugerir(termo).stream().map(DtoMapper::toDoenca).toList());
    }
}
