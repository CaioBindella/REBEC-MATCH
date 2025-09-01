package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Match.MatchDataDTO;
import com.rebecmatchapi.rebecmatch_api.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
