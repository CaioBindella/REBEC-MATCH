package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.entity.Doenca;
import com.rebecmatchapi.rebecmatch_api.repository.DoencaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/doencas")
@RequiredArgsConstructor
public class DoencaController {

    private final DoencaRepository doencaRepository;

    @GetMapping
    public ResponseEntity<List<Doenca>> listAll() {
        // Retorna todas as doenças para o autocomplete
        return ResponseEntity.ok(doencaRepository.findAll());
    }
}
