package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.entity.Notificacao;
import com.rebecmatchapi.rebecmatch_api.service.NotificacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {
    private final NotificacaoService service;

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<Notificacao>> listar(@PathVariable Integer id) {
        return ResponseEntity.ok(service.listarPorUsuario(id));
    }

    @PatchMapping("/{id}/ler")
    public ResponseEntity<Void> marcarComoLida(@PathVariable Integer id) {
        service.marcarComoLida(id);
        return ResponseEntity.noContent().build();
    }
}
